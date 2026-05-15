import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOKsBulhwPJWTmg5OKgYuITCTTjrp7k40",
  authDomain: "minimemorygame-e244f.firebaseapp.com",
  projectId: "minimemorygame-e244f",
  storageBucket: "minimemorygame-e244f.firebasestorage.app",
  messagingSenderId: "981391228420",
  appId: "1:981391228420:web:93020dc0d18502e6deff51",
  measurementId: "G-GQH6T1RSPR",
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
    numberBox.textContent = "*".repeat(score);
    answerInput.disabled = false;
    checkBtn.disabled = false;
    answerInput.focus();
  }, 2000);
}

// async function loadTop10() {
//   const topContainer = document.getElementById("top10");
//   topContainer.innerHTML = "";

//   const q = query(
//     collection(db, "players"),
//     orderBy("score", "desc"),
//     limit(10)
//   );

//   const querySnapshot = await getDocs(q);

//   let position = 1;

//   querySnapshot.forEach((docSnap) => {
//     const data = docSnap.data();

//     const row = document.createElement("p");
//     row.textContent = `${position}. ${data.score} - ${new Date(data.updatedAt).toLocaleString()}`;

//     topContainer.appendChild(row);

//     position++;
//   });
// }

async function loadTop10() {
  const topContainer = document.getElementById("top10");
  topContainer.innerHTML = "";

  const q = query(
    collection(db, "players"),
    orderBy("score", "desc"),
    limit(10),
  );

  const querySnapshot = await getDocs(q);

  let position = 1;

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const row = document.createElement("div");
    row.classList.add("top-row");

    if (position === 1) row.classList.add("gold");
    if (position === 2) row.classList.add("silver");
    if (position === 3) row.classList.add("bronze");

    let medal = position;

    if (position === 1) medal = "🥇";
    if (position === 2) medal = "🥈";
    if (position === 3) medal = "🥉";

    row.innerHTML = `
      <p class="top-place">${medal}</p>
      <p class="top-score">${data.score}</p>
      <p class="top-date">${new Intl.DateTimeFormat("lt-LT", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(data.updatedAt))}</p>
    `;

    topContainer.appendChild(row);

    position++;
  });
}

async function loadMyRank() {
  const rankEl = document.getElementById("myRank");

  const q = query(
    collection(db, "players"),
    orderBy("score", "desc")
  );

  const querySnapshot = await getDocs(q);

  let position = 1;
  let myPosition = null;

  querySnapshot.forEach((docSnap) => {
    if (docSnap.id === playerId) {
      myPosition = position;
    }
    position++;
  });

  if (!myPosition) {
    rankEl.textContent = "";
    return;
  }

  if (myPosition === 1) {
    rankEl.textContent = "🥇";
  } else if (myPosition === 2) {
    rankEl.textContent = "🥈";
  } else if (myPosition === 3) {
    rankEl.textContent = "🥉";
  } else {
    rankEl.textContent = `#${myPosition}`;
  }
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
    updatedAt: new Date().toISOString(),
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
    setTimeout(() => {
  loadTop10();
  loadMyRank();
}, 1000);

    score = 4;
    started = false;

    setTimeout(startRound, 3000);
  }
});

loadMyRank();
loadTop10();
startRound();
