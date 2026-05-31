import {
  getBestResults,
  getFirstResults,
  getLastResults,
} from "./firbaseDb.js";

const buttons = document.querySelectorAll(".mode-btn");

const statLabel1 = document.getElementById("stat-label-1");
const statLabel2 = document.getElementById("stat-label-2");
const statLabel3 = document.getElementById("stat-label-3");

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");
const W_width = window.innerWidth * 0.9;
const W_height = window.innerHeight * 0.3;
canvas.width = W_width;
canvas.height = W_height;
canvas.style.width = `${W_width}px`;
canvas.style.height = `${W_height}px`;

let Q1 = 0;
let Q2 = 0;
let Q3 = 0;
let data = await getBestResults();

const bestOnes = "Geriausi";
const firstOnes = "Pirmieji";
const lastOnes = "Paskutiniai";

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    buttons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");
    if (button.textContent === bestOnes) {
      data = await getBestResults();
      median(data);
      drawBoxChart(data);
      statisticsInterpretation();
    } else if (button.textContent === firstOnes) {
      data = await getFirstResults();
      median(data);
      drawBoxChart(data);
      statisticsInterpretation();
    } else if (button.textContent === lastOnes) {
      data = await getLastResults();
      median(data);
      drawBoxChart(data);
      statisticsInterpretation();
    }
  });
});


function median(values) {
  if (values.length === 0) {
    throw new Error("Input array is empty");
  }

  values = [...values].sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);

  const firstHalfValues =
    values.length % 2 ? values.slice(0, half + 1) : values.slice(0, half);
  const firstHalf = Math.floor(firstHalfValues.length / 2);

  const secondHalfValues = values.slice(half, values.length);
  const secondHalf = Math.floor(secondHalfValues.length / 2);

  Q1 =
    firstHalfValues.length % 2
      ? firstHalfValues[firstHalf]
      : (firstHalfValues[firstHalf - 1] + firstHalfValues[firstHalf]) / 2;

  Q2 = values.length % 2 ? values[half] : (values[half - 1] + values[half]) / 2;

  Q3 =
    secondHalfValues.length % 2
      ? secondHalfValues[secondHalf]
      : (secondHalfValues[secondHalf - 1] + secondHalfValues[secondHalf]) / 2;
}

function drawBoxChart(values) {

  values = [...values].sort((a, b) => a - b);

  ctx.clearRect(0, 0, W_width, W_height);
  ctx.beginPath();
  ctx.fillStyle = "#fffaddc2";
  // ctx.fillStyle = "#1630c41f";
  // ctx.strokeStyle = "#e2e2e2";
  ctx.strokeStyle = "#fffadd";
  ctx.rect(0, 0, W_width, W_height - 1);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#4e4e4e";

  ctx.beginPath();
  ctx.moveTo(40, W_height - 40);
  ctx.lineTo(W_width - 40, W_height - 40);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(45, W_height - 45);
  ctx.lineTo(45, W_height - 35);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineTo(W_width - 45, W_height - 45);
  ctx.lineTo(W_width - 45, W_height - 35);
  ctx.stroke();

  const actualWidth = W_width - 90;
  const step = actualWidth / (values[values.length - 1] - values[0]);
  let begin_x = 45 + (Q1 - values[0]) * step;
  let end_x = 45 + (Q3 - values[0]) * step;
  let median_x = 45 + (Q2 - values[0]) * step;

  ctx.beginPath();
  ctx.moveTo(45, W_height * 0.4 - 5);
  ctx.lineTo(45, W_height * 0.4 + 5);
  ctx.moveTo(45, W_height * 0.4);
  ctx.lineTo(begin_x, W_height * 0.4);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(begin_x, W_height - 45);
  ctx.lineTo(begin_x, W_height - 35);
  ctx.stroke();

  ctx.fillStyle = "blue";
  ctx.font = "14px Arial";
  ctx.fillText(values[0], 40, W_height - 20);
  ctx.fillText(Q1, begin_x - 5, W_height - 20);

  ctx.beginPath();
  ctx.moveTo(end_x, W_height * 0.4);
  ctx.lineTo(W_width - 45, W_height * 0.4);
  ctx.moveTo(W_width - 45, W_height * 0.4 - 5);
  ctx.lineTo(W_width - 45, W_height * 0.4 + 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(end_x, W_height - 45);
  ctx.lineTo(end_x, W_height - 35);
  ctx.stroke();

  ctx.fillText(Q3, end_x - 5, W_height - 20);
  ctx.fillText(values[values.length - 1], W_width - 50, W_height - 20);

  ctx.beginPath();
  ctx.moveTo(median_x, W_height - 45);
  ctx.lineTo(median_x, W_height - 35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(median_x, W_height * 0.2 - 5);
  ctx.lineTo(median_x, W_height * 0.6 + 5);
  ctx.stroke();

  ctx.fillText(Q2, median_x - 5, W_height - 20);

  ctx.fillText("Q₁", begin_x - 5, W_height * 0.2 - 5);
  ctx.fillText("Q₃", end_x - 5, W_height * 0.2 - 5);
  ctx.fillText("Q₂", median_x - 5, W_height * 0.2 - 5);

  ctx.fillStyle = "#e254be96";
  ctx.rect(begin_x, W_height * 0.2, end_x - begin_x, W_height * 0.4);
  ctx.fill();
  ctx.stroke();
}

function statisticsInterpretation() {
  const range = data[data.length - 1] - data[0];
  const iqr = Q3 - Q1;
  const lowerWhisker = Q1 - data[0];
  const upperWhisker = data[data.length - 1] - Q3;

  const boxRatio = iqr / range;

  if (boxRatio < 0.25) {
    statLabel1.innerHTML = 'Dauguma žaidėjų pasiekė panašius rezultatus.';
  } else if (boxRatio < 0.5) {
    statLabel1.innerHTML = 'Žaidėjų rezultatai pasižymi vidutine sklaida.';
  } else {
    statLabel1.innerHTML = 'Žaidėjų rezultatai labai įvairūs.';
  }

  const lowerRatio = lowerWhisker / range;
  const upperRatio = upperWhisker / range;

  if (upperRatio > lowerRatio * 1.5) {
    statLabel2.innerHTML = 'Yra daugiau itin aukštų rezultatų.';
  }
  if (lowerRatio > upperRatio * 1.5) {
    statLabel2.innerHTML = 'Yra daugiau itin žemų rezultatų.';
  }
  if (Math.abs(lowerRatio - upperRatio) < 0.1) {
    statLabel2.innerHTML = 'Rezultatų pasiskirstymas gan simetriškas.';
  }

  const medianPosition = (Q2 - Q1) / iqr;

  if (medianPosition === 0.5) {
    statLabel3.innerHTML = 'Mediana yra per vidurį.';
  } else if (medianPosition < 0.4) {
    statLabel3.innerHTML = 'Mediana yra arčiau pirmojo kvartilio - aukštesnių rezultatų sklaida didesnė.';
  } else if (medianPosition > 0.6) {
    statLabel3.innerHTML = 'Mediana yra arčiau trečiojo kvartilio - žemesnių rezultatų sklaida didesnė.';
  }

}

median(data);
drawBoxChart(data);
statisticsInterpretation();