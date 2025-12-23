import { requireAuthOrRedirect, getSession, getLists, saveLists } from "./storage.js";
import { getPokemonsCached } from "./api.js";
import { initMenu, updateMenuCounts } from "./menu.js";

let ALL = [];

function fmtId(id) {
  return "#" + String(id).padStart(3, "0");
}

function renderList(kind) {
  const session = getSession();
  const lists = getLists(session.username);
  const ids = kind === "team" ? lists.team : lists.wishlist;

  const container = document.querySelector("#listContainer");
  container.innerHTML = "";

  document.querySelector("#currentList").textContent = (kind === "team")
    ? "El meu equip (max 6)"
    : "Llista de desitjos";

  if (ids.length === 0) {
    container.innerHTML = `<p class="muted">No hi ha Pokémon en aquesta llista.</p>`;
    return;
  }

  ids.forEach(id => {
    const p = ALL.find(x => x.id === id);
    if (!p) return;

    const row = document.createElement("div");
    row.className = "list-item";

    const left = document.createElement("div");
    left.className = "list-left";

    const img = document.createElement("img");
    img.src = p.sprites?.official || p.sprites?.front || "";
    img.className = "thumb";
    img.alt = p.name;
    img.addEventListener("click", () => window.location.href = `./detail.html?id=${p.id}`);

    const txt = document.createElement("div");
    txt.innerHTML = `<strong>${fmtId(p.id)} ${p.name}</strong><br><span class="muted">${(p.types||[]).join(", ")}</span>`;
    txt.addEventListener("click", () => window.location.href = `./detail.html?id=${p.id}`);

    left.append(img, txt);

    const btnDel = document.createElement("button");
    btnDel.textContent = "Eliminar";
    btnDel.addEventListener("click", () => {
      const l = getLists(session.username);
      const arr = kind === "team" ? l.team : l.wishlist;
      const idx = arr.indexOf(id);
      if (idx >= 0) arr.splice(idx, 1);

      saveLists(session.username, l);
      alert("Pokemon eliminat de la llista.");
      updateMenuCounts();
      renderList(kind);
    });

    row.append(left, btnDel);
    container.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  requireAuthOrRedirect();
  initMenu();

  ALL = await getPokemonsCached();

  let current = "team";
  renderList(current);

  document.querySelector("#btnTeam").addEventListener("click", () => {
    current = "team";
    renderList(current);
  });

  document.querySelector("#btnWish").addEventListener("click", () => {
    current = "wishlist";
    renderList(current);
  });
});
