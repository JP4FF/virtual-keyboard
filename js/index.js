// const display = document.querySelector("#display-text");
// const keyboard = document.querySelector("#keyboard");
// const keys = document.querySelectorAll(
//   "#keyboard .keyboard__row .keyboard__key"
// );
// const helpKey = document.querySelector("#help-key");
// const footer = document.querySelector(".footer");
// // ================================================================
// helpKey.addEventListener("click", helpHint);
// function helpHint() {
//   if (!helpKey.classList.contains("active")) {
//     helpKey.classList.add("active");
//     footer.classList.add("help-active");
//   } else {
//     helpKey.classList.remove("active");
//     footer.classList.remove("help-active");
//   }
// }
// // ================================================================
// keys.forEach((item) => {
//   item.addEventListener("click", (e) => showKeys(e));
// });
// function showKeys(e) {
//   display.innerText += e.target.innerText;
// }
// // ================================================================
import Keyboard from "./modules/keyboard.js";
import KEYS_LAYOUT from "./modules/keys-layout.js";

const keyboard = new Keyboard(KEYS_LAYOUT);

window.addEventListener("DOMContentLoaded", function () {
  keyboard.initPage();
  keyboard.initKeyboard();
  keyboard._createKeys();
});
