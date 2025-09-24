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
  
  // Close mobile menu when clicking on nav links
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (navOverlay){ navOverlay.classList.remove('show'); }
    });
  });
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

// Testimonials cube slider
(function(){
  const inner = document.getElementById('t-cube-inner');
  if (!inner) return;
  const dots = Array.from(document.querySelectorAll('.t-dot'));
  let index = 0;
  const total = 3; // faces

  function applyRotation(){
    const cube = inner.parentElement;
    const styles = cube ? getComputedStyle(cube) : null;
    const radius = styles ? parseFloat(styles.getPropertyValue('--radius')) || 400 : 400;
    const angle = index * -120; // 3 faces around Y axis
    inner.style.transform = `translateZ(-${radius}px) rotateY(${angle}deg)`;
    dots.forEach((d,i)=> d.setAttribute('aria-selected', String(i===index)));
  }

  // Autoplay
  let timer = setInterval(()=>{ index = (index+1)%total; applyRotation(); }, 4000);

  // Dots click
  dots.forEach(dot => {
    dot.addEventListener('click', ()=>{
      clearInterval(timer);
      index = Number(dot.dataset.index||0);
      applyRotation();
      timer = setInterval(()=>{ index = (index+1)%total; applyRotation(); }, 4000);
    });
  });

  // Touch/swipe
  let startX = 0;
  inner.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; clearInterval(timer); }, {passive:true});
  inner.addEventListener('touchend', (e)=>{
    const dx = (e.changedTouches[0]?.clientX||0) - startX;
    if (Math.abs(dx) > 30){
      index = (index + (dx<0?1:total-1))%total;
      applyRotation();
    }
    timer = setInterval(()=>{ index = (index+1)%total; applyRotation(); }, 4000);
  });

  // Initial
  applyRotation();
})();

// Contact form removed; direct WhatsApp/Instagram links are used in markup.

