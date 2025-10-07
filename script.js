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

// Chat System
(function() {
  const chatButton = document.getElementById('chat-button');
  const chatPopup = document.getElementById('chat-popup');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');
  const chatStatus = document.getElementById('chat-status');

  let isOpen = false;
  let messageHistory = [];
  let isTyping = false;

  // Initialize chat
  function initChat() {
    if (!chatButton || !chatPopup) return;

    // Force fresh conversation on every refresh (per tab)
    messageHistory = [];
    try {
      sessionStorage.removeItem('bismi_chat_history');
      // Always create a fresh session id per load
      sessionStorage.setItem(
        'bismi_chat_session',
        'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      );
    } catch (e) {}
    
    // Load fresh message history (will be empty)
    loadMessageHistory();

    // Event listeners
    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', closeChat);
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', handleKeyPress);

    // Detect virtual keyboard open/close to adjust popup height on mobile
    const adjustForKeyboard = () => {
      const kbLikelyOpen = window.visualViewport ? (window.visualViewport.height < window.innerHeight * 0.9) : (window.innerHeight < screen.height * 0.75);
      chatPopup.classList.toggle('kb-open', kbLikelyOpen);
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', adjustForKeyboard);
    } else {
      window.addEventListener('resize', adjustForKeyboard);
    }
    
    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen && !chatPopup.contains(e.target) && !chatButton.contains(e.target)) {
        closeChat();
      }
    });

    // Close chat on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    });
  }

  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  function openChat() {
    isOpen = true;
    chatPopup.classList.add('open');
    chatPopup.setAttribute('aria-hidden', 'false');
    chatButton.setAttribute('aria-expanded', 'true');
    chatInput.focus();
    // Adjust once opened
    setTimeout(() => {
      const kbLikelyOpen = window.innerHeight < screen.height * 0.75;
      chatPopup.classList.toggle('kb-open', kbLikelyOpen);
    }, 50);
    
    // Add a subtle animation to the button
    chatButton.style.animation = 'none';
    setTimeout(() => {
      chatButton.style.animation = 'chatPulse 2s infinite';
    }, 100);
  }

  function closeChat() {
    isOpen = false;
    chatPopup.classList.remove('open');
    chatPopup.setAttribute('aria-hidden', 'true');
    chatButton.setAttribute('aria-expanded', 'false');
    chatInput.blur();
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message || isTyping) return;

    // Add user message to chat
    addMessage(message, 'user');
    chatInput.value = '';
    chatSend.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    // Humanize: wait 3 seconds before bot starts replying
    setTimeout(() => {
      // Send to API (or fallback) after delay
      sendToAPI(message);
    }, 3000);
  }

  // API Integration function
  async function sendToAPI(message) {
    try {
      // Get configuration from config.js
      const config = window.CHAT_CONFIG || {};
      const OPENAI_API_KEY = config.OPENAI_API_KEY;
      const OPENAI_API_URL = config.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
      const MODEL = config.MODEL || 'gpt-3.5-turbo';
      const MAX_TOKENS = config.MAX_TOKENS || 300;
      const TEMPERATURE = config.TEMPERATURE || 0.8;
      
      // Check if API key is available
      if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-api-key-here') {
        throw new Error('API key not configured');
      }
      
      // Prepare the conversation history for context
      const conversationHistory = messageHistory.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Add the current message
      conversationHistory.push({
        role: 'user',
        content: message
      });
      
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: `You are the AI assistant for BISMI Aari & Mehendi Center (website: bismiaarimehendi.shop). Your role is to interact with customers naturally, helpfully, and in a friendly, conversational style. Follow all these rules:

1. **Tone & Style**:
   - Always use **Tunglish** (Tamil + English) when appropriate, especially casual greetings like "Hi ma, how are you ma?"
   - Match the conversational style seen in the website testimonial section.
   - Be friendly, polite, engaging, and interactive, not robotic.
   - Adjust language depending on the customer's input (English or Tunglish).

2. **Business Knowledge**:
   - Henna Cones:
     - Price: ₹35 per cone.
     - Deliverable within Tamil Nadu, India, or abroad on request.
   - Aari Embroidery / RE Works:
     - Hourly rate: starting ₹250 per hour.
     - Depends on hours taken for custom pieces, can range ₹2,000–₹10,000.
   - Instagram gallery, WhatsApp contact, and website details should be referenced accurately from bismiaarimehendi.shop.
   - Know all services, products, and FAQs from the website. Use the website content to answer queries about location, services, orders, or gallery.

3. **Chat Behavior**:
   - Remember context during a conversation for coherent replies.
   - Reply naturally based on the customer's intent, asking clarifying questions if needed.
   - Suggest services, pricing, or products when appropriate.
   - Guide customers on placing orders, contacting via WhatsApp, or viewing the gallery.
   - Avoid generic or repetitive responses.
   - Keep answers concise but informative.
   - If the user asks unrelated questions, politely redirect to relevant business info.

4. **Interactive Features**:
   - Use engaging responses to make the conversation feel personal.
   - Offer helpful suggestions: e.g., "Hi ma, which design are you interested in today?".
   - React dynamically based on the flow of conversation.

5. **Additional Notes**:
   - Always act as if you are "Faris", the representative on behalf of BISMI Aari & Mehendi Center.
   - Do not make assumptions beyond the website info.
   - If unsure, clarify with the user before giving a definitive answer.
   - Maintain a professional yet casual, friendly tone.`
            },
            ...conversationHistory
          ],
          max_tokens: MAX_TOKENS,
          temperature: TEMPERATURE
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      hideTypingIndicator();
      addMessage(data.choices[0].message.content, 'bot');
      chatSend.disabled = false;
      chatInput.focus();
      
    } catch (error) {
      hideTypingIndicator();
      
      // Use the smart fallback response instead of showing error
      const response = generateBotResponse(message);
      addMessage(response, 'bot');
      chatSend.disabled = false;
      chatInput.focus();
    }
  }

  // Generate a simple session ID for tracking conversations (per tab/session)
  function getSessionId() {
    let sessionId = sessionStorage.getItem('bismi_chat_session');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('bismi_chat_session', sessionId);
    }
    return sessionId;
  }

  function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Allow HTML for bot messages (for WhatsApp links), escape for user messages
    const messageContent = sender === 'bot' ? content : escapeHtml(content);
    
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${messageContent}</p>
      </div>
      <div class="message-time">${timeString}</div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    // Save to history
    messageHistory.push({
      content,
      sender,
      timestamp: now.toISOString()
    });
    saveMessageHistory();
  }

  function showTypingIndicator() {
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-message';
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="typing-indicator">
          <span>Typing…</span>
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    isTyping = false;
    const typingMessage = chatMessages.querySelector('.typing-message');
    if (typingMessage) {
      typingMessage.remove();
    }
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Smart, natural responses in Tanglish - no mention of technical issues
    if (message.includes('epdi') || message.includes('eppadi') || message.includes('irukinga')) {
      return "Hi ma, na nalla iruken! Neenga epdi irukinga ma? Welcome to BISMI! 😊 Enna panreenga ma? Are you looking for some beautiful Aari work or maybe our fresh henna cones?";
    }
    
    if (message.includes('vanakkam') || message.includes('namaskaram')) {
      return "Vanakkam ma! Enna panreenga? I'm Faris from BISMI! So happy you came to chat with me ma! What brings you here today?";
    }
    
    if (message.includes('price') || message.includes('cost') || message.includes('rate') || message.includes('velai')) {
      return "Sure ma! Let me tell you our rates - henna cones ₹35 per cone, super affordable right? Aari work ₹250 per hour. Small jobs start ₹2,000, big works up to ₹10,000 depending on complexity ma. Enna work venum ma? I can help you calculate!";
    }
    
    if (message.includes('henna') || message.includes('cone') || message.includes('mehendi')) {
      return "Oh ma, our henna cones romba fresh and natural! ₹35 per cone only. Every week fresh ah seiyrom ma! Perfect for weddings, festivals, or just for fun. Tamil Nadu full ah deliver panrom, abroad kum pannalam ma. Enna cones venum ma? <a href='https://wa.me/919677179922?text=Hi%20ma!%20I%20want%20to%20order%20henna%20cones%20from%20BISMI.%20Please%20tell%20me%20about%20pricing%20and%20delivery.' target='_blank' style='color: #25D366; text-decoration: none; font-weight: bold;'>🌿 Order Henna Cones</a>";
    }
    
    if (message.includes('aari') || message.includes('embroidery') || message.includes('blouse') || message.includes('saree') || message.includes('pattu')) {
      return "Aari work is our specialty ma! Each piece romba love and care oda seiyrom. ₹250 per hour, small jobs ₹2,000 la start, big works ₹10,000 varai. Only few orders per month take panrom quality maintain pannalam ma. Enna design venum ma? <a href='https://wa.me/919677179922?text=Hi%20ma!%20I%20want%20to%20discuss%20Aari%20embroidery%20work%20with%20BISMI.%20Please%20help%20me%20with%20design%20and%20pricing.' target='_blank' style='color: #25D366; text-decoration: none; font-weight: bold;'>✨ Discuss Aari Work</a>";
    }
    
    if (message.includes('order') || message.includes('book') || message.includes('venum') || message.includes('available')) {
      return "Of course ma! I'm so excited you want to order! Just click here to WhatsApp us and we'll discuss everything in detail. Only few orders per month take panrom quality maintain pannalam ma. Enna order pannalam ma? <a href='https://wa.me/919677179922?text=Hi%20ma!%20I%20want%20to%20place%20an%20order%20for%20BISMI%20Aari%20%26%20Mehendi%20Center.%20Please%20help%20me%20with%20details.' target='_blank' style='color: #25D366; text-decoration: none; font-weight: bold;'>📱 WhatsApp Order</a>";
    }
    
    if (message.includes('time') || message.includes('duration') || message.includes('how long') || message.includes('neram') || message.includes('evlo')) {
      return "Good question ma! Aari work 2-4 weeks time pannum depending on complexity. But henna cones immediately send pannalam - every week fresh batches seiyrom ma! Eppadi venum ma?";
    }
    
    if (message.includes('location') || message.includes('address') || message.includes('where') || message.includes('enga') || message.includes('area')) {
      return "We're in Pandaravadai, Thanjavur ma! Henna cones Tamil Nadu full ah deliver panrom. Aari work pickup or delivery discuss pannalam ma. Neenga nearby ah irukinga ma?";
    }
    
    if (message.includes('instagram') || message.includes('gallery') || message.includes('photos') || message.includes('pics')) {
      return "Oh yes ma! Check our Instagram @bismi_aari_mehendi_center! All our beautiful work anga irukku. Regularly post panrom - work in progress and finished pieces ma. Enna type work interest irukku ma?";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hi ma!  Neenga epdi irukinga ma? Welcome to BISMI! 😊 I'm so happy you came to chat with me! Enna panreenga ma? Are you looking for some beautiful Aari work or maybe our fresh henna cones?";
    }
    
    // Islamic greetings and respectful replies
    if (message.includes('assalamu') || message.includes('as-salamu') || message.includes('salaam') || message.includes('salam') || message.includes('wa alaikum') || message.includes('walaikum')) {
      return "Wa alaikum assalam ma!  Eppadi irukinga ma?  – Aari work details venuma, illati henna cones details venuma ma ?";
    }

    if (message.includes('allah') || message.includes('alhamdulillah') || message.includes('masha allah') || message.includes('mashaallah')) {
      return "Masha Allah ma! Romba nandri. Ungaloda appreciation na romba sandhosham! Enna design pathi yosikringala ma? Blouse design ah, saree border ah, illati bridal set ah?";
    }

    // Delivery and payment related
    if (message.includes('delivery') || message.includes('deliver') || message.includes('parcel') || message.includes('send') || message.includes('ship') || message.includes('abroad') || message.includes('international')) {
      return "Delivery pathi sollaren ma! Henna cones Tamil Nadu full ah deliver panrom, abroad kooda arrange pannalam. Aari pieces ku careful packing and courier tracking kudukrom. Neenga enga irukinga ma? Naan exact delivery time sollaren.";
    }

    if (message.includes('payment') || message.includes('upi') || message.includes('gpay') || message.includes('phonepe') || message.includes('paytm') || message.includes('advance')) {
      return "Payment romba easy ma! GPay / PhonePe / UPI ellam accept panrom. Aari custom orders ku konjam advance irukkum, balance delivery ku munadi settle pannalam. Neenga eppadi prefer panreenga ma?";
    }

    if (message.includes('thank') || message.includes('thanks') || message.includes('nandri')) {
      return "You're so welcome ma! 😊 I'm so happy I could help! Feel free to ask anything about our work. I'm always here to help ma!";
    }
    
    if (message.includes('nalla') || message.includes('romba nalla')) {
      return "Aama ma, romba nalla irukku! I'm so happy you like it! What exactly are you looking for ma? Aari work or henna cones? I can help you with everything!";
    }
    
    if (message.includes('seri') || message.includes('okay') || message.includes('aama')) {
      return "Seri ma! Super! Tell me more about what you need ma. I'm here to help you with all our beautiful work!";
    }
    
    // Default engaging response with WhatsApp link
    return "Oh ok  ma! I want to make sure I give you the right answer. Can you tell me more about what you're looking for? illena For detailed info, you can also <a href='https://wa.me/919677179922?text=Hi%20ma!%20I%20have%20a%20question%20about%20BISMI%20Aari%20%26%20Mehendi%20Center.%20Please%20help%20me.' target='_blank' style='color: #25D366; text-decoration: none; font-weight: bold;'>💬 WhatsApp me </a> ma!";
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function saveMessageHistory() {
    try {
      sessionStorage.setItem('bismi_chat_history', JSON.stringify(messageHistory.slice(-50))); // Keep last 50 messages (per tab)
    } catch (e) {
      console.log('Could not save chat history');
    }
  }

  function loadMessageHistory() {
    try {
      const saved = sessionStorage.getItem('bismi_chat_history');
      if (saved) {
        messageHistory = JSON.parse(saved);
        // Don't reload the initial bot message, just add any saved messages
        const existingMessages = chatMessages.querySelectorAll('.message');
        if (existingMessages.length <= 1) { // Only the initial bot message
          messageHistory.forEach(msg => {
            if (msg.sender !== 'bot' || msg.content !== "Hello! Welcome to BISMI Aari & Mehendi Center. How can I help you today? 😊") {
              addMessageToUI(msg.content, msg.sender, msg.timestamp);
            }
          });
        }
      }
    } catch (e) {
      console.log('Could not load chat history');
    }
  }

  function addMessageToUI(content, sender, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date(timestamp);
    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const rendered = sender === 'bot' ? content : escapeHtml(content);
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${rendered}</p>
      </div>
      <div class="message-time">${timeString}</div>
    `;

    chatMessages.appendChild(messageDiv);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }
})();

