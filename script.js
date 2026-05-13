const numberBox = document.getElementById("numberBox");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const levelEl = document.getElementById("level");
const message = document.getElementById("message");

let playerId = localStorage.getItem("memoryPlayerId");

if (!playerId) {
  playerId = crypto.randomUUID();
  localStorage.setItem("memoryPlayerId", playerId);
}

let level = 4;
let currentNumber = "";

function generateNumber(length) {
  let num = "";
  for (let i = 0; i < length; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

function startRound() {
  answerInput.value = "";
  answerInput.disabled = true;
  checkBtn.disabled = true;
  message.textContent = "";

  currentNumber = generateNumber(level);
  numberBox.textContent = currentNumber;
  levelEl.textContent = level;

  setTimeout(() => {
    numberBox.textContent = "????";
    answerInput.disabled = false;
    checkBtn.disabled = false;
    answerInput.focus();
  }, 2000);
}

// function saveScore(score) {
//   fetch("https://script.google.com/macros/s/AKfycbyevsWJuFbYkFllVCVL-SVrTXKG2PPLoK2RcTHwE_KR0PB-LbywLkNbu8X-IfqoFf03/exec", {
//     method: "POST",
//     mode: "no-cors",
//     body: JSON.stringify({
//       id: playerId,
//       score: score,
//       date: new Date().toLocaleString()
//     }),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   })
//   .then(res => res.text())
//   .then(data => {
//     console.log("Išsaugota:", data);
//   })
//   .catch(err => {
//     console.error("Klaida:", err);
//   });
// }

function saveScore(score) {
  const formData = new FormData();

  formData.append("id", playerId);
  formData.append("score", score);
  formData.append("date", new Date().toLocaleString());

  fetch("https://script.google.com/macros/s/AKfycbzSio6V6dC5mfKF0v6KyI-YBFLvU09IXXrO1mSat-4GtT_8_9ScNnM4l8lCbJmXUrLf/exec", {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}

checkBtn.addEventListener("click", () => {
  const answer = answerInput.value.trim();

  if (answer === currentNumber) {
    message.textContent = "Teisingai";
    level++;
    setTimeout(startRound, 1000);
  } else {
    message.textContent = `Baigta. Rezultatas: ${level - 1}`;
    saveScore(level - 1);

    level = 4;

    setTimeout(startRound, 3000);
  }
});

startRound();