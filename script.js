import { saveScore, getScore } from "./firbaseDb.js";
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
let currentNumber = "";
let startDate = undefined;
let startResult = undefined;
let lastDate = undefined;
let lastResult = undefined;
let bestResult = undefined;

async function init() {
  let playerData = undefined;
  if (!playerId || !playerName) {
    nicknameScreen.style.display = "block";
    gameScreen.style.display = "none";
  } else {
    nicknameScreen.style.display = "none";
    gameScreen.style.display = "block";

    playerData = await getScore(playerId);
    if(playerData){
      startDate = playerData.startDate;
      startResult = playerData.startResult;
      lastDate = playerData.lastDate;
      lastResult = playerData.lastResult;
      bestResult = playerData.bestResult;
      score = lastResult
    }
    
    await startRound();
  }
}

async function startRound() {
  answerInput.value = "";
  answerInput.disabled = true;
  checkBtn.disabled = true;
  message.textContent = "";

  levelEl.textContent = score;

  currentNumber = generateNumber(score);
  numberBox.textContent = currentNumber;

  setTimeout(() => {
    numberBox.textContent = "_".repeat(score);
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
    let currentDate = new Date().toISOString();
    saveScore(
      startDate ? startDate : currentDate, 
      startResult ? startResult : score - 1, 
      currentDate,
      score - 1,
      bestResult && score < bestResult? bestResult : score - 1,
      playerId,
      playerName
    );
    setTimeout(() => {
    }, 1000);

    setTimeout(startRound, 3000);
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

await init();
