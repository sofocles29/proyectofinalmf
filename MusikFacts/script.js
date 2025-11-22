// NAV SCROLL
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.onclick = () =>
    document.getElementById(btn.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
});

// MODAL
const modal = document.getElementById('modal');
const slides = document.getElementById('slides');

function closeModal() {
  modal.classList.remove('open');
  slides.innerHTML = '';
}

document.querySelectorAll('.logo-card').forEach(card => {
  card.onclick = () => {
    const folder = card.dataset.folder;
    document.getElementById('modal-title').innerText = folder;

    slides.innerHTML = '';
    let portada = new Image();
    portada.src = `${folder}/portada.jpg`;
    slides.appendChild(portada);

    for (let i = 1; i < 15; i++) {
      let img = new Image();
      img.src = `${folder}/${i}.jpg`;
      img.onerror = () => {};
      img.onload = () => slides.appendChild(img);
    }

    modal.classList.add('open');
  };
});

// GAME
let score = 0;
let gameRunning = false;
const scoreEl = document.getElementById('score');
const notesContainer = document.getElementById('notes');

document.getElementById('startGame').onclick = () => {
  if (gameRunning) return;
  score = 0;
  scoreEl.innerText = 0;
  gameRunning = true;
  spawnNote();
};

function spawnNote() {
  if (!gameRunning) return;

  const keys = ['A', 'S', 'D', 'F'];
  const key = keys[Math.floor(Math.random() * 4)];
  const div = document.createElement('div');
  div.className = 'note';
  div.dataset.key = key;
  div.style.left = `${keys.indexOf(key) * 100 + 140}px`;
  notesContainer.appendChild(div);

  div.addEventListener('animationend', () => div.remove());

  setTimeout(spawnNote, 900);
}

document.addEventListener('keydown', e => {
  const key = e.key.toUpperCase();
  const keyDiv = document.querySelector(`.key[data-key="${key}"]`);
  if (!keyDiv) return;

  keyDiv.classList.add('active');
  document.querySelectorAll('.note').forEach(n => {
    if (n.dataset.key === key) {
      score += 10;
      scoreEl.innerText = score;
      n.remove();
    }
  });
});

document.addEventListener('keyup', e => {
  const key = e.key.toUpperCase();
  const keyDiv = document.querySelector(`.key[data-key="${key}"]`);
  if (keyDiv) keyDiv.classList.remove('active');
});
