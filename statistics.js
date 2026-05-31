import {
  getBestResults,
  getFirstResults,
  getLastResults,
} from "./firbaseDb.js";

const buttons = document.querySelectorAll(".mode-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const W_width = window.innerWidth * 0.5;
const W_height = window.innerHeight * 0.3;
canvas.width = W_width;
canvas.height = W_height;
canvas.style.width = `${W_width}px`;
canvas.style.height = `${W_height}px`;

let Q1 = 0;
let Q2 = 0;
let Q3 = 0;
let data = await getBestResults();

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    buttons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");
    if (button.textContent === "Geriausi") {
      data = await getBestResults();
      median(data);
      drawBoxChart(data);
    } else if (button.textContent === "Pirmieji") {
      data = await getFirstResults();
      median(data);
      drawBoxChart(data);
    } else if (button.textContent === "Paskutiniai") {
      data = await getLastResults();
      median(data);
      drawBoxChart(data);
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

  ctx.fillStyle = "#e254be96";
  ctx.rect(begin_x, W_height * 0.2, end_x - begin_x, W_height * 0.4);
  ctx.fill();
  ctx.stroke();
}

median(data);
drawBoxChart(data);
