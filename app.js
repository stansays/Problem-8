const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const reversesEl = document.querySelector("#reversesEl");
const roundsEl = document.querySelector("#roundsEl");
const timeBetEl = document.querySelector("#timeBet");

canvas.width = innerWidth; //window.innerWidth window object is automatic
canvas.height = innerHeight;

class Runner {
  constructor(center, orbit, r, color, letter, a, da, sense, x, y) {
    this.center = center;
    this.orbit = orbit;
    this.r = r;
    this.color = color;
    this.letter = letter;
    this.a = a;
    this.da = da;
    this.sense = sense; // 0 for CCW, 1 for CW
    this.x = x;
    this.y = y;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.textAlign = "center";
    ctx.fillText(this.letter, this.x, this.y + 3);
  }

  update() {
    this.draw();
    if (this.sense == -1) this.a += this.da;
    else this.a -= this.da;
    this.x = this.center.x + this.orbit * Math.cos(this.a);
    this.y = this.center.y + this.orbit * Math.sin(this.a);
  }
}

const x0 = canvas.width / 2;
const y0 = canvas.height / 2;

const teal = "#008080";
const maroon = "rgb(128,0,0)";

const multiplier = 1;
const Size = 10;
const orbit = (400.0 / (2.0 * Math.PI)) * multiplier;

timothy = new Runner(
  { x: x0, y: y0 },
  orbit,
  Size,
  teal,
  "T",
  0,
  (3.0 / orbit) * multiplier,
  1,
  x0 + orbit,
  y0
);
malcolm = new Runner(
  { x: x0, y: y0 },
  orbit,
  Size,
  maroon,
  "M",
  0,
  (2.0 / orbit) * multiplier,
  -1,
  x0 + orbit,
  y0
);

let animationID;
let score = 0;

const buffer = 600;

let timeWait = 0;
let rounds = 0;
let reverses = 0;
let lastReverse = new Date();
let lastRound = new Date();
let d1, d2;
function animate() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(x0, y0, orbit, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x0 + orbit - 5, y0);
  ctx.lineTo(x0 + orbit + 5, y0);
  ctx.stroke();
  const dist = Math.hypot(timothy.x - malcolm.x, timothy.y - malcolm.y);
  d1 = new Date();
  if (dist <= 0.5 && d1 - lastReverse > buffer) {
    // timeBetEl.innerHTML = Math.floor((d1-lastReverse)/10)
    lastReverse = new Date();
    timothy.sense *= -1;
    reverses += 1;
    reversesEl.innerHTML = reverses;
  }

  d2 = new Date();
  if (
    Math.abs(malcolm.x - (x0 + orbit)) < 1 / 10 &&
    d2 - lastRound > buffer
  ) {
    rounds++;
    lastRound = new Date();
  }
  if (rounds >= 10) {
    clearInterval(active);
  }
  if (timeWait >= 60) timothy.update();
  malcolm.update();
  roundsEl.innerHTML = rounds;
  timeWait++;
}

let active = setInterval(animate, 10);
