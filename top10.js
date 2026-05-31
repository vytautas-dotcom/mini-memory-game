import { loadTop10 } from "./firbaseDb.js";


let playerId = localStorage.getItem("memoryPlayerId");
let playerName = localStorage.getItem("memoryPlayerNickname");
// UI
document.getElementById("nickname").textContent = playerName;

async function init() {
    await loadTop10(playerId);
}
init();