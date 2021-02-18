import { cards, cardsCategory } from "/cards.js";
import { burgerClick, burger } from "./burger.js";
burger.addEventListener("click", burgerClick);

let numberCategory = -1;
let gameModeFlag = false;
let newGame = true;
let randomGameArray = new Array(8);
let errorCount = 0;

const cardsDom = document.querySelector(".cards"),
  cardsCategoryDom = cardsDom.innerHTML;
const divStar = document.getElementById("star");

function deleteCard() {
  document.querySelectorAll(".cards__item").forEach((item) => {
    item.removeEventListener("click", cardClick);
  });

  document.querySelector(".cards__item").removeAttribute("onmouseout");
  cardsDom.innerHTML = "";
}

function createCards(cardElem) {
  const elem = document.createElement("div");
  elem.className = "cards__item";
  elem.innerHTML = `<div class="cards__front">
                      <div class="cards__img">
                        <img src="${cardElem.image}" alt="${cardElem.word}">
                      </div>
                    <div class="cards__title">
                      <p>${cardElem.word}</p>
                    </div>
                    <button class="flip-button"><img src="./assets/img/2arrow.png" alt=""></button>
                    </div>
                    <div class="cards__back"><p>${cardElem.translation}</p></div>
                  </div>`;
  cardsDom.appendChild(elem);
  elem.onmouseout = function () {
    if (this.classList.contains("flipped")) {
      this.classList.toggle("flipped");
    }
  };
  if (gameModeFlag) {
    gameModeCards();
  }
}

function createRandomArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function startButtonDisplay() {
  const classListStartBtn = document.getElementById("game__start-btn")
    .classList;
  gameModeFlag
    ? classListStartBtn.remove("game__start-btn_disabled")
    : classListStartBtn.add("game__start-btn_disabled");
}

function newGameBtn() {
  divStar.innerHTML = "";
  newGame = true;
  document.getElementById(
    "game__start-btn"
  ).innerHTML = `<span>Start game</span>`;
}

function changeCategory(category) {
  if (!newGame) {
    newGameBtn();
  }
  numberCategory = cardsCategory.indexOf(category);
  deleteCard();
  let menuNumber;
  if (numberCategory !== -1) {
    createRandomArray(cards[numberCategory]);
    cards[numberCategory].forEach((element) => createCards(element));
    cardsEvents();
    if (gameModeFlag) {
      startButtonDisplay();
    }
    menuNumber = numberCategory + 1;
  } else {
    //создаем карточки меню
    createCategoryCards();
    menuNumber = 0;
  }
  document.querySelector(".menu__item_active").classList.remove("menu__item_active");
  document.querySelectorAll(".menu__item")[menuNumber].classList.add("menu__item_active");
}

function createCategoryCards() {
  cardsDom.innerHTML = cardsCategoryDom;
  cardsEvents();
}

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function finalGame() {
  divStar.innerHTML = "";
  newGame = true;
  if (errorCount === 0) {
    cardsDom.innerHTML = `<img src="./assets/img/success.png" alt="">`;
    playAudio("./assets/audio/success.mp3");
  } else {
    divStar.innerHTML = `<span class="errors-span">${errorCount} errors</span>`;
    cardsDom.innerHTML = `<img src="./assets/img/failure.png" alt="">`;
    playAudio("./assets/audio/failure.mp3");
  }
  await timer(2000);
  divStar.innerHTML = "";
  createCategoryCards();
  numberCategory = -1;
  newGameBtn();
}

async function cardClick(e) {
  //переходим по меню!!!!
  if (this.classList.contains("category")) {
    changeCategory(this.children[1].children[0].innerHTML);
  } else {
    if (e.target.classList.contains("flip-button")) {
      //flip button press
      this.classList.toggle("flipped");
    } else {
      if (gameModeFlag && !newGame) {
        //game mode
        if (
          this.children[0].children[1].children[0].innerHTML ===
          randomGameArray[randomGameArray.length - 1].word
        ) {
          playAudio("./assets/audio/correct.mp3");
          this.classList.add("cards__item_disabled");
          divStar.innerHTML += `<img src="./assets/img/star.svg" alt="" class="star">`;

          randomGameArray.pop();
          await timer(500);
          if (randomGameArray.length !== 0) {
            playAudio(randomGameArray[randomGameArray.length - 1].audioSrc);
          } else {
            finalGame();
          }
        } else {
          playAudio("./assets/audio/error.mp3");
          divStar.innerHTML += `<img src="./assets/img/star wrong.svg" alt="" class="star">`;
          errorCount++;
        }
      } else if (!gameModeFlag) {
        //train mode
        let sndPath = cards[numberCategory].find(
          (x) => x.word === this.children[0].children[1].children[0].innerHTML
        ).audioSrc;
        playAudio(sndPath);
      }
    }
  }
}

function playAudio(sndPath) {
  let snd = new Audio(sndPath);
  snd.play();
  snd.currentTime = 0;
}

function cardsEvents() {
  document.querySelectorAll(".cards__item").forEach((item) => {
    item.addEventListener("click", cardClick);
  });
}

function gameModeCards() {
  document.querySelectorAll(".cards__item").forEach((item) => {
    if (numberCategory !== -1) {
      item.children[0].children[1].classList.add("disabled");
      item.children[0].children[2].classList.add("disabled");
      item.children[1].classList.add("disabled");
      item.classList.add("cards__item_game");
    }
    item.classList.add("cards__item_main-game");
  });
  document.querySelector(".header").classList.add("cards__item_game");
}

function removeClass(className) {
  document.querySelectorAll(`.${className}`).forEach((item) => {
    item.classList.remove(className);
  });
}

function gameModeCardsRemove() {
  removeClass("disabled");
  removeClass("cards__item_game");
  removeClass("cards__item_main-game");
  divStar.innerHTML = "";
}

function switchCheckbox() {
  gameModeFlag = this.checked;
  if (gameModeFlag) {
    gameModeCards();
  } else {
    gameModeCardsRemove();
  }
  startButtonDisplay();
}

function pressStartBtn() {
  if (numberCategory !== -1) {
    if (newGame) {
      //новая игра
      newGame = false;
      //создаем новый массив
      randomGameArray = Array.from(cards[numberCategory]);
      createRandomArray(randomGameArray);
      document.getElementById(
        "game__start-btn"
      ).innerHTML = `<img src="./assets/img/arrow.png" alt="" width=25px;>`;
      //проигрываем аудио
      playAudio(randomGameArray[randomGameArray.length - 1].audioSrc);
    } else {
      playAudio(randomGameArray[randomGameArray.length - 1].audioSrc);
    }
  }
}

document.querySelector(".menu__list").addEventListener("click", function (e) {
  if (e.target.classList.contains("menu__item")) {
    changeCategory(e.target.innerHTML);
  }
});

document
  .getElementById("game__checkbox")
  .addEventListener("click", switchCheckbox);

document
  .getElementById("game__start-btn")
  .addEventListener("click", pressStartBtn);

cardsEvents();
