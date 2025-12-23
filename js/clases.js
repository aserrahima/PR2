// js/clases.js
export class Usuario {
  constructor({ nombre, apellidos, direccion, poblacion, cp, email, username, password }) {
    this._nombre = nombre;
    this._apellidos = apellidos;
    this._direccion = direccion;
    this._poblacion = poblacion;
    this._cp = cp;
    this._email = email;
    this._username = username;
    this._password = password; // (per pràctica: text pla)
  }

  get nombre() { return this._nombre; }
  set nombre(v) { this._nombre = v; }

  get apellidos() { return this._apellidos; }
  set apellidos(v) { this._apellidos = v; }

  get direccion() { return this._direccion; }
  set direccion(v) { this._direccion = v; }

  get poblacion() { return this._poblacion; }
  set poblacion(v) { this._poblacion = v; }

  get cp() { return this._cp; }
  set cp(v) { this._cp = v; }

  get email() { return this._email; }
  set email(v) { this._email = v; }

  get username() { return this._username; }
  set username(v) { this._username = v; }

  get password() { return this._password; }
  set password(v) { this._password = v; }

  toJSON() {
    return {
      nombre: this._nombre,
      apellidos: this._apellidos,
      direccion: this._direccion,
      poblacion: this._poblacion,
      cp: this._cp,
      email: this._email,
      username: this._username,
      password: this._password
    };
  }
}

export class Pokemon {
  constructor({ id, name, description, height, weight, baseExperience, abilities = [], types = [], sprites = {}, stats = [] }) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._height = height;
    this._weight = weight;
    this._baseExperience = baseExperience;
    this._abilities = abilities;
    this._types = types;
    this._sprites = sprites;
    this._stats = stats;
  }

  get id() { return this._id; }
  set id(v) { this._id = v; }

  get name() { return this._name; }
  set name(v) { this._name = v; }

  get description() { return this._description; }
  set description(v) { this._description = v; }

  get height() { return this._height; }
  set height(v) { this._height = v; }

  get weight() { return this._weight; }
  set weight(v) { this._weight = v; }

  get baseExperience() { return this._baseExperience; }
  set baseExperience(v) { this._baseExperience = v; }

  get abilities() { return this._abilities; }
  set abilities(v) { this._abilities = v; }

  get types() { return this._types; }
  set types(v) { this._types = v; }

  get sprites() { return this._sprites; }
  set sprites(v) { this._sprites = v; }

  get stats() { return this._stats; }
  set stats(v) { this._stats = v; }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      height: this._height,
      weight: this._weight,
      baseExperience: this._baseExperience,
      abilities: this._abilities,
      types: this._types,
      sprites: this._sprites,
      stats: this._stats
    };
  }
}

export class PokemonList {
  constructor({ owner, team = [], wishlist = [] }) {
    this._owner = owner;       // username
    this._team = team;         // array ids
    this._wishlist = wishlist; // array ids
  }

  get owner() { return this._owner; }
  set owner(v) { this._owner = v; }

  get team() { return this._team; }
  set team(v) { this._team = v; }

  get wishlist() { return this._wishlist; }
  set wishlist(v) { this._wishlist = v; }

  toJSON() {
    return { owner: this._owner, team: this._team, wishlist: this._wishlist };
  }
}
