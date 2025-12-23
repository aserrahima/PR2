// js/storage.js
import { LS_KEYS } from "./config.js";
import { PokemonList } from "./clases.js";

export function loadJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Usuari / Sessió ----------
export function getUsers() {
  return loadJSON(LS_KEYS.USERS, []); // array d'objectes usuari
}

export function saveUsers(users) {
  saveJSON(LS_KEYS.USERS, users);
}

export function getSession() {
  return loadJSON(LS_KEYS.SESSION, null); // { username }
}

export function setSession(sessionObj) {
  saveJSON(LS_KEYS.SESSION, sessionObj);
}

export function clearSession() {
  localStorage.removeItem(LS_KEYS.SESSION);
}

export function requireAuthOrRedirect() {
  const session = getSession();
  if (!session?.username) {
    window.location.href = "./index.html";
  }
  return session;
}

// ---------- Llistes per usuari ----------
function listsKey(username) {
  return `pr2_lists_${username}`;
}

export function getLists(username) {
  const data = loadJSON(listsKey(username), null);
  if (!data) {
    const lists = new PokemonList({ owner: username, team: [], wishlist: [] });
    saveJSON(listsKey(username), lists.toJSON());
    return lists;
  }
  return new PokemonList(data);
}

export function saveLists(username, lists) {
  saveJSON(listsKey(username), lists.toJSON ? lists.toJSON() : lists);
}

// ---------- Estat UI (filtres/paginació) ----------
export function getUIState(username) {
  return loadJSON(`${LS_KEYS.UI_STATE}_${username}`, {
    filters: { type: "", query: "", wMin: "", wMax: "" },
    shown: 0
  });
}

export function saveUIState(username, state) {
  saveJSON(`${LS_KEYS.UI_STATE}_${username}`, state);
}
