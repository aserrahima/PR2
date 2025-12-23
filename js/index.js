import { getUsers, setSession, getSession } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  // Si ja està loguejat -> pokemons
  const session = getSession();
  if (session?.username) {
    window.location.href = "./pokemons.html";
    return;
  }

  const form = document.querySelector("#loginForm");
  const btnNew = document.querySelector("#btnNewUser");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.querySelector("#loginUser").value.trim();
    const password = document.querySelector("#loginPass").value;

    const users = getUsers();
    const found = users.find(u => u.username === username && u.password === password);

    if (!found) {
      alert("Usuari o contrasenya incorrectes.");
      return;
    }

    setSession({ username });
    window.location.href = "./pokemons.html";
  });

  btnNew.addEventListener("click", () => {
    window.location.href = "./registro.html";
  });
});
