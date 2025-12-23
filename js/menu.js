import { getSession, clearSession, getLists } from "./storage.js";

export function initMenu() {
  const session = getSession();
  const menu = document.querySelector("#menu");
  if (!menu) return;

  if (!session?.username) {
    menu.classList.add("hidden");
    return;
  }

  menu.classList.remove("hidden");
  const userSpan = document.querySelector("#menuUser");
  if (userSpan) userSpan.textContent = session.username;

  updateMenuCounts();

  const btnLogout = document.querySelector("#btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      clearSession();
      window.location.href = "./index.html";
    });
  }
}

export function updateMenuCounts() {
  const session = getSession();
  if (!session?.username) return;
  const lists = getLists(session.username);

  const teamCount = document.querySelector("#teamCount");
  const wishCount = document.querySelector("#wishCount");

  if (teamCount) teamCount.textContent = lists.team.length;
  if (wishCount) wishCount.textContent = lists.wishlist.length;
}
