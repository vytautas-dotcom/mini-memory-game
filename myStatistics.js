import { getScore } from "./firbaseDb.js"

let playerId = localStorage.getItem("memoryPlayerId");
let playerName = localStorage.getItem("memoryPlayerNickname");

let data = await getScore(playerId);

// FIREBASE DUOMENYS
const playerData = {
  nickname: playerName,
  startResult: data.startResult,
  bestResult: data.bestResult,
  lastResult: data.lastResult,
  startDate: data.startDate,
  lastDate: data.lastDate
};

// UI
document.getElementById("nickname").textContent =
  playerData.nickname;

document.getElementById("startResult").textContent =
  playerData.startResult;

document.getElementById("bestResult").textContent =
  playerData.bestResult;

document.getElementById("lastResult").textContent =
  playerData.lastResult;

document.getElementById("startDate").textContent =
  playerData.startDate.slice(0, 10);

document.getElementById("startHour").textContent =
  playerData.startDate.slice(11, 16);

document.getElementById("lastDate").textContent =
  playerData.lastDate.slice(0, 10);

document.getElementById("lastHour").textContent =
  playerData.lastDate.slice(11, 16);