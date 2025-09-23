// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const navOverlay = document.getElementById('nav-overlay');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
    const open = navMenu.classList.contains('open');
    document.body.style.overflow = open ? 'hidden' : '';
    if (navOverlay){ navOverlay.classList.toggle('show', open); }
  });
  if (navOverlay){
    navOverlay.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navOverlay.classList.remove('show');
    });
  }
}

// Reveal on scroll
const revealables = Array.from(document.querySelectorAll('[data-reveal]'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });
document.querySelectorAll('.section .container > *').forEach(el => {
  el.setAttribute('data-reveal','');
  observer.observe(el);
});

// Testimonials simple carousel
const quotes = Array.from(document.querySelectorAll('.carousel .quote'));
let quoteIndex = 0;
function rotateQuotes(){
  if (quotes.length === 0) return;
  quotes.forEach(q => q.classList.remove('active'));
  quotes[quoteIndex % quotes.length].classList.add('active');
  quoteIndex = (quoteIndex + 1) % quotes.length;
}
rotateQuotes();
setInterval(rotateQuotes, 3600);

// Contact form removed; direct WhatsApp/Instagram links are used in markup.

// Floating background generation (cones, scissors, needle, thread spool)
const bgCanvas = document.querySelector('.bg-canvas');
if (bgCanvas){
  const COUNT = window.innerWidth < 640 ? 19 : 31;
  const hues = [12, 340, 184]; // coral, rose, teal

  const svgs = {
    cone: (size, hue)=>{
      const color = `hsl(${hue}, 60%, 45%)`;
      const accent = `hsl(${hue}, 65%, 70%)`;
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 10 L52 10 L32 54 Z" fill="${accent}"/>
        <path d="M14 10 L32 54 L50 10" stroke="${color}" stroke-width="2" fill="none"/>
        <circle cx="22" cy="10" r="4" fill="${color}"/>
      </svg>`;},
    scissors: (size, hue)=>{
      const color = `hsl(${hue}, 50%, 35%)`;
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="16" cy="20" r="6" fill="white"/>
          <circle cx="24" cy="44" r="6" fill="white"/>
          <path d="M20 24 L38 32 L20 40"/>
          <path d="M38 32 L54 14"/>
          <path d="M38 32 L54 50"/>
        </g>
      </svg>`;},
    needle: (size, hue)=>{
      const color = `hsl(${hue}, 60%, 35%)`;
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round">
          <path d="M12 52 C28 30, 36 24, 50 12"/>
          <ellipse cx="50" cy="12" rx="3.2" ry="5" fill="white"/>
        </g>
      </svg>`;},
    spool: (size, hue)=>{
      const body = `hsl(${hue}, 55%, 75%)`;
      const edge = `hsl(${hue}, 40%, 35%)`;
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="16" width="32" height="32" fill="${body}" stroke="${edge}" stroke-width="2" rx="6"/>
        <path d="M16 20 H48 M16 24 H48 M16 28 H48 M16 32 H48 M16 36 H48 M16 40 H48" stroke="${edge}" stroke-width="2"/>
      </svg>`;}
  };

  const types = Object.keys(svgs);
  for (let i=0;i<COUNT;i++){
    const el = document.createElement('div');
    el.className = 'float-item';
    const size = Math.round(22 + Math.random()*30);
    const left = Math.round(Math.random()*100);
    const delay = Math.random()*-16;
    const duration = 12 + Math.random()*16;
    const type = types[i % types.length];
    const hue = hues[i % hues.length];
    el.style.left = left + 'vw';
    el.style.bottom = Math.round(Math.random()*80) + 'vh';
    el.style.setProperty('--dur', duration + 's');
    el.style.animationDelay = delay + 's';
    el.innerHTML = svgs[type](size, hue);
    bgCanvas.appendChild(el);
  }
}

// Back to top button functionality
const toTop = document.querySelector('.to-top');
if (toTop){
  toTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}



