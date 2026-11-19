// ===== Mobilā navigācijas izvēlne =====
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

navToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ===== Attēlu karuselis =====
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const dotsBox = document.getElementById("dots");
const carouselBox = document.getElementById("carousel-box");

const INTERVAL = 4000; // ms
let current = 0;
let timer = null;
let playing = true;

// Punktu indikatoru izveide
slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.setAttribute("aria-label", "Slaids " + (i + 1));
  dot.addEventListener("click", () => {
    showSlide(i);
    restartTimer();
  });
  dotsBox.appendChild(dot);
});
const dots = dotsBox.querySelectorAll(".dot");

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === current));
  dots.forEach((d, i) => d.classList.toggle("active", i === current));
}

function nextSlide() { showSlide(current + 1); }
function prevSlide() { showSlide(current - 1); }

function startTimer() {
  stopTimer();
  timer = setInterval(nextSlide, INTERVAL);
}
function stopTimer() {
  if (timer) { clearInterval(timer); timer = null; }
}
function restartTimer() {
  if (playing) startTimer();
}

function setPlaying(value) {
  playing = value;
  playPauseBtn.textContent = playing ? "⏸ Apturēt" : "▶ Atsākt";
  playPauseBtn.setAttribute("aria-pressed", String(!playing));
  if (playing) startTimer(); else stopTimer();
}

nextBtn.addEventListener("click", () => { nextSlide(); restartTimer(); });
prevBtn.addEventListener("click", () => { prevSlide(); restartTimer(); });
playPauseBtn.addEventListener("click", () => setPlaying(!playing));

// Tastatūras vadība
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { nextSlide(); restartTimer(); }
  if (e.key === "ArrowLeft") { prevSlide(); restartTimer(); }
});

// Pauze, kamēr peles kursors virs karuseļa (tikai ja netika apturēts manuāli)
carouselBox.addEventListener("mouseenter", stopTimer);
carouselBox.addEventListener("mouseleave", restartTimer);

// Skārienu pavilkšana (mobilajām ierīcēm)
let touchStartX = 0;
carouselBox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
carouselBox.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) nextSlide(); else prevSlide();
    restartTimer();
  }
}, { passive: true });

showSlide(0);
startTimer();
