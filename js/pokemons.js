import { PAGE_SIZE } from "./config.js";
import { requireAuthOrRedirect, getSession, getLists, saveLists, getUIState, saveUIState } from "./storage.js";
import { getPokemonsCached, getAllTypes } from "./api.js";
import { initMenu, updateMenuCounts } from "./menu.js";
import { getMostCommonType, getStrongPokemons } from "./utils_pr1.js";

let ALL = [];
let FILTERED = [];
let shown = 0;

function fmtId(id) {
  return "#" + String(id).padStart(3, "0");
}

function matchesFilters(p, f) {
  // type
  if (f.type && !(p.types || []).includes(f.type)) return false;

  // query: pot ser número o nom (conté)
  if (f.query) {
    const q = f.query.toLowerCase();
    const isNum = /^\d+$/.test(q);
    if (isNum) {
      if (p.id !== Number(q)) return false;
    } else {
      if (!p.name.toLowerCase().includes(q)) return false;
    }
  }

  // weight range (PokeAPI weight està en hectograms)
  const w = Number(p.weight || 0);
  if (f.wMin !== "" && w < Number(f.wMin)) return false;
  if (f.wMax !== "" && w > Number(f.wMax)) return false;

  return true;
}

function readFiltersFromUI() {
  return {
    type: document.querySelector("#filterType").value,
    query: document.querySelector("#filterQuery").value.trim(),
    wMin: document.querySelector("#filterWMin").value.trim(),
    wMax: document.querySelector("#filterWMax").value.trim()
  };
}

function applyFilters(resetShown = true) {
  const session = getSession();
  const filters = readFiltersFromUI();

  FILTERED = ALL.filter(p => matchesFilters(p, filters));

  if (resetShown) shown = 0;

  saveUIState(session.username, { filters, shown });
  render();
}

function renderTypesOptions() {
  const select = document.querySelector("#filterType");
  const types = getAllTypes(ALL);
  select.innerHTML = `<option value="">-- Tots els tipus --</option>`;
  types.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });
}

function setFiltersToUI(filters) {
  document.querySelector("#filterType").value = filters.type || "";
  document.querySelector("#filterQuery").value = filters.query || "";
  document.querySelector("#filterWMin").value = filters.wMin || "";
  document.querySelector("#filterWMax").value = filters.wMax || "";
}

function pokemonCard(p) {
  const session = getSession();
  const lists = getLists(session.username);

  const inTeam = lists.team.includes(p.id);
  const inWish = lists.wishlist.includes(p.id);

  const div = document.createElement("div");
  div.className = "card";

  const img = document.createElement("img");
  img.src = p.sprites?.official || p.sprites?.front || "";
  img.alt = p.name;
  img.className = "poke-img";
  img.addEventListener("click", () => goDetail(p.id));

  const title = document.createElement("h3");
  title.className = "poke-title";
  title.textContent = `${fmtId(p.id)} ${p.name}`;
  title.addEventListener("click", () => goDetail(p.id));

  const types = document.createElement("p");
  types.className = "muted";
  types.textContent = `Tipus: ${(p.types || []).join(", ")}`;

  const btnTeam = document.createElement("button");
  btnTeam.textContent = inTeam ? "Treure de l'equip" : "Afegir a l'equip";
  btnTeam.addEventListener("click", () => toggleTeam(p.id));

  const btnWish = document.createElement("button");
  btnWish.textContent = inWish ? "Treure de desitjos" : "Afegir a desitjos";
  btnWish.addEventListener("click", () => toggleWish(p.id));

  const btnRow = document.createElement("div");
  btnRow.className = "row";
  btnRow.append(btnTeam, btnWish);

  div.append(img, title, types, btnRow);
  return div;
}

function render() {
  const grid = document.querySelector("#grid");
  grid.innerHTML = "";

  const slice = FILTERED.slice(0, shown + PAGE_SIZE);
  slice.forEach(p => grid.appendChild(pokemonCard(p)));
  shown = slice.length;

  // Botó Load more
  const btnMore = document.querySelector("#btnMore");
  const noMore = shown >= FILTERED.length;
  btnMore.disabled = noMore;
  btnMore.textContent = noMore ? "No hi ha més Pokémon" : "Carregar més";

  // guardem shown
  const session = getSession();
  const ui = getUIState(session.username);
  ui.shown = shown;
  saveUIState(session.username, ui);

  // info
  document.querySelector("#info").textContent = `Mostrant ${shown} de ${FILTERED.length}`;
}

function toggleTeam(id) {
  const session = getSession();
  const lists = getLists(session.username);

  const idx = lists.team.indexOf(id);
  if (idx >= 0) {
    lists.team.splice(idx, 1);
    alert("Pokemon eliminat de l'equip.");
  } else {
    if (lists.team.length >= 6) {
      return alert("L'equip ja té 6 Pokémon (màxim).");
    }
    lists.team.push(id);
    alert("Pokemon afegit a l'equip.");
  }

  saveLists(session.username, lists);
  updateMenuCounts();
  render();
}

function toggleWish(id) {
  const session = getSession();
  const lists = getLists(session.username);

  const idx = lists.wishlist.indexOf(id);
  if (idx >= 0) {
    lists.wishlist.splice(idx, 1);
    alert("Pokemon eliminat de la llista de desitjos.");
  } else {
    lists.wishlist.push(id);
    alert("Pokemon afegit a la llista de desitjos.");
  }

  saveLists(session.username, lists);
  updateMenuCounts();
  render();
}

function goDetail(id) {
  window.location.href = `./detail.html?id=${id}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  requireAuthOrRedirect();
  initMenu();

  // Carregar pokémons (1 crida “gran” si no hi ha caixet)
  ALL = await getPokemonsCached();
  FILTERED = [...ALL];

  renderTypesOptions();

  // Restaurar filtres + shown
  const session = getSession();
  const ui = getUIState(session.username);
  setFiltersToUI(ui.filters || {});
  shown = ui.shown || 0;
  applyFilters(false); // no reset

  document.querySelector("#btnApply").addEventListener("click", () => applyFilters(true));
  document.querySelector("#btnReset").addEventListener("click", () => {
    setFiltersToUI({ type: "", query: "", wMin: "", wMax: "" });
    applyFilters(true);
  });

  document.querySelector("#btnMore").addEventListener("click", () => render());



  
});
