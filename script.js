import { saveScore, getScore } from "./firbaseDb.js";
import { generateNumber } from "./utilities.js";

const nicknameScreen = document.getElementById("nicknameScreen");
const nicknameInput = document.getElementById("nicknameInput");
const saveNameBtn = document.getElementById("saveNameBtn");
const gameInitiationScreen = document.getElementById("gameInitiationScreen");
const gameStartedScreen = document.getElementById("gameStartedScreen");
const gameScreen = document.getElementById("gameScreen");
const timeFill = document.getElementById("timeFill");
const numberBox = document.getElementById("numberBox");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const levelEl = document.getElementById("level");
const message1 = document.getElementById("message1");
const message2 = document.getElementById("message2");

let playerId = localStorage.getItem("memoryPlayerId");
let playerName = localStorage.getItem("memoryPlayerNickname");
let score = 4;
let currentNumber = "";
let memorizingTime = 2000;
let gameStarted = false;
let startDate = undefined;
let startResult = undefined;
let lastDate = undefined;
let lastResult = undefined;
let bestResult = undefined;
let bestDate = undefined;

answerInput.disabled = true;


const canvas = document.getElementById("timeCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 10;
canvas.style.width = "400px";
canvas.style.height = "10px";

let animationId;

async function init() {
  let playerData = undefined;
  if (!playerId || !playerName) {
    nicknameScreen.style.display = "block";
    gameScreen.style.display = "none";
  } else {
    nicknameScreen.style.display = "none";
    gameScreen.style.display = "block";

    playerData = await getScore(playerId);
    if (playerData) {
      startDate = playerData.startDate;
      startResult = playerData.startResult;
      lastDate = playerData.lastDate;
      lastResult = playerData.lastResult;
      bestResult = playerData.bestResult;
      bestDate = playerData.bestDate;
      score = lastResult;
    }
  }
}

async function startRound() {

  numberBox.textContent = "_".repeat(score);
  answerInput.disabled = false;
  checkBtn.disabled = false;
  answerInput.focus();
}

checkBtn.addEventListener("click", () => {
  if (!gameStarted) {
    answerInput.disabled = true;
    let time = memorizingTime + (score - 4) * 500;
    startTimer(time, startRound);
    gameStarted = true;
  } else {
    const answer = answerInput.value.trim();

    if (answer === currentNumber) {
      message1.textContent = "Teisingai";
      score++;
      let time = memorizingTime + (score - 4) * 500;
      startTimer(time, startRound);
    } else {
      message1.textContent = `Teisingas atsakymas buvo: ${currentNumber}.`;
      message2.textContent = `Rezultatas: ${score - 1}`;

      let currentDate = new Date().toISOString();
      saveScore(
        startDate ? startDate : currentDate,
        startResult ? startResult : score - 1,
        currentDate,
        score - 1,
        bestResult && score <= bestResult ? bestResult : score - 1,
        bestDate && score <= bestResult ? bestDate : currentDate,
        playerId,
        playerName,
      );
      checkBtn.textContent = "PRADĖTI";
      gameStarted = false;
      score--;
    }

  }
});

saveNameBtn.addEventListener("click", async () => {
  const value = nicknameInput.value.trim();

  if (!value) return;
  playerId = crypto.randomUUID();
  playerName = value;
  localStorage.setItem("memoryPlayerId", playerId);
  localStorage.setItem("memoryPlayerNickname", playerName);

  init();
});

function startTimer(duration, onFinish) {
  const startTime = performance.now();

  checkBtn.textContent = "TIKRINTI";
  answerInput.value = "";
  answerInput.disabled = true;
  checkBtn.disabled = true;
  message1.textContent = "";
  message2.textContent = "";
  levelEl.textContent = score;
  currentNumber = generateNumber(score);
  numberBox.textContent = currentNumber;

  let red = 156;
  let green = 248;
  let blue = 159;
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(51, 51, 51, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    red += 0.8;
    green -= 0.5;
    blue -= 0.5;
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
    ctx.fillRect(0, 0, canvas.width * (1 - progress), canvas.height);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      onFinish();
    }
  }

  requestAnimationFrame(animate);
}

await init();
