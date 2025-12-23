import { POBLACIONES } from "./dades.js";
import { Usuario } from "./clases.js";
import { getUsers, saveUsers } from "./storage.js";

function isValidEmail(email) {
  // patró simple
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(pw) {
  // mínim 8, lletres, números, i un especial
  const min8 = pw.length >= 8;
  const hasLetter = /[A-Za-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return min8 && hasLetter && hasNumber && hasSpecial;
}

function fillPoblaciones() {
  const select = document.querySelector("#poblacion");
  select.innerHTML = `<option value="">-- Tria població --</option>`;
  for (const p of POBLACIONES) {
    const opt = document.createElement("option");
    opt.value = p.nombre;
    opt.textContent = p.nombre;
    select.appendChild(opt);
  }
}

function autoFillCPFromPoblacion() {
  const select = document.querySelector("#poblacion");
  const cpInput = document.querySelector("#cp");
  select.addEventListener("change", () => {
    const p = POBLACIONES.find(x => x.nombre === select.value);
    if (p) cpInput.value = p.cp;
  });
}

function validateCPWithPoblacion() {
  const select = document.querySelector("#poblacion");
  const cpInput = document.querySelector("#cp");

  // si posen CP abans, intentem trobar població
  cpInput.addEventListener("blur", () => {
    const p = POBLACIONES.find(x => x.cp === cpInput.value.trim());
    if (p) select.value = p.nombre;
  });
}

function emailAutocomplete() {
  const email = document.querySelector("#email");
  email.addEventListener("input", () => {
    // quan escriu @, ho substituïm per @uoc.edu
    if (email.value.includes("@") && !email.value.includes("@uoc.edu")) {
      const left = email.value.split("@")[0];
      email.value = `${left}@uoc.edu`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fillPoblaciones();
  autoFillCPFromPoblacion();
  validateCPWithPoblacion();
  emailAutocomplete();

  const form = document.querySelector("#registerForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.querySelector("#nombre").value.trim();
    const apellidos = document.querySelector("#apellidos").value.trim();
    const direccion = document.querySelector("#direccion").value.trim();
    const poblacion = document.querySelector("#poblacion").value.trim();
    const cp = document.querySelector("#cp").value.trim();
    const email = document.querySelector("#email").value.trim();
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value;

    if (!nombre) return alert("Nom: no pot estar buit.");
    if (!apellidos) return alert("Cognoms: no pot estar buit.");
    if (!direccion) return alert("Adreça: no pot estar buit.");

    // població i cp
    if (!poblacion) return alert("Població: selecciona una població.");
    const p = POBLACIONES.find(x => x.nombre === poblacion);
    if (!p) return alert("Població no vàlida.");
    if (cp !== p.cp) return alert("Codi postal no coincideix amb la població seleccionada.");

    if (!email) return alert("Email: no pot estar buit.");
    if (!isValidEmail(email)) return alert("Email no vàlid. Exemple: email@dominio.com");
    if (!username) return alert("Usuari: no pot estar buit.");

    const users = getUsers();
    if (users.some(u => u.username === username)) {
      return alert("Aquest usuari ja existeix.");
    }

    if (!isValidPassword(password)) {
      return alert("Contrasenya: mínim 8 caràcters, lletres, números i 1 especial.");
    }

    const u = new Usuario({ nombre, apellidos, direccion, poblacion, cp, email, username, password });
    users.push(u.toJSON());
    saveUsers(users);

    alert("Usuari creat! Ara fes login.");
    window.location.href = "./index.html";
  });

  document.querySelector("#btnBack").addEventListener("click", () => {
    window.location.href = "./index.html";
  });
});
