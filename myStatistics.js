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
  lastDate: data.lastDate,
  bestDate: data.bestDate
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
  `${new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(playerData.startDate))
  }`;

document.getElementById("startHour").textContent =
  `${new Intl.DateTimeFormat("lt-LT", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(playerData.startDate))
  }`;

document.getElementById("lastDate").textContent =
  `${new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(playerData.lastDate))
  }`;

document.getElementById("lastHour").textContent =
  `${new Intl.DateTimeFormat("lt-LT", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(playerData.lastDate))
  }`;

document.getElementById("bestDate").textContent =
  `${new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(playerData.bestDate))
  }`;

document.getElementById("bestHour").textContent =
  `${new Intl.DateTimeFormat("lt-LT", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(playerData.bestDate))
  }`;