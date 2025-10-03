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

// Responsive gallery slider (mobile fade, desktop carousel)
(function(){
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;
  const dotsWrap = document.getElementById('gallery-dots');

  let desktopTimer = null;
  let mobileTimer = null;
  let desktopIndex = 0;
  let desktopPages = 1;
  let itemsPerPage = 3;
  let track = null;

  function clearTimers(){
    if (desktopTimer) { clearInterval(desktopTimer); desktopTimer = null; }
    if (mobileTimer) { clearInterval(mobileTimer); mobileTimer = null; }
  }

  // Mobile: fade one image at a time
  function enableMobile(){
    clearTimers();
    // Ensure images are direct children of grid
    if (track){
      const imgs = Array.from(track.querySelectorAll('img'));
      imgs.forEach(img => grid.appendChild(img));
      track.remove();
      track = null;
    }
    grid.classList.add('gallery-slider');
    const images = Array.from(grid.querySelectorAll('img'));
    let i = 0;
    images.forEach((img, idx) => img.classList.toggle('active', idx===0));

    // Dots per image
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
    mobileTimer = setInterval(()=>{
      images[i].classList.remove('active');
      i = (i+1)%images.length;
      images[i].classList.add('active');
      if (dots.length){ dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===i))); }
    }, 2800);

    // Touch advance
    let startX = 0;
    grid.onTouchStartHandler && grid.removeEventListener('touchstart', grid.onTouchStartHandler);
    grid.onTouchEndHandler && grid.removeEventListener('touchend', grid.onTouchEndHandler);
    grid.onTouchStartHandler = (e)=>{ startX = e.touches[0].clientX; clearTimers(); };
    grid.onTouchEndHandler = (e)=>{
      const dx = (e.changedTouches[0]?.clientX||0) - startX;
      images[i].classList.remove('active');
      if (Math.abs(dx) > 24){ i = (i + (dx<0?1:images.length-1)) % images.length; }
      else { i = (i+1)%images.length; }
      images[i].classList.add('active');
      if (dots.length){ dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===i))); }
      mobileTimer = setInterval(()=>{
        images[i].classList.remove('active');
        i = (i+1)%images.length;
        images[i].classList.add('active');
        if (dots.length){ dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===i))); }
      }, 2800);
    };
    grid.addEventListener('touchstart', grid.onTouchStartHandler, {passive:true});
    grid.addEventListener('touchend', grid.onTouchEndHandler, {passive:true});
  }

  // Desktop: carousel with centered pages
  function enableDesktop(){
    clearTimers();
    grid.classList.remove('gallery-slider');

    // Wrap images into a track if needed
    if (!track){
      track = document.createElement('div');
      track.className = 'gallery-track';
      const imgs = Array.from(grid.querySelectorAll('img'));
      imgs.forEach(img => track.appendChild(img));
      grid.appendChild(track);
    }

    const images = Array.from(track.querySelectorAll('img'));
    // Estimate items per page based on container width and typical image width
    const containerWidth = grid.clientWidth;
    const sampleWidth = images[0]?.getBoundingClientRect().width || 240;
    const gap = 10; // synced with CSS
    itemsPerPage = Math.max(1, Math.floor((containerWidth + gap) / (sampleWidth + gap)));
    desktopPages = Math.max(1, Math.ceil(images.length / itemsPerPage));
    desktopIndex = 0;

    // Center content by padding track
    const totalContentWidth = images.reduce((w,img)=> w + (img.getBoundingClientRect().width || sampleWidth) + gap, -gap);
    const sidePad = Math.max(0, (containerWidth - Math.min(containerWidth, totalContentWidth)) / 2);
    track.style.paddingLeft = sidePad + 'px';
    track.style.paddingRight = sidePad + 'px';

    // Build dots per page
    if (dotsWrap){
      dotsWrap.innerHTML = '';
      for (let d=0; d<desktopPages; d++){
        const b = document.createElement('button');
        b.className = 'gallery-dot';
        b.setAttribute('aria-label', `Page ${d+1}`);
        b.setAttribute('role', 'tab');
        b.dataset.index = String(d);
        if (d===0) b.setAttribute('aria-selected','true');
        dotsWrap.appendChild(b);
      }
    }
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.gallery-dot')) : [];

    function applyDesktopTransform(){
      const pageWidth = grid.clientWidth;
      const x = -desktopIndex * pageWidth;
      track.style.transform = `translateX(${x}px)`;
      if (dots.length){ dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===desktopIndex))); }
    }

    // Autoplay
    desktopTimer = setInterval(()=>{
      desktopIndex = (desktopIndex + 1) % desktopPages;
      applyDesktopTransform();
    }, 3500);

    // Dots click
    if (dots.length){
      dots.forEach(dot => {
        dot.addEventListener('click', ()=>{
          clearTimers();
          desktopIndex = Number(dot.dataset.index||0) % desktopPages;
          applyDesktopTransform();
          desktopTimer = setInterval(()=>{
            desktopIndex = (desktopIndex + 1) % desktopPages;
            applyDesktopTransform();
          }, 3500);
        });
      });
    }

    // Resize handler to recalc
    enableDesktop.recalc && window.removeEventListener('resize', enableDesktop.recalc);
    enableDesktop.recalc = ()=>{
      // Re-run setup on resize to keep pages accurate
      enableDesktop();
    };
    window.addEventListener('resize', enableDesktop.recalc);

    applyDesktopTransform();
  }

  function disableAll(){
    clearTimers();
    grid.classList.remove('gallery-slider');
    if (track){
      track.style.transform = '';
      track.style.paddingLeft = '';
      track.style.paddingRight = '';
    }
    if (dotsWrap){ dotsWrap.innerHTML = ''; }
  }

  function update(){
    if (window.innerWidth <= 680){ enableMobile(); }
    else { enableDesktop(); }
  }

  update();
  // Note: enableDesktop attaches its own resize recalculation.
  window.addEventListener('resize', update);
})();

