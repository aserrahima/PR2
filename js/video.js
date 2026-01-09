//Per presentar el video (ha calgut reduir-lo a 25mb)

import { requireAuthOrRedirect } from "./storage.js";
import { initMenu } from "./menu.js";

document.addEventListener("DOMContentLoaded", () => {
  requireAuthOrRedirect();
  initMenu();
});
