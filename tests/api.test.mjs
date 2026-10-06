import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../netlify/functions/api.mjs', import.meta.url), 'utf8');
const mock = `const data = new Map(); const getStore = () => ({get: async key => structuredClone(data.get(key)), setJSON: async (key,value) => data.set(key,structuredClone(value))});`;
const { default: handler } = await import('data:text/javascript;base64,' + Buffer.from(source.replace('import { getStore } from "@netlify/blobs";', mock)).toString('base64'));
process.env.ADMIN_PASSWORD = 'test-password-not-for-production';
const base = 'https://mcu.example';
function call(route, data, cookie, extra = {}) {
  return handler(new Request(base + route, {
    method: data === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base, ...(cookie ? { Cookie: cookie } : {}), ...extra },
    ...(data === undefined ? {} : { body: typeof data === 'string' ? data : JSON.stringify(data) }),
  }));
}
async function login() {
  const response = await call('/api/login', {password: process.env.ADMIN_PASSWORD});
  assert.equal(response.status, 200);
  const setCookie = response.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly; SameSite=Strict; Path=/);
  assert.match(setCookie, /; Secure/);
  return setCookie.split(';')[0];
}

test('public reads are allowed; anonymous writes and resets are blocked', async () => {
  assert.equal((await call('/api/progress')).status, 200);
  assert.equal((await call('/api/progress', {id:0,done:true})).status, 401);
  assert.equal((await call('/api/reset', {})).status, 401);
});
test('login rejects wrong password, malformed input and foreign origins', async () => {
  assert.equal((await call('/api/login', {password:'incorrect'})).status, 401);
  for (const input of ['{', 'null', '[]', '123', '"text"', 'x'.repeat(4097)]) {
    assert.equal((await call('/api/login', input)).status, 400);
  }
  assert.equal((await call('/api/login', {}, null, {Origin:'https://other.example'})).status, 403);
});
test('authenticated updates persist; invalid titles are rejected; reset clears progress', async () => {
  const cookie = await login();
  assert.equal((await call('/api/progress', {id:2,done:true}, cookie)).status, 200);
  assert.equal((await (await call('/api/progress')).json()).state[2], true);
  assert.equal((await call('/api/progress', {id:37,done:true}, cookie)).status, 200);
  const progress = (await (await call('/api/progress')).json()).state;
  assert.equal(progress[37], true);
  assert.equal(progress[2], true);
  for (const data of [{id:-1,done:true},{id:38,done:true},{id:0,done:'yes'}]) {
    assert.equal((await call('/api/progress', data, cookie)).status, 400);
  }
  assert.equal((await call('/api/progress', {id:2,done:false}, cookie, {Origin:'https://other.example'})).status, 403);
  assert.equal((await call('/api/reset', {}, cookie)).status, 200);
  assert.deepEqual((await (await call('/api/progress')).json()).state, {});
});
test('logout revokes the old token on the server and is safe to repeat', async () => {
  const cookie = await login();
  const other = await login();
  const response = await call('/api/logout', {}, cookie);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await call('/api/progress', {id:0,done:true}, cookie)).status, 401);
  assert.equal((await call('/api/progress', {id:0,done:true}, other)).status, 200);
  assert.equal((await call('/api/logout', {}, cookie)).status, 200);
  assert.equal((await call('/api/logout', {})).status, 200);
});
test('sessions expire after twelve hours', async () => {
  const cookie = await login();
  const originalNow = Date.now;
  try {
    const future = originalNow() + 13 * 60 * 60 * 1000;
    Date.now = () => future;
    assert.equal((await call('/api/progress', {id:0,done:true}, cookie)).status, 401);
  } finally { Date.now = originalNow; }
});
