const reversesEl = document.querySelector("#reversesEl");
const roundsEl = document.querySelector("#roundsEl");
const timeBetEl = document.querySelector("#timeBet");
const tim = document.querySelector("#Tim");
const mal = document.querySelector("#Mal");

class Runner {
  constructor(center, orbit, r, color, name, a, da, sense, x, y) {
    this.center = center;
    this.orbit = orbit;
    this.r = r;
    this.color = color;
    this.name = name;
    this.a = a;
    this.da = da;
    this.sense = sense; // 0 for CCW, 1 for CW
    this.x = x;
    this.y = y;
  }
  draw() {
    let circ = document.querySelector("#" + this.name);
    circ.setAttribute("r", this.r);
    circ.setAttribute("cx", this.x);
    circ.setAttribute("cy", this.y);
    circ.setAttribute("fill", this.color);
  }

  update() {
    this.draw();
    if (this.sense == -1) this.a += this.da;
    else this.a -= this.da;
    this.x = this.center.x + this.orbit * Math.cos(this.a);
    this.y = this.center.y + this.orbit * Math.sin(this.a);
  }
}

const x0 = innerWidth / 2;
const y0 = innerHeight / 2;

const teal = "#008080";
const maroon = "rgb(128,0,0)";

const multiplier = 1;
const Size = 10 * multiplier;
const orbit = (400.0 / (2.0 * Math.PI)) * multiplier;

function init() {
  timothy = new Runner(
    { x: x0, y: y0 },
    orbit,
    Size,
    teal,
    "Tim",
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
    "Mal",
    0,
    (2.0 / orbit) * multiplier,
    -1,
    x0 + orbit,
    y0
  );
}

let animationID;

const buffer = 600;

let timeWait;
let rounds;
let reverses;
let lastReverse;
let lastRound;
let d1, d2;

let track = document.getElementById("track");
track.setAttribute("cx", x0);
track.setAttribute("cy", y0);
track.setAttribute("r", orbit);
track.setAttribute("stroke", "black");
track.setAttribute("stroke-width", 2);
track.setAttribute("fill", "none");

let sLine = document.getElementById("startLine");
sLine.setAttribute("x1", x0 + orbit - 5);
sLine.setAttribute("y1", y0);
sLine.setAttribute("x2", x0 + orbit + 5);
sLine.setAttribute("y2", y0);
sLine.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:2");

let active;
function animate() {
  const dist = Math.hypot(timothy.x - malcolm.x, timothy.y - malcolm.y);
  d1 = new Date();
  if (dist <= 0.5 && d1 - lastReverse > buffer) {
    lastReverse = new Date();
    timothy.sense *= -1;
    reverses += 1;
    reversesEl.innerHTML = reverses;
  }

  d2 = new Date();
  if (Math.abs(malcolm.x - (x0 + orbit)) < 0.1 && d2 - lastRound > buffer) {
    rounds++;
    lastRound = new Date();
  }
  if (rounds >= 10) {
    clearInterval(active);
    modalEl.style.display = "flex";
    startBtn.innerHTML = "RESET";
  }
  if (timeWait >= 60) timothy.update();
  malcolm.update();
  roundsEl.innerHTML = rounds;
  timeWait++;
}

startBtn.addEventListener("click", () => {
  timeWait = 0;
  rounds = 0;
  reverses = 0;
  roundsEl.innerHTML = rounds;
  reversesEl.innerHTML = reverses;
  init();
  timothy.draw();
  lastReverse = new Date();
  lastRound = new Date();
  active = setInterval(animate, 10);
  modalEl.style.display = "none";
});
