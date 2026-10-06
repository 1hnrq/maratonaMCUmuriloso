import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

test('Ant-Man is inserted without shifting existing progress and poster IDs', async () => {
  const source = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
  const catalog = vm.runInNewContext(source.slice(0, source.indexOf('const admin =')) + '\nitems');
  assert.equal(catalog.length, 38);
  assert.equal(new Set(catalog.map(item => item[2])).size, 38);
  assert.equal(catalog[11][0], 'Vingadores: Era de Ultron');
  assert.equal(catalog[12][0], 'Homem-Formiga');
  assert.equal(catalog[12][1], '2015');
  assert.equal(catalog[12][2], 37);
  assert.equal(catalog[13][0], 'Capitão América: Guerra Civil');
  for (let position = 0; position < catalog.length; position++) {
    if (position === 12) continue;
    assert.equal(catalog[position][2], position < 12 ? position : position - 1);
  }
});
