const items = [
  ["Capitão América: O Primeiro Vingador","2011"],["Homem de Ferro","2008"],["Homem de Ferro 2","2010"],["O Incrível Hulk","2008"],["Thor","2011"],["Os Vingadores","2012"],["Thor: O Mundo Sombrio","2013"],["Homem de Ferro 3","2013"],["Capitão América: O Soldado Invernal","2014"],["Guardiões da Galáxia","2014"],["Guardiões da Galáxia Vol. 2","2017"],["Vingadores: Era de Ultron","2015"],["Capitão América: Guerra Civil","2016"],["Viúva Negra","2021"],["Homem-Aranha: De Volta ao Lar","2017"],["Doutor Estranho","2016"],["Pantera Negra","2018"],["Thor: Ragnarok","2017"],["Vingadores: Guerra Infinita","2018"],["Homem-Formiga e a Vespa","2018"],["Vingadores: Ultimato","2019"],["Loki — 1ª Temporada","2021"],["Loki — 2ª Temporada","2023"],["Homem-Aranha: Longe de Casa","2019"],["Shang-Chi e a Lenda dos Dez Anéis","2021"],["Eternos","2021"],["Homem-Aranha: Sem Volta para Casa","2021"],["Doutor Estranho no Multiverso da Loucura","2022"],["Thor: Amor e Trovão","2022"],["Pantera Negra: Wakanda Para Sempre","2022"],["Homem-Formiga e a Vespa: Quantumania","2023"],["Guardiões da Galáxia Vol. 3","2023"],["Deadpool & Wolverine","2024"],["Capitão América: Admirável Mundo Novo","2025"],["Thunderbolts*","2025"],["Quarteto Fantástico: Primeiros Passos","2025"],["Homem-Aranha: Um Novo Dia","2026"],
];
const admin = document.body.dataset.admin === "true";
let state = {}, filter = "all", query = "", busy = false, loaded = false;
const $ = (id) => document.getElementById(id);
// Keep save feedback independent of the optional page footer.
function setStatus(message) {
  let status = $("status");
  if (!status) {
    status = document.createElement("p");
    status.id = "status";
    status.setAttribute("role", "status");
    $("results").after(status);
  }
  status.textContent = message;
}
const norm = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
async function request(path, data) {
  const response = await fetch(path, { cache: "no-store", ...(data ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) } : {}) });
  const value = await response.json();
  if (!response.ok) throw Error(value.error || "Não foi possível atualizar.");
  return value;
}
function render() {
  const list = $("list"); list.innerHTML = ""; let done = 0, shown = 0;
  items.forEach(([title, year], id) => {
    const checked = !!state[id]; if (checked) done++;
    if ((filter === "done" && !checked) || (filter === "pending" && checked) || !norm(title).includes(norm(query))) return;
    shown++; const li = document.createElement("li"); li.className = checked ? "done" : "";
    li.innerHTML = `<span class="num">${id + 1}</span><span class="box"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="4 12 9 18 20 6"/></svg></span><span class="txt"><span class="title"></span><div class="year">${year} · ${checked ? "Assistido" : "Para assistir"}</div></span>`;
    li.querySelector(".title").textContent = title;
    if (admin && loaded) { li.tabIndex = 0; li.setAttribute("role", "checkbox"); li.setAttribute("aria-checked", String(checked)); const toggle = () => update(id, !checked); li.addEventListener("click", toggle); li.addEventListener("keydown", (event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); toggle(); } }); }
    list.append(li);
  });
  if (!shown) list.innerHTML = '<li class="empty">Nenhum título encontrado.</li>';
  $("count").textContent = loaded ? `${done}/${items.length}` : `—/${items.length}`;
  $("fill").style.width = `${done / items.length * 100}%`;
  $("results").textContent = loaded ? `${shown} títulos exibidos · ${done} de ${items.length} assistidos` : "Carregando progresso…";
  const next = items.findIndex((_, id) => !state[id]); $("next").textContent = !loaded ? "Carregando…" : next < 0 ? "Maratona completa!" : `${String(next + 1).padStart(2, "0")} · ${items[next][0]}`;
}
async function refresh() {
  if (busy || document.hidden) return;
  try {
    const result = await request("/api/progress");
    if (busy) return;
    const changed = !loaded || items.some((_, id) => !!state[id] !== !!result.state[id]);
    state = result.state; loaded = true;
    if (changed) { render(); setStatus(admin ? "Alterações salvas online" : "Lista compartilhada · Atualização automática"); }
  }
  catch { if (!busy) setStatus("Não foi possível carregar a lista. Tentando novamente…"); }
}
async function update(id, done) {
  if (busy) return; busy = true;
  try { setStatus("Salvando…"); state = (await request("/api/progress", { id, done })).state; render(); setStatus("Alteração salva para todos"); }
  catch (error) { setStatus(error.message); } finally { busy = false; }
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => { filter = button.dataset.filter; document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button))); render(); }));
$("search").addEventListener("input", (event) => { query = event.target.value; render(); });
if (admin) {
  $("logout").addEventListener("click", async () => { if (busy) return; try { await request("/api/logout", {}); location.replace("/admin/"); } catch (error) { setStatus(error.message); } });
  $("reset").addEventListener("click", async () => { if (busy || !confirm("Desmarcar todos os filmes para todo o grupo?")) return; busy = true; try { setStatus("Reiniciando…"); state = (await request("/api/reset", {})).state; render(); setStatus("Maratona reiniciada para todos"); } catch (error) { setStatus(error.message); } finally { busy = false; } });
}
render(); refresh(); setInterval(refresh, 5000); document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });


if (document.body.dataset.admin === "true") {
  const gate = document.createElement("div");
  gate.className = "admin-gate";
  gate.setAttribute("role", "dialog");
  gate.setAttribute("aria-modal", "true");
  gate.setAttribute("aria-label", "Acesso de administrador");
  gate.style.cssText = "position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:rgba(4,6,11,.86);backdrop-filter:blur(4px)";
  gate.innerHTML = '<form style="width:min(100%,420px);padding:30px;background:#131923;color:#f4f5f7;border:1px solid #7d382f;border-top:4px solid #ed1d24;border-radius:8px;box-shadow:0 22px 80px #000;font-family:Segoe UI,Arial,sans-serif"><h1 style="margin:0 0 12px;font-size:28px">Acesso de administrador</h1><p>Digite sua senha para editar a maratona.</p><label for="admin-password">Senha</label><input id="admin-password" type="password" autocomplete="current-password" required maxlength="256" style="display:block;width:100%;box-sizing:border-box;margin:8px 0 16px;padding:12px"><button type="submit" style="width:100%;padding:12px;background:#ed1d24;border:0;color:white;font-weight:700">Entrar</button><p role="alert"></p></form>';
  gate.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = gate.querySelector("input");
    const error = gate.querySelector("[role=alert]");
    const submit = gate.querySelector("button");
    if (submit.disabled) return;
    submit.disabled = true;
    submit.textContent = "Entrando…";
    error.textContent = "";
    try {
      const response = await fetch("/api/login", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:input.value})});
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Senha incorreta.");
      gate.remove();
      document.querySelector(".wrap").inert = false;
      await refresh();
      $("search").focus();
    } catch (reason) { error.textContent = reason.message || "Não foi possível entrar."; }
    finally { submit.disabled = false; submit.textContent = "Entrar"; }
  });
  document.body.append(gate);
  document.querySelector(".wrap").inert = true;
  gate.querySelector("input").focus();
}
