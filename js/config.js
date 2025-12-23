// js/config.js
export const API_BASE = "https://pokeapi.co/api/v2";
export const POKEMON_LIMIT = 151;     // 1a generació
export const PAGE_SIZE = 20;          // quants es mostren per "Load more"

// Claus de localStorage (evitem col·lisions)
export const LS_KEYS = {
  USERS: "pr2_users",
  SESSION: "pr2_session",
  POKEMONS_CACHE: "pr2_pokemons_cache_v1",
  UI_STATE: "pr2_ui_state" // per guardar filtres/paginació
};
