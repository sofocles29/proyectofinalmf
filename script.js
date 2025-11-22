// ========== GAME STATE ==========
const notesContainer = document.getElementById("notes");
const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const accuracyEl = document.getElementById("accuracy");
const startBtn = document.getElementById("startGame");
const gameStatusEl = document.getElementById("game-status");

let score = 0;
let combo = 0;
let maxCombo = 0;
let playing = false;
let gameStartTime = 0;
let notesHit = 0;
let notesTotal = 0;
let notes = []; // Array para rastrear todas las notas activas
let spawnInterval = null;
let speedMultiplier = 1;
let gameDuration = 60000; // 60 segundos

const COLORS = {
  A: "#ff595e",
  S: "#8ac926",
  D: "#1982c4",
  F: "#ffca3a"
};

const KEY_POSITIONS = {
  A: "12.5%",
  S: "37.5%",
  D: "62.5%",
  F: "87.5%"
};

// Inicializar colores de teclas
document.querySelectorAll(".key").forEach(key => {
  key.style.background = COLORS[key.dataset.key];
});

// ========== GAME FUNCTIONS ==========
function startGame() {
  // Resetear estado
  score = 0;
  combo = 0;
  maxCombo = 0;
  notesHit = 0;
  notesTotal = 0;
  speedMultiplier = 1;
  notes = [];
  playing = true;
  gameStartTime = Date.now();
  
  // Limpiar notas existentes
  notesContainer.innerHTML = "";
  
  // Actualizar UI
  updateUI();
  startBtn.textContent = "Jugando...";
  startBtn.disabled = true;
  gameStatusEl.textContent = "¡Juega!";
  gameStatusEl.className = "game-status playing";
  
  // Iniciar spawn de notas
  spawnNote();
  spawnInterval = setInterval(() => {
    if (playing) {
      spawnNote();
    }
  }, 800 - (speedMultiplier * 50)); // Spawn más rápido con el tiempo
  
  // Aumentar dificultad progresivamente
  const difficultyInterval = setInterval(() => {
    if (playing) {
      speedMultiplier = Math.min(2.5, speedMultiplier + 0.1);
      // Ajustar intervalo de spawn
      clearInterval(spawnInterval);
      spawnInterval = setInterval(() => {
        if (playing) spawnNote();
      }, Math.max(300, 800 - (speedMultiplier * 50)));
    } else {
      clearInterval(difficultyInterval);
    }
  }, 5000);
  
  // Terminar juego después del tiempo límite
  setTimeout(() => {
    if (playing) {
      endGame();
    }
  }, gameDuration);
}

function spawnNote() {
  if (!playing) return;
  
  const keys = ["A", "S", "D", "F"];
  const chosen = keys[Math.floor(Math.random() * 4)];
  
  const note = document.createElement("div");
  note.className = "note";
  note.style.background = COLORS[chosen];
  note.dataset.key = chosen;
  note.style.left = KEY_POSITIONS[chosen];
  
  // Posición inicial
  const noteObj = {
    element: note,
    key: chosen,
    top: -65,
    hit: false,
    startTime: Date.now()
  };
  
  notes.push(noteObj);
  notesContainer.appendChild(note);
  notesTotal++;
  
  // Iniciar animación
  animateNote(noteObj);
  
  // Remover nota si no fue golpeada después de un tiempo
  const fallTime = 2300 / speedMultiplier;
  setTimeout(() => {
    if (!noteObj.hit && note.parentNode) {
      missNote(noteObj);
    }
  }, fallTime + 100);
}

function animateNote(noteObj) {
  if (!playing || !noteObj.element.parentNode || noteObj.hit) return;
  
  const hitZoneTop = 240; // Posición de la línea de golpeo
  const hitZoneHeight = 40; // Altura de la zona de golpeo
  const fallSpeed = 3 * speedMultiplier;
  
  noteObj.top += fallSpeed;
  noteObj.element.style.top = noteObj.top + "px";
  
  // Verificar si está en la zona de golpeo
  if (noteObj.top >= hitZoneTop - hitZoneHeight && noteObj.top <= hitZoneTop + hitZoneHeight) {
    noteObj.element.classList.add("in-hit-zone");
  } else {
    noteObj.element.classList.remove("in-hit-zone");
  }
  
  // Continuar animación si no ha sido golpeada y está en pantalla
  if (noteObj.top < 300) {
    requestAnimationFrame(() => animateNote(noteObj));
  } else if (!noteObj.hit) {
    // Nota salió de pantalla sin ser golpeada
    missNote(noteObj);
  }
}

