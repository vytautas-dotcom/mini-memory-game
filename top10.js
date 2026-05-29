import { loadTop10 } from "./firbaseDb.js";


let playerId = localStorage.getItem("memoryPlayerId");
let playerName = localStorage.getItem("memoryPlayerNickname");

async function init() {
    await loadTop10(playerId);
}
init();