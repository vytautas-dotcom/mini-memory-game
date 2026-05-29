import {getScore} from "./firbaseDb.js"

let playerId = localStorage.getItem("memoryPlayerId");
let playerName = localStorage.getItem("memoryPlayerNickname");

let data = await getScore(playerId);

// FIREBASE DUOMENYS
    const playerData = {
      nickname: playerName,
      startResult: data.startResult,
      bestResult: data.bestResult,
      lastResult: data.lastResult
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

   