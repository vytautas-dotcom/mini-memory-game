import { loadTop10, loadMyRank, saveScore } from "./firbaseDb.js";
import { generateNumber } from "./utilities.js";

const nicknameScreen = document.getElementById("nicknameScreen");
const nicknameInput = document.getElementById("nicknameInput");
const saveNameBtn = document.getElementById("saveNameBtn");
const gameScreen = document.getElementById("gameScreen");
const numberBox = document.getElementById("numberBox");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const levelEl = document.getElementById("level");
const message = document.getElementById("message");

let playerId = localStorage.getItem("memoryPlayerId");
let playerName = localStorage.getItem("memoryPlayerNickname");
let score = 4;
let started = false;
let currentNumber = "";
let nickname = undefined;

async function init() {
  let curretScore = undefined;
  if (!playerId) {
    nicknameScreen.style.display = "block";
    gameScreen.style.display = "none";
  } else {
    nicknameScreen.style.display = "none";
    gameScreen.style.display = "block";
    curretScore = await loadTop10(playerId);
console.log("curretScore",curretScore);
    await startRound(curretScore);
  }

  if (nickname) {
    nicknameScreen.style.display = "none";
    gameScreen.style.display = "block";

    playerId = crypto.randomUUID();
    localStorage.setItem("memoryPlayerId", playerId);
    localStorage.setItem("memoryPlayerNickname", nickname);

    await startRound(curretScore);
  }
}

async function startRound(currentScore) {
  

  answerInput.value = "";
  answerInput.disabled = true;
  checkBtn.disabled = true;
  message.textContent = "";

  levelEl.textContent = currentScore !== undefined ? currentScore : score;

  currentNumber = generateNumber(currentScore !== undefined ? currentScore : score);
  numberBox.textContent = currentNumber;

  setTimeout(() => {
    numberBox.textContent = "*".repeat(currentScore !== undefined ? currentScore : score);
    answerInput.disabled = false;
    checkBtn.disabled = false;
    answerInput.focus();
  }, 2000);
}

checkBtn.addEventListener("click", () => {
  const answer = answerInput.value.trim();

  if (answer === currentNumber) {
    message.textContent = "Teisingai";
    score++;
    setTimeout(startRound, 1000);
  } else {
    message.textContent = `Baigta. Rezultatas: ${score - 1}`;
    saveScore(score - 1, playerId, nickname);
    setTimeout(() => {
      loadTop10();
    }, 1000);

    score = score - 1 >= 4 ? score - 1 : 4;
    started = false;

    setTimeout(startRound, 3000);
  }
});

saveNameBtn.addEventListener("click", async () => {
  const value = nicknameInput.value.trim();

  if (!value) return;
  nickname = value;

  init();
});

await init();

// async function getScore(playerId) {
//   try {
//     const response = await fetch(
//       `https://script.google.com/macros/s/AKfycbwBiBOEe0lf7vboFCtUj-k-lm3Kn8BBV7eocOqYy12zPuPzzqOczyiAaeGVP4gbSfXf/exec?playerId=${playerId}`
//     );

//     const data = await response.json();

//     return Number(data.score) || 4;

//   } catch (err) {
//     console.error(err);
//     return 4;
//   }
// }

// function saveScore(score) {
//   const formData = new FormData();

//   formData.append("id", playerId);
//   formData.append("score", score);
//   formData.append("date", new Date().toLocaleString());

//   fetch("https://script.google.com/macros/s/AKfycbwBiBOEe0lf7vboFCtUj-k-lm3Kn8BBV7eocOqYy12zPuPzzqOczyiAaeGVP4gbSfXf/exec", {
//     method: "POST",
//     mode: "no-cors",
//     body: formData
//   });
// }
