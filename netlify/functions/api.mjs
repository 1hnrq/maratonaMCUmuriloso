import { getStore } from "@netlify/blobs";

const encoder = new TextEncoder();
const headers = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "same-origin",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'self'; base-uri 'none'; frame-ancestors 'none'",
};
const respond = (value, status = 200, extra = {}) =>
  new Response(JSON.stringify(value), { status, headers: { ...headers, ...extra } });
const hash = async (value) => {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
};
const same = (a, b) => {
  let difference = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    difference |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return difference === 0;
};
const cookieName = (request) =>
  new URL(request.url).protocol === "https:" ? "__Host-mcu_admin" : "mcu_admin_local";
const cookie = (request, value, seconds) =>
  `${cookieName(request)}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${seconds}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
const originOK = (request) => {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
};
const store = () => getStore({ name: "maratona-mcu", consistency: "strong" });
async function isAdmin(request) {
  const token = request.headers.get("cookie")?.split(";").map((part) => part.trim())
    .find((part) => part.startsWith(cookieName(request) + "="))?.split("=")[1];
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  const sessions = (await store().get("sessions", { type: "json", consistency: "strong" })) || {};
  const id = await hash(token);
  if (!sessions[id] || sessions[id] < Date.now()) return false;
  return true;
}
async function getProgress() {
  return (await store().get("progress", { type: "json", consistency: "strong" })) || {};
}
async function readJSON(request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new Error("invalid");
  const text = await request.text();
  if (text.length > 4096) throw new Error("invalid");
  return JSON.parse(text);
}
export default async (request) => {
  try {
    const pathname = new URL(request.url).pathname;
    if (request.method === "GET" && pathname === "/api/progress") return respond({ state: await getProgress() });
    if (request.method !== "POST") return respond({ error: "Não encontrado." }, 404);
    if (!originOK(request)) return respond({ error: "Solicitação não autorizada." }, 403);

    if (pathname === "/api/login") {
      const configuredPassword = process.env.ADMIN_PASSWORD;
      if (!configuredPassword) return respond({ error: "A senha de administrador ainda não foi configurada." }, 503);
      const input = await readJSON(request);
      if (typeof input.password !== "string" || input.password.length > 256 || !same(input.password, configuredPassword))
        return respond({ error: "Senha incorreta." }, 401);
      const raw = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
      const sessions = (await store().get("sessions", { type: "json", consistency: "strong" })) || {};
      const now = Date.now();
      for (const [key, expiration] of Object.entries(sessions)) if (expiration < now) delete sessions[key];
      sessions[await hash(raw)] = now + 12 * 60 * 60 * 1000;
      await store().setJSON("sessions", sessions);
      return respond({ ok: true }, 200, { "Set-Cookie": cookie(request, raw, 43200) });
    }

    if (!(await isAdmin(request))) return respond({ error: "Entre com a senha de administrador para editar." }, 401);
    if (pathname === "/api/logout") return respond({ ok: true }, 200, { "Set-Cookie": cookie(request, "", 0) });
    if (pathname === "/api/progress") {
      const input = await readJSON(request);
      if (!Number.isInteger(input.id) || input.id < 0 || input.id > 36 || typeof input.done !== "boolean")
        return respond({ error: "Título inválido." }, 400);
      const progress = await getProgress();
      progress[input.id] = input.done;
      await store().setJSON("progress", progress);
      return respond({ state: progress });
    }
    if (pathname === "/api/reset") {
      await store().setJSON("progress", {});
      return respond({ state: {} });
    }
    return respond({ error: "Não encontrado." }, 404);
  } catch (error) {
    console.error("MCU API error", error instanceof Error ? error.message : "unknown");
    return respond({ error: "Não foi possível concluir. Tente novamente." }, 503);
  }
};
export const config = { path: "/api/*" };
