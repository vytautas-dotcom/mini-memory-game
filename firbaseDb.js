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

export async function loadTop10(playerId) {
  const topContainer = document.getElementById("top10");
  topContainer.innerHTML = "";
  let myPosition = undefined;

  const q = query(
    collection(db, "players"),
    orderBy("score", "desc"),
    limit(10),
  );

  const querySnapshot = await getDocs(q);
  myPosition = loadMyRank(querySnapshot, playerId);

  let position = 1;

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const row = document.createElement("div");
    row.classList.add("top-row");

    if (position === 1) row.classList.add("gold");
    if (position === 2) row.classList.add("silver");
    if (position === 3) row.classList.add("bronze");

    if (docSnap.id === playerId) {
      row.classList.add("my-row");
    }

    let medal = position;

    if (position === 1) medal = "🥇";
    if (position === 2) medal = "🥈";
    if (position === 3) medal = "🥉";

    row.innerHTML = `
      <p class="top-place">${medal}</p>
      <p class="top-place">${data.nickname}</p>
      <p class="top-score">${data.score}</p>
      <p class="top-date">${new Intl.DateTimeFormat("lt-LT", {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(data.updatedAt))}</p>
    `;

    topContainer.appendChild(row);

    if (docSnap.id === playerId) {
      setTimeout(() => {
        row.classList.add("flash-row");

        if (position > 3) {
          row.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }

    position++;
  });
  return myPosition;
}

export async function loadMyRank(querySnapshot, playerId) {
  const rankEl = document.getElementById("myRank");

  let position = 1;
  let myPosition = null;
  let myScore = null;

  querySnapshot.forEach((docSnap) => {
    if (docSnap.id === playerId) {
      myPosition = position;
      myScore = docSnap.data().score;
    }
    position++;
  });

  if (!myPosition) {
    rankEl.textContent = "";
    return await getScore(playerId);
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
  return myScore;
}

async function getScore(playerId) {
  const docRef = doc(db, "players", playerId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().score;
  }
  return undefined;
}

export async function saveScore(score, playerId, nickname) {
  await setDoc(doc(db, "players", playerId), {
    score: score,
    nickname: nickname,
    updatedAt: new Date().toISOString(),
  });
}
