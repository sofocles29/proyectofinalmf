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
    const folderName = folder.split('/').pop() || folder.split('\\').pop();
    document.getElementById('modal-title').innerText = folderName;

    slides.innerHTML = '';
    
    // Cargar portada según la carpeta
    const portadas = {
      '1Albumesvendidos': 'portadamasvendidos.png',
      '3SuperBowls': 'portadabowl.png',
      '4Solosguitarra': 'portadaguitar.png',
      '8Peliculasmusicales': 'portadapelis.png',
      '9Subastas': 'portadasubasta.png'
    };
    
    const portadaName = portadas[folderName] || 'portada.png';
    let portada = new Image();
    portada.src = `${folder}/${portadaName}`;
    portada.onerror = () => {
      // Si no hay portada, intentar cargar directamente
      portada.style.display = 'none';
    };
    slides.appendChild(portada);

    // Cargar todos los archivos multimedia de la carpeta
    // Para cada carpeta, intentar cargar los archivos conocidos
    const archivos = {
      '1Albumesvendidos': ['1michaelv.mp4', '2acdcv.mp4', '3whitneyv.mp4', '4shaniav.mp4', '5beegeesv.mp4', '6michaeljv.mp4'],
      '3SuperBowls': ['2michaelbowl.png', '3princebowl.png', '4aerosmithbowl.png', '5gagabowl.png', '6beyoncebowl.png', '7dianabowl.png', '8madonnabowl.png', '9rollingbowl.png', '10katybowl.png'],
      '4Solosguitarra': ['1slashg.mp4', '2briang.mp4', '3davidg.mp4', '4ritchieg.mp4', '5jimmyg.mp4', '6ledzeppeling.mp4', '7randyg.mp4', '8markg.mp4', '9donfelder.mp4', '10eddieg.mp4'],
      '8Peliculasmusicales': ['1rocketmanp.png', '2borhapp.png', '3beatlesp.png', '4elvisp.png', '5selenap.png', '6thisisitp.png', '7lastsdaysp.png', '8marleyp.png', '9missp.png', '10amyp.png'],
      '9Subastas': ['1britneys.png', '2madonnas.png', '3johns.png', '4justins.png', '5freddies.png', '6elviss.png', '7gagas.png', '8kurts.png', '9amys.png', '10michaeljs.png']
    };
    
    const listaArchivos = archivos[folderName] || [];
    
    listaArchivos.forEach(archivo => {
      const ext = archivo.split('.').pop().toLowerCase();
      if (ext === 'mp4') {
        // Crear elemento de video
        const video = document.createElement('video');
        video.src = `${folder}/${archivo}`;
        video.controls = true;
        video.style.width = '100%';
        video.style.borderRadius = '10px';
        video.style.border = '4px solid var(--red)';
        slides.appendChild(video);
      } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
        // Crear elemento de imagen
        const img = new Image();
        img.src = `${folder}/${archivo}`;
        img.onerror = () => {};
        img.onload = () => slides.appendChild(img);
      }
    });

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
