import { requireAuthOrRedirect, getSession, getLists, saveLists } from "./storage.js";
import { getPokemonsCached } from "./api.js";
import { initMenu, updateMenuCounts } from "./menu.js";
import { findPokemonById } from "./utils_pr1.js";

function fmtId(id) {
  return "#" + String(id).padStart(3, "0");
}

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function renderButtons(p) {
  const session = getSession();
  const lists = getLists(session.username);

  const inTeam = lists.team.includes(p.id);
  const inWish = lists.wishlist.includes(p.id);

  const btnTeam = document.querySelector("#btnTeam");
  const btnWish = document.querySelector("#btnWish");

  btnTeam.textContent = inTeam ? "Treure de l'equip" : "Afegir a l'equip";
  btnWish.textContent = inWish ? "Treure de desitjos" : "Afegir a desitjos";

  btnTeam.onclick = () => {
    const l = getLists(session.username);
    const idx = l.team.indexOf(p.id);
    if (idx >= 0) {
      l.team.splice(idx, 1);
      alert("Pokemon eliminat de l'equip.");
    } else {
      if (l.team.length >= 6) return alert("L'equip ja té 6 Pokémon (màxim).");
      l.team.push(p.id);
      alert("Pokemon afegit a l'equip.");
    }
    saveLists(session.username, l);
    updateMenuCounts();
    renderButtons(p);
  };

  btnWish.onclick = () => {
    const l = getLists(session.username);
    const idx = l.wishlist.indexOf(p.id);
    if (idx >= 0) {
      l.wishlist.splice(idx, 1);
      alert("Pokemon eliminat de desitjos.");
    } else {
      l.wishlist.push(p.id);
      alert("Pokemon afegit a desitjos.");
    }
    saveLists(session.username, l);
    updateMenuCounts();
    renderButtons(p);
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  requireAuthOrRedirect();
  initMenu();

  const id = getIdFromURL();
  const all = await getPokemonsCached();
  const p = findPokemonById(all, id); //PART útil de la PR1 unificada

  if (!p) {
    alert("Pokemon no trobat.");
    window.location.href = "./pokemons.html";
    return;
  }

  document.querySelector("#title").textContent = `${fmtId(p.id)} ${p.name}`;
  document.querySelector("#img").src = p.sprites?.official || p.sprites?.front || "";
  document.querySelector("#desc").textContent = p.description || "Sense descripció";

  document.querySelector("#meta").innerHTML = `
    <li><strong>Altura:</strong> ${p.height}</li>
    <li><strong>Pes:</strong> ${p.weight}</li>
    <li><strong>Experiència base:</strong> ${p.baseExperience}</li>
    <li><strong>Tipus:</strong> ${(p.types || []).join(", ")}</li>
    <li><strong>Habilitats:</strong> ${(p.abilities || []).join(", ")}</li>
  `;

  const stats = document.querySelector("#stats");
  stats.innerHTML = "";
  (p.stats || []).forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name}: ${s.value}`;
    stats.appendChild(li);
  });

  renderButtons(p);

  // Botó tornar: sempre a pokemons.html (manté filtres perquè els guardem a localStorage)
  document.querySelector("#btnBack").addEventListener("click", () => {
    window.location.href = "./pokemons.html";
  });
});
