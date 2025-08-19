let contenedor = document.getElementById("leche");
let handle = contenedor.querySelector(".handle");
const taza = document.getElementById("taza");
const tazaImg = document.getElementById("taza-img");
const rainbowRise = document.getElementById("rainbow-rise");
const btnReiniciar = document.getElementById("btn-reiniciar");

let offsetX = 0, offsetY = 0;
let isDragging = false;
let consumado = false;

// estado inicial
const estadoInicial = {
  left: contenedor.style.left || "50px",
  top: contenedor.style.top || "50px",
  tazaSrc: "img/VACIO SIN LECHITA.png"
};

document.addEventListener("dragstart", (e) => e.preventDefault());

// handlers de drag 
function startDrag(e) {
  if (consumado) return;
  isDragging = true;
  handle.style.cursor = "grabbing";

  const rect = contenedor.getBoundingClientRect();
  const p = getPoint(e);
  offsetX = p.x - rect.left;
  offsetY = p.y - rect.top;

  e.preventDefault();
}

function duringDrag(e) {
  if (!isDragging || consumado) return;

  const p = getPoint(e);
  const newLeft = p.x - offsetX;
  const newTop = p.y - offsetY;

  contenedor.style.left = newLeft + "px";
  contenedor.style.top = newTop + "px";

  if (colisiona(contenedor, taza)) {
    consumado = true;

    // taza llena
    if (tazaImg) {
      tazaImg.src = "img/mmmmmm.png";
      tazaImg.alt = "Taza llena";
    }

    // arcoíris
    lanzarArcoirisRise();

    // quitar leche actual
    if (contenedor.parentNode) contenedor.parentNode.removeChild(contenedor);
    isDragging = false;
    handle.style.cursor = "grab";

    // mostrar botón Reiniciar
    if (btnReiniciar) {
      btnReiniciar.hidden = false;
      void btnReiniciar.offsetWidth;
      btnReiniciar.classList.add("visible");
    }
  }

  e.preventDefault();
}

function stopDrag(e) {
  isDragging = false;
  if (handle) handle.style.cursor = "grab";
  e && e.preventDefault();
}

// funciones
function getPoint(e) {
  if (e.touches && e.touches.length) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}
function colisiona(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

function lanzarArcoirisRise() {
  if (!rainbowRise) return;
  const tazaRect = taza.getBoundingClientRect();

  const x = tazaRect.left + tazaRect.width * 0.50;
  const y = tazaRect.top + tazaRect.height * -0.60;

  rainbowRise.style.left = `${x}px`;
  rainbowRise.style.top  = `${y}px`;

  rainbowRise.classList.remove("active");
  void rainbowRise.offsetWidth;
  rainbowRise.classList.add("active");

  setTimeout(() => {
    rainbowRise.classList.remove("active");
    rainbowRise.style.opacity = "0";
    rainbowRise.style.clipPath = "inset(100% 0 0 0)";
  }, 1100);
}

/* reset */
function resetJuego() {
  // Ocultar botón
  if (btnReiniciar) {
    btnReiniciar.classList.remove("visible");
    setTimeout(() => { btnReiniciar.hidden = true; }, 200);
  }

  // taza vacía
  if (tazaImg) {
    tazaImg.src = estadoInicial.tazaSrc;
    tazaImg.alt = "Taza";
  }

  // ocultar arcoíris
  if (rainbowRise) {
    rainbowRise.classList.remove("active");
    rainbowRise.style.opacity = "0";
    rainbowRise.style.clipPath = "inset(100% 0 0 0)";
  }

  const viejo = document.getElementById("leche");
  if (viejo && viejo.parentNode) viejo.parentNode.removeChild(viejo);

  // crear nueva leche
  const nuevaLeche = document.createElement("div");
  nuevaLeche.className = "contenedor";
  nuevaLeche.id = "leche";
  nuevaLeche.style.left = estadoInicial.left;
  nuevaLeche.style.top = estadoInicial.top;

  nuevaLeche.innerHTML = `
    <img src="img/Leche-Larga-Vida-Entera-Calcar-Caja-1L-1-48348-removebg-preview.png"
         alt="Leche" class="objeto" draggable="false">
    <div class="handle"></div>
  `;

  document.body.appendChild(nuevaLeche);

  // nueva leche
  contenedor = nuevaLeche;
  handle = nuevaLeche.querySelector(".handle");

  // reset
  consumado = false;
  isDragging = false;
  handle.addEventListener("mousedown", startDrag);
  handle.addEventListener("touchstart", startDrag, { passive: false });
}

window.addEventListener("mousemove", duringDrag);
window.addEventListener("mouseup", stopDrag);
window.addEventListener("touchmove", duringDrag, { passive: false });
window.addEventListener("touchend", stopDrag, { passive: false });

window.addEventListener("touchmove", (e) => {
  if (isDragging) e.preventDefault();
}, { passive: false });

if (btnReiniciar) btnReiniciar.addEventListener("click", resetJuego);

handle.addEventListener("mousedown", startDrag);
handle.addEventListener("touchstart", startDrag, { passive: false });