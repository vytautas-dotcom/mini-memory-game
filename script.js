import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOKsBulhwPJWTmg5OKgYuITCTTjrp7k40",
  authDomain: "minimemorygame-e244f.firebaseapp.com",
  projectId: "minimemorygame-e244f",
  storageBucket: "minimemorygame-e244f.firebasestorage.app",
  messagingSenderId: "981391228420",
  appId: "1:981391228420:web:93020dc0d18502e6deff51",
  measurementId: "G-GQH6T1RSPR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const numberBox = document.getElementById("numberBox");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const levelEl = document.getElementById("level");
const message = document.getElementById("message");

let playerId = localStorage.getItem("memoryPlayerId");
let score = 4;
let started = false;
let currentNumber = "";

function generateNumber(length) {
  let num = "";
  for (let i = 0; i < length; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

async function startRound() {
  if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem("memoryPlayerId", playerId);
  }

  if (!started) {
    const savedScore = await getScore(playerId);

    if (savedScore && savedScore >= 4) {
      score = savedScore;
    } else {
      score = 4;
    }

    started = true;
  }

  answerInput.value = "";
  answerInput.disabled = true;
  checkBtn.disabled = true;
  message.textContent = "";

  levelEl.textContent = score;

  currentNumber = generateNumber(score);
  numberBox.textContent = currentNumber;

  setTimeout(() => {
    numberBox.textContent = "????";
    answerInput.disabled = false;
    checkBtn.disabled = false;
    answerInput.focus();
  }, 2000);
}

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

async function getScore() {
  const docRef = doc(db, "players", playerId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().score;
  }

  return 4;
}

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

async function saveScore(score) {
  await setDoc(doc(db, "players", playerId), {
    score: score,
    updatedAt: new Date().toISOString()
  });
}

checkBtn.addEventListener("click", () => {
  const answer = answerInput.value.trim();

  if (answer === currentNumber) {
    message.textContent = "Teisingai";
    score++;
    setTimeout(startRound, 1000);
  } else {
    message.textContent = `Baigta. Rezultatas: ${score - 1}`;
    saveScore(score - 1);

    score = 4;
    started = false;

    setTimeout(startRound, 3000);
  }
});

startRound();