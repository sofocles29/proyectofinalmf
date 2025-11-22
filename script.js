const notesContainer = document.getElementById("notes");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startGame");

let score = 0;
let playing = false;
let waiting = false;

const COLORS = {
  A: "#ff595e",
  S: "#8ac926",
  D: "#1982c4",
  F: "#ffca3a"
};

document.querySelectorAll(".key").forEach(key => {
  key.style.background = COLORS[key.dataset.key];
});

startBtn.onclick = () => {
  score = 0;
  scoreEl.textContent = 0;
  playing = true;
  spawnNote();
};

function spawnNote() {
  if (!playing || waiting) return;

  waiting = true;

  const keys = ["A", "S", "D", "F"];
  const chosen = keys[Math.floor(Math.random() * 4)];

  const note = document.createElement("div");
  note.className = "note";
  note.style.background = COLORS[chosen];
  note.dataset.key = chosen;

  note.style.left = {
    A: "25%",
    S: "40%",
    D: "60%",
    F: "75%"
  }[chosen];

  notesContainer.appendChild(note);

  setTimeout(() => {
    if (note.parentNode) note.remove();
    waiting = false;
    if (playing) spawnNote();
  }, 2300);
}

document.addEventListener("keydown", e => {
  if (!playing) return;

  const key = e.key.toUpperCase();
  const pressed = document.querySelector(`.key[data-key="${key}"]`);
  if (!pressed) return;

  pressed.classList.add("active");

  const note = document.querySelector(".note");
  if (!note) return;

  if (note.dataset.key === key) {
    score += 10;
    scoreEl.textContent = score;
    note.remove();
  }

  if (score >= 300) {
    showConfetti();
    playing = false;
  }
});

document.addEventListener("keyup", e => {
  const key = e.key.toUpperCase();
  const pressed = document.querySelector(`.key[data-key="${key}"]`);
  if (pressed) pressed.classList.remove("active");
});

function showConfetti() {
  for (let i = 0; i < 150; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    c.style.animationDelay = Math.random() + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3000);
  }
}

// MODAL IMAGE / VIDEO LOADER
const modal = document.getElementById('modal');
const slides = document.getElementById('slides');
const modalTitle = document.getElementById('modal-title');

document.querySelectorAll('.logo-card').forEach(card => {
  card.onclick = () => {
    const folder = card.dataset.folder;
    modalTitle.textContent = folder;
    slides.innerHTML = "";

    // siempre carga portada primero
    const portada = document.createElement("img");
    portada.src = folder + "/portada.jpg";
    slides.appendChild(portada);

    // carga hasta 20 archivos (png / jpg / mp4)
    for (let i = 1; i <= 20; i++) {
      let img = new Image();
      img.src = `${folder}/${i}.png`;
      img.onload = () => slides.appendChild(img);

      let jpg = new Image();
      jpg.src = `${folder}/${i}.jpg`;
      jpg.onload = () => slides.appendChild(jpg);

      let video = document.createElement("video");
      video.src = `${folder}/${i}.mp4`;
      video.controls = true;
      video.onloadeddata = () => slides.appendChild(video);
    }

    modal.classList.add('open');
  };
});

function closeModal() {
  modal.classList.remove('open');
  slides.innerHTML = "";
}


