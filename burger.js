const burgerToggle = document.querySelector("#burger__toggle"),
  burger = document.querySelector(".header__burger"),
  overlay = document.querySelector(".burger__overlay");

function burgerClick(e) {
  if (e.target.className.includes("burger__cls")) {
    overlay.classList.toggle("burger__overlay_visible");
    document.body.classList.toggle("body_lock");
  }
  if (
    e.target.className.includes("burger__overlay") ||
    e.target.className.includes("menu__item")
  ) {
    burgerToggle.checked = !burgerToggle.checked;
  }
}

burger.addEventListener("click", burgerClick);