// Floating background generation (cones, scissors, needle, thread spool)
const bgCanvas = document.querySelector('.bg-canvas');
if (bgCanvas){
  const COUNT = window.innerWidth < 640 ? 26 : 42;
  const hues = [12, 340, 184, 45]; // coral, rose, teal, zari-like gold

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
      </svg>`;},
    hoop: (size, hue)=>{
      const ring = `hsl(${hue}, 45%, 55%)`;
      const clasp = `hsl(${hue}, 35%, 35%)`;
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="20" fill="none" stroke="${ring}" stroke-width="4"/>
        <rect x="28" y="8" width="8" height="6" rx="2" fill="${clasp}"/>
        <path d="M22 30 C28 24, 36 24, 42 30" stroke="${clasp}" stroke-width="2" fill="none"/>
      </svg>`;},
    paisley: (size, hue)=>{
      const base = `hsl(${hue}, 60%, 60%)`;
      const stroke = `hsl(${hue}, 45%, 35%)`;
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M36 12c-10 0-18 8-18 18s8 18 18 18c8 0 14-6 14-14 0-12-10-22-22-22z" fill="${base}" stroke="${stroke}" stroke-width="2"/>
        <circle cx="34" cy="30" r="4" fill="white" stroke="${stroke}" stroke-width="2"/>
      </svg>`;},
    flower: (size, hue)=>{
      const petal = `hsl(${hue}, 65%, 65%)`;
      const center = `hsl(${hue}, 55%, 40%)`;
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <g fill="${petal}">
          <circle cx="32" cy="16" r="8"/>
          <circle cx="16" cy="32" r="8"/>
          <circle cx="48" cy="32" r="8"/>
          <circle cx="32" cy="48" r="8"/>
        </g>
        <circle cx="32" cy="32" r="7" fill="${center}"/>
      </svg>`;},
    thimble: (size, hue)=>{
      const body = `hsl(${hue}, 45%, 55%)`;
      const dot = `hsl(${hue}, 35%, 35%)`;
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 44h24l-4-22c-1-6-15-6-16 0l-4 22z" fill="${body}" stroke="${dot}" stroke-width="2"/>
        <g fill="${dot}">
          <circle cx="28" cy="28" r="1.5"/>
          <circle cx="36" cy="28" r="1.5"/>
          <circle cx="24" cy="32" r="1.5"/>
          <circle cx="32" cy="32" r="1.5"/>
          <circle cx="40" cy="32" r="1.5"/>
        </g>
      </svg>`;},
    leaf: (size, hue)=>{
      const fill = `hsl(${hue}, 50%, 60%)`;
      const vein = `hsl(${hue}, 45%, 35%)`;
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 40 C24 10, 54 10, 52 40 C50 54, 24 54, 12 40 Z" fill="${fill}" stroke="${vein}" stroke-width="2"/>
        <path d="M20 36 C30 30, 40 28, 48 34" stroke="${vein}" stroke-width="2" fill="none"/>
      </svg>`;}
  };

  const types = Object.keys(svgs);
  for (let i=0;i<COUNT;i++){
    const el = document.createElement('div');
    el.className = 'float-item';
    const size = Math.round(20 + Math.random()*36);
    const left = Math.round(Math.random()*100);
    const delay = Math.random()*-20;
    const duration = 10 + Math.random()*18;
    const type = types[Math.floor(Math.random()*types.length)];
    const hue = hues[Math.floor(Math.random()*hues.length)];
    el.style.left = left + 'vw';
    el.style.bottom = Math.round(Math.random()*80) + 'vh';
    el.style.setProperty('--dur', duration + 's');
    el.style.animationDelay = delay + 's';
    el.style.opacity = (0.08 + Math.random()*0.1).toFixed(2);
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

// Mobile-only auto slider for gallery
(function(){
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;
  const dotsWrap = document.getElementById('gallery-dots');

  function enableSlider(){
    grid.classList.add('gallery-slider');
    const images = Array.from(grid.querySelectorAll('img'));
    let i = 0;
    images.forEach((img, idx) => img.classList.toggle('active', idx===0));

    // Build dots
    if (dotsWrap){
      dotsWrap.innerHTML = '';
      images.forEach((_, idx)=>{
        const b = document.createElement('button');
        b.className = 'gallery-dot';
        b.setAttribute('aria-label', `Slide ${idx+1}`);
        b.setAttribute('role', 'tab');
        b.dataset.index = String(idx);
        if (idx===0) b.setAttribute('aria-selected','true');
        dotsWrap.appendChild(b);
      });
    }
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.gallery-dot')) : [];
    let timer = setInterval(()=>{
      images[i].classList.remove('active');
      i = (i+1)%images.length;
      images[i].classList.add('active');
      if (dots[i-1]) dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===i)));
    }, 2800);

    // Touch to advance
    let startX = 0;
    grid.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; clearInterval(timer); }, {passive:true});
    grid.addEventListener('touchend', (e)=>{
      const dx = (e.changedTouches[0]?.clientX||0) - startX;
      images[i].classList.remove('active');
      if (Math.abs(dx) > 24){
        i = (i + (dx<0?1:images.length-1)) % images.length;
      } else {
        i = (i+1)%images.length;
      }
      images[i].classList.add('active');
      if (dots.length){ dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===i))); }
      timer = setInterval(()=>{
        images[i].classList.remove('active');
        i = (i+1)%images.length;
        images[i].classList.add('active');
        if (dots.length){ dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===i))); }
      }, 2800);
    });

    // Dots click
    if (dots.length){
      dots.forEach(dot => {
        dot.addEventListener('click', ()=>{
          clearInterval(timer);
          const idx = Number(dot.dataset.index||0);
          images[i].classList.remove('active');
          i = idx % images.length;
          images[i].classList.add('active');
          dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===i)));
          timer = setInterval(()=>{
            images[i].classList.remove('active');
            i = (i+1)%images.length;
            images[i].classList.add('active');
            dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===i)));
          }, 2800);
        });
      });
    }
  }

  function disableSlider(){
    grid.classList.remove('gallery-slider');
    const images = Array.from(grid.querySelectorAll('img'));
    images.forEach(img => img.classList.remove('active'));
    if (dotsWrap){ dotsWrap.innerHTML = ''; }
  }

  function update(){
    if (window.innerWidth <= 680){ enableSlider(); }
    else{ disableSlider(); }
  }

  update();
  window.addEventListener('resize', update);
})();



