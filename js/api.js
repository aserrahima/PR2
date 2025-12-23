// js/api.js
import { API_BASE, LS_KEYS, POKEMON_LIMIT } from "./config.js";
import { loadJSON, saveJSON } from "./storage.js";
import { Pokemon } from "./clases.js";

// Tria descripció en espanyol/català si existeix; si no, anglès
function pickFlavorText(speciesJson) {
  const entries = speciesJson.flavor_text_entries || [];
  const prefer = ["es", "ca", "en"];
  for (const lang of prefer) {
    const e = entries.find(x => x.language?.name === lang);
    if (e?.flavor_text) return e.flavor_text.replace(/\s+/g, " ").trim();
  }
  return "Sense descripció.";
}

function mapPokemon(detailJson, speciesJson) {
  const types = (detailJson.types || []).map(t => t.type.name);
  const abilities = (detailJson.abilities || []).map(a => a.ability.name);
  const stats = (detailJson.stats || []).map(s => ({
    name: s.stat.name,
    value: s.base_stat
  }));

  const sprites = {
    official: detailJson.sprites?.other?.["official-artwork"]?.front_default || "",
    front: detailJson.sprites?.front_default || ""
  };

  return new Pokemon({
    id: detailJson.id,
    name: detailJson.name,
    description: pickFlavorText(speciesJson),
    height: detailJson.height,
    weight: detailJson.weight,
    baseExperience: detailJson.base_experience,
    abilities,
    types,
    sprites,
    stats
  });
}

export async function getPokemonsCached() {
  const cached = loadJSON(LS_KEYS.POKEMONS_CACHE, null);
  if (cached?.pokemons?.length === POKEMON_LIMIT) {
    return cached.pokemons; // ja són objectes plans
  }

  // Si falla la API, que com a mínim no peti
  try {
    // 1) llista 151
    const listRes = await fetch(`${API_BASE}/pokemon?limit=${POKEMON_LIMIT}&offset=0`);
    if (!listRes.ok) throw new Error("No es pot llegir la llista de Pokémon.");
    const listJson = await listRes.json();

    // 2) per cada pokemon, agafem detail + species
    const pokemons = [];
    for (const item of listJson.results) {
      const detailRes = await fetch(item.url);
      if (!detailRes.ok) throw new Error("Error en detail Pokémon.");
      const detail = await detailRes.json();

      const speciesRes = await fetch(detail.species.url);
      if (!speciesRes.ok) throw new Error("Error en species Pokémon.");
      const species = await speciesRes.json();

      const p = mapPokemon(detail, species);
      pokemons.push(p.toJSON());
    }

    saveJSON(LS_KEYS.POKEMONS_CACHE, { pokemons, savedAt: Date.now() });
    return pokemons;
  } catch (e) {
    alert("La PokeAPI ha fallat. Torna-ho a provar més tard.\n" + e.message);

    // Si hi havia caixet parcial antic, l’usem
    const fallback = loadJSON(LS_KEYS.POKEMONS_CACHE, { pokemons: [] });
    return fallback.pokemons || [];
  }
}

// per utilitats
export function getAllTypes(pokemons) {
  const set = new Set();
  pokemons.forEach(p => (p.types || []).forEach(t => set.add(t)));
  return Array.from(set).sort();
}
