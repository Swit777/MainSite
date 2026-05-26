const canvas = document.querySelector(".noise-field");
const ctx = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;
let particles = [];

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(36, Math.min(92, Math.floor(width / 18)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.9 + .45,
    a: Math.random() * .55 + .2,
    speed: Math.random() * .25 + .08 
  }));
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (const particle of particles) {
    particle.y -= particle.speed;
    particle.x += Math.sin((particle.y + particle.r) * .012) * .12;

    if (particle.y < -8) {
      particle.y = height + 8;
      particle.x = Math.random() * width;
    }

    const glow = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.r * 6
    );
    glow.addColorStop(0, `rgba(255, 32, 41, ${particle.a})`);
    glow.addColorStop(1, "rgba(255, 32, 41, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

resizeCanvas();

if (!prefersReducedMotion) {
  draw();
}

window.addEventListener("resize", resizeCanvas);

const heroCards = Array.from(document.querySelectorAll(".hero-game"));
const heroStates = ["is-front", "is-back-left", "is-back-right"];
let activeHeroCard = 0;

function updateHeroCards() {
  heroCards.forEach((card, index) => {
    card.classList.remove(...heroStates);
    const stateIndex = (index - activeHeroCard + heroCards.length) % heroCards.length;
    card.classList.add(heroStates[stateIndex]);
  });
}

if (heroCards.length === heroStates.length) {
  updateHeroCards();

  if (!prefersReducedMotion) {
    window.setInterval(() => {
      activeHeroCard = (activeHeroCard + 1) % heroCards.length;
      updateHeroCards();
    }, 10000);
  }
}