// Gallery Lightbox: open on image click, with next/prev and zoom
(function(){
  const grid = document.querySelector('.gallery-grid');
  const lightbox = document.getElementById('lightbox');
  if (!grid || !lightbox) return;
  const stageImg = document.getElementById('lightbox-image');
  const dotsWrap = document.getElementById('lightbox-dots');
  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox.querySelector('.lightbox-next');

  let images = [];
  let index = 0;
  let scale = 1;
  let lastTap = 0;

  function collectImages(){
    const track = grid.classList.contains('gallery-slider') ? grid : grid.querySelector('.gallery-track') || grid;
    images = Array.from(track.querySelectorAll('img'));
  }

  function openAt(i){
    collectImages();
    if (!images.length) return;
    index = Math.max(0, Math.min(i, images.length-1));
    stageImg.src = images[index].src;
    stageImg.alt = images[index].alt || 'Gallery image';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    scale = 1;
    stageImg.style.transform = 'scale(1)';

    // Build dots
    if (dotsWrap){
      dotsWrap.innerHTML = '';
      images.forEach((_, di)=>{
        const b = document.createElement('button');
        b.setAttribute('aria-label', `Image ${di+1}`);
        if (di===index) b.setAttribute('aria-selected','true');
        b.addEventListener('click', ()=>{ goTo(di); });
        dotsWrap.appendChild(b);
      });
    }
  }

  function close(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function goTo(i){
    index = (i + images.length) % images.length;
    stageImg.src = images[index].src;
    stageImg.alt = images[index].alt || 'Gallery image';
    scale = 1;
    stageImg.style.transform = 'scale(1)';
    if (dotsWrap){
      const dots = Array.from(dotsWrap.children);
      dots.forEach((d,di)=> d.setAttribute('aria-selected', String(di===index)));
    }
  }

  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }

  // Open on image click/tap
  grid.addEventListener('click', (e)=>{
    const t = e.target;
    if (t && t.tagName === 'IMG'){
      const all = Array.from(grid.querySelectorAll('img'));
      const i = all.indexOf(t);
      openAt(Math.max(0,i));
    }
  });

  // Controls
  btnClose && btnClose.addEventListener('click', close);
  btnNext && btnNext.addEventListener('click', next);
  btnPrev && btnPrev.addEventListener('click', prev);
  lightbox.addEventListener('click', (e)=>{
    if (e.target === lightbox) close();
  });

  // Keyboard
  document.addEventListener('keydown', (e)=>{
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Zoom: wheel and double-tap
  lightbox.addEventListener('wheel', (e)=>{
    if (!lightbox.classList.contains('open')) return;
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    scale = Math.min(4, Math.max(1, scale - delta*0.1));
    stageImg.style.transform = `scale(${scale.toFixed(2)})`;
  }, { passive:false });

  lightbox.addEventListener('touchend', (e)=>{
    const now = Date.now();
    if (now - lastTap < 300){
      // double tap to toggle zoom
      scale = scale > 1 ? 1 : 2;
      stageImg.style.transform = `scale(${scale})`;
    }
    lastTap = now;
  });

  // Swipe next/prev
  let startX = 0;
  lightbox.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
  lightbox.addEventListener('touchend', (e)=>{
    const dx = (e.changedTouches[0]?.clientX||0) - startX;
    if (Math.abs(dx) > 36){ dx < 0 ? next() : prev(); }
  });
})();