function hitNote(noteObj, precision) {
  if (noteObj.hit) return false;
  
  noteObj.hit = true;
  notesHit++;
  combo++;
  maxCombo = Math.max(maxCombo, combo);
  
  // Calcular puntuación basada en precisión y combo
  let points = 0;
  if (precision === "perfect") {
    points = 100 + (combo * 2);
    showFeedback("PERFECT!", "#00ff00");
  } else if (precision === "good") {
    points = 50 + combo;
    showFeedback("GOOD!", "#ffff00");
  }
  
  score += points;
  
  // Efecto visual al golpear
  noteObj.element.classList.add("hit");
  noteObj.element.style.transform = "scale(1.5)";
  noteObj.element.style.opacity = "0";
  
  setTimeout(() => {
    if (noteObj.element.parentNode) {
      noteObj.element.remove();
    }
    notes = notes.filter(n => n !== noteObj);
  }, 200);
  
  updateUI();
  return true;
}

function missNote(noteObj) {
  if (noteObj.hit) return;
  
  noteObj.hit = true;
  combo = 0;
  notesTotal++;
  
  showFeedback("MISS!", "#ff0000");
  
  noteObj.element.classList.add("miss");
  noteObj.element.style.opacity = "0.3";
  
  setTimeout(() => {
    if (noteObj.element.parentNode) {
      noteObj.element.remove();
    }
    notes = notes.filter(n => n !== noteObj);
  }, 300);
  
  updateUI();
}

function showFeedback(text, color) {
  const feedback = document.createElement("div");
  feedback.className = "feedback";
  feedback.textContent = text;
  feedback.style.color = color;
  feedback.style.left = "50%";
  feedback.style.top = "50%";
  feedback.style.transform = "translate(-50%, -50%)";
  notesContainer.appendChild(feedback);
  
  setTimeout(() => {
    feedback.remove();
  }, 500);
}

function updateUI() {
  scoreEl.textContent = score;
  comboEl.textContent = combo > 0 ? `Combo: ${combo}` : "";
  const accuracy = notesTotal > 0 ? Math.round((notesHit / notesTotal) * 100) : 100;
  accuracyEl.textContent = `Precisión: ${accuracy}%`;
}

function endGame() {
  playing = false;
  clearInterval(spawnInterval);
  
  // Remover todas las notas
  notes.forEach(note => {
    if (note.element.parentNode) {
      note.element.remove();
    }
  });
  notes = [];
  
  startBtn.textContent = "Jugar de Nuevo";
  startBtn.disabled = false;
  
  const accuracy = notesTotal > 0 ? Math.round((notesHit / notesTotal) * 100) : 0;
  const finalMessage = `¡Juego terminado! Puntaje: ${score} | Combo máximo: ${maxCombo} | Precisión: ${accuracy}%`;
  gameStatusEl.textContent = finalMessage;
  gameStatusEl.className = "game-status finished";
  
  if (score >= 5000) {
    showConfetti();
  }
}

// ========== EVENT LISTENERS ==========
startBtn.onclick = startGame;

document.addEventListener("keydown", e => {
  if (!playing) return;
  
  const key = e.key.toUpperCase();
  const pressed = document.querySelector(`.key[data-key="${key}"]`);
  if (!pressed) return;
  
  pressed.classList.add("active");
  
  // Buscar nota más cercana a la línea de golpeo
  const hitZoneTop = 240;
  const hitZoneHeight = 40;
  
  const matchingNotes = notes.filter(n => 
    !n.hit && 
    n.key === key && 
    n.top >= hitZoneTop - hitZoneHeight && 
    n.top <= hitZoneTop + hitZoneHeight
  );
  
  if (matchingNotes.length > 0) {
    // Encontrar la nota más cercana al centro de la zona de golpeo
    const closestNote = matchingNotes.reduce((closest, current) => {
      const closestDist = Math.abs(closest.top - hitZoneTop);
      const currentDist = Math.abs(current.top - hitZoneTop);
      return currentDist < closestDist ? current : closest;
    });
    
    // Determinar precisión
    const distance = Math.abs(closestNote.top - hitZoneTop);
    const precision = distance < 15 ? "perfect" : "good";
    
    hitNote(closestNote, precision);
  }
});

document.addEventListener("keyup", e => {
  const key = e.key.toUpperCase();
  const pressed = document.querySelector(`.key[data-key="${key}"]`);
  if (pressed) pressed.classList.remove("active");
});

function showConfetti() {
  for (let i = 0; i < 200; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "%";
    c.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    c.style.animationDelay = Math.random() * 2 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
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


