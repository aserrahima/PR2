// js/utils_pr1.js
// Funcions PR1 adaptades al format PR2 (pokémons plans) per l'entrega final

// PAS 4: Recursiva per buscar un Pokémon per ID dins un array
export function findPokemonById(pokemons, id, index = 0) {
  if (!Array.isArray(pokemons)) return null;
  if (index >= pokemons.length) return null;
  if (pokemons[index]?.id === id) return pokemons[index];
  return findPokemonById(pokemons, id, index + 1);
}

// PAS 5: Reduce per trobar el tipus més comú dins un array de pokémons
export function getMostCommonType(pokemons) {
  if (!Array.isArray(pokemons) || pokemons.length === 0) return null;

  const counts = pokemons.reduce((acc, p) => {
    (p.types || []).forEach(t => {
      acc[t] = (acc[t] || 0) + 1;
    });
    return acc;
  }, {});

  let bestType = null;
  let bestCount = 0;

  for (const t in counts) {
    if (counts[t] > bestCount) {
      bestCount = counts[t];
      bestType = t;
    }
  }
  return bestType;
}

// PAS 6: Map + filter per obtenir els "forts" per attack (retorna array de pokémons)
export function getStrongPokemons(pokemons, minAttack) {
  const min = Number(minAttack);
  if (!Array.isArray(pokemons) || Number.isNaN(min)) return [];

  return pokemons.filter(p => {
    const atkObj = (p.stats || []).find(s => s.name === "attack");
    const atk = atkObj ? Number(atkObj.value) : 0;
    return atk >= min;
  });
}
