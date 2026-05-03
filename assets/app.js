const symbols = [
  { char: "diamond", display: "◆", color: "#8b5cf6", sound: 261.63 },
  { char: "spiral", display: "◎", color: "#3b82f6", sound: 293.66 },
  { char: "spark", display: "✦", color: "#f59e0b", sound: 329.63 },
  { char: "prism", display: "△", color: "#ec4899", sound: 349.23 },
  { char: "orbit", display: "◇", color: "#10b981", sound: 392 },
  { char: "planet", display: "●", color: "#6366f1", sound: 440 },
];

let score = 0;
let sensoryLevel = 0;
let isSpinning = false;
let autoStim = false;
let autoInterval = null;
let audioCtx = null;
let particles = [];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reels = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3"),
];
const spinBtn = document.getElementById("spinBtn");
const modeBtn = document.getElementById("modeBtn");
const autoBtn = document.getElementById("autoBtn");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("levelDisplay");
const statusLog = document.getElementById("statusLog");
const progress = document.getElementById("progress");
const progressTrack = document.querySelector(".progress-track");
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function setText(element, value) {
  element.textContent = value;
}

function ensureAudioContext() {
  if (audioCtx) {
    return audioCtx;
  }

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return null;
  }

  audioCtx = new AudioContextCtor();
  return audioCtx;
}

function playTone(freq, type = "sine", duration = 0.1) {
  if (prefersReducedMotion) {
    return;
  }

  const context = ensureAudioContext();
  if (!context) {
    return;
  }

  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, context.currentTime);
  gain.gain.setValueAtTime(0.1, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + duration);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 5 + 2;
    this.speedX = (Math.random() - 0.5) * 10;
    this.speedY = (Math.random() - 0.5) * 10;
    this.life = 1.0;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.02;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function burst(x, y, color) {
  if (prefersReducedMotion) {
    return;
  }

  const count = sensoryLevel === 2 ? 46 : 18;
  for (let i = 0; i < count; i += 1) {
    particles.push(new Particle(x, y, color));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((particle) => particle.life > 0);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animate);
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, prefersReducedMotion ? Math.min(ms, 10) : ms);
  });
}

function setReelSymbol(reel, symbol) {
  setText(reel, symbol.display);
  reel.style.setProperty("--node-color", symbol.color);
}

function highlightReel(reel, isHighlighted) {
  reel.classList.toggle("is-highlighted", isHighlighted);
}

function updateProgress(value) {
  progress.style.setProperty("--progress-width", `${value}%`);
  progressTrack.setAttribute("aria-valuenow", String(Math.round(value)));
}

function setStatus(message, isHarmony = false) {
  setText(statusLog, message);
  statusLog.classList.toggle("is-harmony", isHarmony);
}

function checkResults(results) {
  const matchCount = new Set(results.map((result) => result.char)).size;
  let gain = 0;

  if (matchCount === 1) {
    setStatus("Perfect harmony detected.", true);
    gain = 500;

    for (let i = 0; i < 5; i += 1) {
      window.setTimeout(() => {
        burst(window.innerWidth / 2, window.innerHeight / 2, "#a78bfa");
      }, i * 100);
    }
  } else if (matchCount === 2) {
    setStatus("Partial alignment achieved.");
    gain = 100;
  } else {
    setStatus("Searching for resonance...");
    gain = 10;
  }

  score += gain;
  setText(scoreDisplay, String(score));
  updateProgress((score % 1000) / 10);
}

async function spin() {
  if (isSpinning) {
    return;
  }

  isSpinning = true;
  spinBtn.disabled = true;
  setStatus("Synchronizing frequencies...");

  const results = [];

  for (let i = 0; i < reels.length; i += 1) {
    const reel = reels[i];
    const spinCount = 10 + i * 5;

    for (let j = 0; j < spinCount; j += 1) {
      const tempSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      setReelSymbol(reel, tempSymbol);

      if (sensoryLevel > 0) {
        playTone(tempSymbol.sound, "triangle", 0.05);
      }

      await wait(50 + j * 5);
    }

    const final = symbols[Math.floor(Math.random() * symbols.length)];
    results.push(final);
    setReelSymbol(reel, final);
    highlightReel(reel, true);
    playTone(final.sound, "sine", 0.5);

    const rect = reel.getBoundingClientRect();
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2, final.color);

    window.setTimeout(() => {
      highlightReel(reel, false);
    }, 220);
  }

  checkResults(results);
  isSpinning = false;
  spinBtn.disabled = false;
}

function handleSpinClick() {
  const context = ensureAudioContext();
  if (context && context.state === "suspended") {
    context.resume();
  }

  spin();
}

function handleModeClick() {
  sensoryLevel = (sensoryLevel + 1) % 3;
  const levels = ["CALM", "VIBRANT", "CHAOS"];
  setText(levelDisplay, levels[sensoryLevel]);

  const chaosMode = sensoryLevel === 2;
  document.body.classList.toggle("sensory-chaos", chaosMode);
  levelDisplay.classList.toggle("stat-value-red", chaosMode);
}

function handleAutoClick() {
  autoStim = !autoStim;
  setText(autoBtn, autoStim ? "Auto-Stim On" : "Auto-Stim Off");
  autoBtn.classList.toggle("is-active", autoStim);
  autoBtn.setAttribute("aria-pressed", String(autoStim));

  if (autoStim) {
    autoInterval = window.setInterval(() => {
      if (!isSpinning) {
        spin();
      }
    }, 2000);
  } else {
    window.clearInterval(autoInterval);
  }
}

function initialize() {
  resize();
  window.addEventListener("resize", resize);
  spinBtn.addEventListener("click", handleSpinClick);
  modeBtn.addEventListener("click", handleModeClick);
  autoBtn.addEventListener("click", handleAutoClick);
  reels.forEach((reel) => setReelSymbol(reel, symbols[2]));
  animate();
}

initialize();
