// Eid festive offer — fullscreen popup with countdown to Tue 26 May 2026
(function(){
  const modal = document.getElementById('offer-modal');
  const closeBtn = document.getElementById('offer-close');
  if (!modal || !closeBtn) return;

  const OFFER_END = new Date(2026, 4, 26, 23, 59, 59); // May 26, 2026 (Tuesday), local time
  const DISMISS_KEY = 'bismi_eid_offer_dismissed';

  const daysEl = document.getElementById('offer-days');
  const hoursEl = document.getElementById('offer-hours');
  const minsEl = document.getElementById('offer-mins');
  const secsEl = document.getElementById('offer-secs');
  const logoVideo = document.getElementById('offer-logo-video');
  const offerMusic = document.getElementById('offer-music');
  const soundToggle = document.getElementById('offer-sound-toggle');
  const audioUnlock = document.getElementById('offer-audio-unlock');
  const MUSIC_VOLUME = 0.55;
  const AUDIO_UNLOCK_KEY = 'bismi_audio_unlocked';

  const ua = navigator.userAgent || '';
  const IS_IN_APP_BROWSER = /Instagram|FBAN|FBAV|FB_IAB|Twitter|Line\/|MicroMessenger|Snapchat|TikTok|LinkedInApp/i.test(ua);
  const IS_IOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const IS_MOBILE = IS_IOS || /Android/i.test(ua);

  let timerId = null;
  let musicRetryTimers = [];
  let autoplayCheckTimer = null;

  function hasAudioUnlock(){
    try { return sessionStorage.getItem(AUDIO_UNLOCK_KEY) === '1'; } catch (e) { return false; }
  }

  function setAudioUnlock(){
    try { sessionStorage.setItem(AUDIO_UNLOCK_KEY, '1'); } catch (e) {}
  }

  function needsTapForAudio(){
    return IS_IN_APP_BROWSER || IS_MOBILE;
  }

  function updateSoundToggle(playing){
    if (!soundToggle) return;
    soundToggle.setAttribute('aria-pressed', String(playing));
    soundToggle.setAttribute('aria-label', playing ? 'Mute music' : 'Unmute music');
    soundToggle.classList.toggle('is-waiting-audio', !playing);
  }

  function isMusicAudible(){
    return offerMusic && !offerMusic.paused && !offerMusic.ended && !offerMusic.muted;
  }

  function showAudioUnlock(){
    if (!audioUnlock) return;
    audioUnlock.hidden = false;
    audioUnlock.classList.add('is-visible');
  }

  function hideAudioUnlock(){
    if (!audioUnlock) return;
    audioUnlock.classList.remove('is-visible');
    audioUnlock.hidden = true;
  }

  /** Direct play inside a tap/click handler — works on Safari & Instagram */
  function playMusicWithGesture(){
    if (!offerMusic || !modal.classList.contains('open')) return false;
    offerMusic.muted = false;
    offerMusic.volume = MUSIC_VOLUME;
    const playAttempt = offerMusic.play();
    if (playAttempt && typeof playAttempt.catch === 'function'){
      playAttempt.catch(()=>{});
    }
    const playing = !offerMusic.paused;
    updateSoundToggle(playing);
    return playing;
  }

  function unlockOfferAudio(){
    setAudioUnlock();
    hideAudioUnlock();
    playMusicWithGesture();
    clearMusicRetries();
  }

  function playOfferMusicAutoplay(){
    if (!offerMusic || !modal.classList.contains('open')) return Promise.resolve(false);
    if (isMusicAudible()){
      updateSoundToggle(true);
      hideAudioUnlock();
      return Promise.resolve(true);
    }

    offerMusic.volume = MUSIC_VOLUME;
    const attempt = (startMuted) => {
      offerMusic.muted = !!startMuted;
      return offerMusic.play().then(() => {
        if (startMuted){
          offerMusic.muted = false;
          offerMusic.volume = MUSIC_VOLUME;
        }
        updateSoundToggle(true);
        hideAudioUnlock();
        return true;
      });
    };

    return attempt(true)
      .catch(() => attempt(false))
      .catch(() => {
        updateSoundToggle(false);
        return false;
      });
  }

  function clearMusicRetries(){
    musicRetryTimers.forEach((id) => clearTimeout(id));
    musicRetryTimers = [];
    if (autoplayCheckTimer){
      clearTimeout(autoplayCheckTimer);
      autoplayCheckTimer = null;
    }
  }

  function scheduleMusicAutoplay(){
    clearMusicRetries();
    if (!modal.classList.contains('open')) return;

    if (needsTapForAudio() && !hasAudioUnlock()){
      showAudioUnlock();
      return;
    }

    playOfferMusicAutoplay();
    [80, 200, 500, 1000, 1800].forEach((ms) => {
      musicRetryTimers.push(setTimeout(() => {
        if (!modal.classList.contains('open')) return;
        if (isMusicAudible()){
          hideAudioUnlock();
          return;
        }
        playOfferMusicAutoplay();
      }, ms));
    });

    autoplayCheckTimer = setTimeout(() => {
      if (!modal.classList.contains('open')) return;
      if (isMusicAudible()) hideAudioUnlock();
      else showAudioUnlock();
    }, 1100);
  }

  function stopOfferMusic(){
    if (!offerMusic) return;
    clearMusicRetries();
    offerMusic.pause();
    offerMusic.currentTime = 0;
    offerMusic.muted = false;
    updateSoundToggle(false);
    hideAudioUnlock();
  }

  function muteOfferMusic(){
    if (!offerMusic) return;
    offerMusic.pause();
    updateSoundToggle(false);
  }

  function toggleOfferMusic(){
    if (!offerMusic) return;
    if (isMusicAudible()) muteOfferMusic();
    else {
      setAudioUnlock();
      playMusicWithGesture();
    }
  }

  if (audioUnlock){
    audioUnlock.addEventListener('click', (e)=>{
      e.preventDefault();
      unlockOfferAudio();
    });
  }

  if (soundToggle){
    soundToggle.addEventListener('click', (e)=>{
      e.stopPropagation();
      toggleOfferMusic();
    });
  }

  if (offerMusic){
    offerMusic.addEventListener('error', ()=>{
      if (soundToggle) soundToggle.hidden = true;
      hideAudioUnlock();
    });
    const retryWhenReady = () => {
      if (!modal.classList.contains('open') || needsTapForAudio()) return;
      if (!isMusicAudible()) playOfferMusicAutoplay();
    };
    offerMusic.addEventListener('canplay', retryWhenReady);
    offerMusic.addEventListener('canplaythrough', retryWhenReady);
    offerMusic.load();
  }

  function playOfferVideo(){
    if (!logoVideo) return;
    logoVideo.muted = true;
    const playAttempt = logoVideo.play();
    if (playAttempt && typeof playAttempt.catch === 'function'){
      playAttempt.catch(()=>{});
    }
  }

  function pauseOfferVideo(){
    if (!logoVideo) return;
    logoVideo.pause();
  }

  function pad(n){ return String(n).padStart(2, '0'); }

  function updateCountdown(){
    const diff = OFFER_END.getTime() - Date.now();
    if (diff <= 0){
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      closeOffer();
      return false;
    }
    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(mins);
    if (secsEl) secsEl.textContent = pad(secs);
    return true;
  }

  function openOffer(){
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('offer-modal-open');
    if (soundToggle) soundToggle.hidden = false;
    playOfferVideo();
    scheduleMusicAutoplay();
    updateCountdown();
    if (!timerId){
      timerId = setInterval(()=>{
        if (!updateCountdown() && timerId){
          clearInterval(timerId);
          timerId = null;
        }
      }, 1000);
    }
  }

  function closeOffer(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('offer-modal-open');
    pauseOfferVideo();
    stopOfferMusic();
    hideAudioUnlock();
    if (soundToggle){
      soundToggle.hidden = true;
      soundToggle.classList.remove('is-waiting-audio');
    }
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
    if (timerId){
      clearInterval(timerId);
      timerId = null;
    }
  }

  closeBtn.addEventListener('click', closeOffer);
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && modal.classList.contains('open')) closeOffer();
  });

  function primeOfferAudio(){
    if (!offerMusic || needsTapForAudio()) return Promise.resolve();
    offerMusic.muted = true;
    return offerMusic.play()
      .then(()=>{
        offerMusic.pause();
        offerMusic.currentTime = 0;
        offerMusic.muted = false;
      })
      .catch(()=>{
        offerMusic.muted = false;
      });
  }

  if (Date.now() > OFFER_END.getTime()) return;

  let dismissed = false;
  try { dismissed = sessionStorage.getItem(DISMISS_KEY) === '1'; } catch (e) {}
  if (!dismissed){
    if (hasAudioUnlock()){
      openOffer();
    } else {
      primeOfferAudio().finally(() => openOffer());
    }
  }
})();

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
  const total = 4; // faces

  function applyRotation(){
    const cube = inner.parentElement;
    const styles = cube ? getComputedStyle(cube) : null;
    const radius = styles ? parseFloat(styles.getPropertyValue('--radius')) || 400 : 400;
    const angle = index * -90; // 4 faces around Y axis
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
    if (!chatMessages.querySelector('.message')) {
      startGuidedFlow();
    }
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

  function addOptions(question, choices) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-options';
    const prompt = document.createElement('div');
    prompt.className = 'chat-options-prompt';
    prompt.textContent = question;
    wrapper.appendChild(prompt);
    const list = document.createElement('div');
    list.className = 'chat-options-list';
    choices.forEach((choice) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = `chat-option${choice.accent ? ' chat-option-accent' : ''}`;
      option.textContent = choice.label;
      option.addEventListener('click', (event) => {
        event.stopPropagation();
        wrapper.remove();
        addMessage(choice.label, 'user');
        choice.action();
      });
      list.appendChild(option);
    });
    wrapper.appendChild(list);
    chatMessages.appendChild(wrapper);
    scrollToBottom();
  }

  function startGuidedFlow() {
    addMessage("Hi ma! I'm Faris shaahida 😊", 'bot');
    addMessage('Welcome to BISMI. Enna help venum ma?', 'bot');
    addOptions('Please choose one option:', [
      { label: 'Aari embroidery', action: () => aariFlow() },
      { label: 'Bridal blouse work', action: () => bridalFlow() },
      { label: 'Mehendi / henna cones', action: () => hennaFlow() },
      { label: 'See designs and gallery', action: () => websiteChoice('Designs paakanuma ma?', '/aari-designs/', 'Open Aari designs') },
      { label: 'Know about BISMI', action: () => websiteChoice('Of course ma, BISMI pathi inga paakalaam:', '/about/', 'About BISMI') }
    ]);
  }

  function aariFlow() {
    addMessage('Aari work pannuvom ma. Which work are you looking for?', 'bot');
    addOptions('Choose one:', [
      { label: 'Custom blouse', action: () => enquiryFlow('Custom Aari blouse') },
      { label: 'Saree border / pallu', action: () => enquiryFlow('Saree border / pallu work') },
      { label: 'Bridal Aari work', action: () => bridalFlow() },
      { label: 'Work details and process', action: () => websiteChoice('Work types and process details inga irukku ma:', '/aari-embroidery/', 'Aari embroidery page') }
    ]);
  }

  function bridalFlow() {
    addMessage('Bridal work-ku custom detailing pannalam ma. Occasion edhu?', 'bot');
    addOptions('Choose the occasion:', [
      { label: 'Wedding / bridal', action: () => bridalTiming('Wedding / bridal') },
      { label: 'Engagement', action: () => bridalTiming('Engagement') },
      { label: 'Reception / party', action: () => bridalTiming('Reception / party') },
      { label: 'Gifting', action: () => bridalTiming('Gifting') },
      { label: 'Other occasion', action: () => bridalTiming('Other occasion') }
    ]);
  }

  function bridalTiming(occasion) {
    addMessage('Nice ma. Event eppo?', 'bot');
    addOptions('Choose the closest timing:', [
      { label: 'Within 1 month', action: () => bridalFinish(occasion, 'Within 1 month') },
      { label: '1–3 months', action: () => bridalFinish(occasion, '1–3 months') },
      { label: 'More than 3 months', action: () => bridalFinish(occasion, 'More than 3 months') },
      { label: 'Date not decided', action: () => bridalFinish(occasion, 'Date not decided') }
    ]);
  }

  function bridalFinish(occasion, timing) {
    addMessage('Light, medium or heavy work venuma ma?', 'bot');
    addOptions('Choose the finish:', [
      { label: 'Light and delicate', action: () => confirmWhatsApp('Bridal blouse / Aari work', occasion, timing, 'Light and delicate') },
      { label: 'Medium detailing', action: () => confirmWhatsApp('Bridal blouse / Aari work', occasion, timing, 'Medium detailing') },
      { label: 'Heavy bridal work', action: () => confirmWhatsApp('Bridal blouse / Aari work', occasion, timing, 'Heavy bridal work') },
      { label: 'Not sure, please advise', action: () => confirmWhatsApp('Bridal blouse / Aari work', occasion, timing, 'Not sure, please advise') }
    ]);
  }

  function hennaFlow() {
    addMessage('Sure ma! Henna cones-ku which pack venum?', 'bot');
    addOptions('Choose a pack:', [
      { label: 'Single cone', action: () => confirmWhatsApp('Mehendi / henna cones', 'Personal use', 'Not specified', 'Single cone') },
      { label: 'Set of 6', action: () => confirmWhatsApp('Mehendi / henna cones', 'Function or festival', 'Not specified', 'Set of 6') },
      { label: 'Bulk order', action: () => confirmWhatsApp('Mehendi / henna cones', 'Artist / parlour', 'Not specified', 'Bulk order') },
      { label: 'Pack and delivery details', action: () => websiteChoice('Pack options and delivery details inga irukku ma:', '/mehendi-cones/', 'Mehendi cones page') }
    ]);
  }

  function enquiryFlow(service) {
    confirmWhatsApp(service, 'Custom enquiry', 'Not specified', 'Quote required');
  }

  function websiteChoice(message, path, label) {
    addMessage(message, 'bot');
    const link = document.createElement('a');
    link.className = 'chat-option chat-option-link';
    link.href = `https://bismiaarimehendi.store${path}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    chatMessages.appendChild(link);
    addOptions('Anything else ma?', [{ label: 'Start again', action: () => { chatMessages.innerHTML = ''; startGuidedFlow(); } }]);
    scrollToBottom();
  }

  function confirmWhatsApp(service, occasion, timing, finish) {
    addMessage('Thank you ma, I have noted that. Shall I send this summary to WhatsApp?', 'bot');
    addOptions('Please confirm:', [
      { label: 'Yes, send to WhatsApp →', accent: true, action: () => sendEnquiry(service, occasion, timing, finish) },
      { label: 'Start again', action: () => { chatMessages.innerHTML = ''; startGuidedFlow(); } }
    ]);
  }

  function sendEnquiry(service, occasion, timing, finish) {
    const details = [
      service && !['Custom enquiry'].includes(service) ? `I’m interested in ${service.toLowerCase()}.` : '',
      occasion && !['Custom enquiry'].includes(occasion) ? `It’s for ${occasion.toLowerCase()}.` : '',
      timing && !['Not specified', 'Date not decided'].includes(timing) ? `The event is ${timing.toLowerCase()}.` : '',
      finish && !['Quote required', 'Not specified'].includes(finish) ? `I’m looking for ${finish.toLowerCase()}.` : ''
    ].filter(Boolean);
    const message = [
      'Hi ma 😊 I’d like to enquire about BISMI.',
      ...details,
      'Could you please confirm the availability and guide me with the next step?'
    ].join('\n');
    window.open(`https://wa.me/919677179922?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    addMessage('Done ma 😊 Your enquiry is ready on WhatsApp. They can guide you personally from there.', 'bot');
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
    // Use the site's local keyword replies when no API connection is available.
    const localReply = generateBotResponse(message);
    hideTypingIndicator();
    addMessage(localReply, 'bot');
    chatSend.disabled = false;
    chatInput.focus();
    return;

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
    const hasAny = (terms) => terms.some((term) => {
      if (term.includes(' ')) return message.includes(term);
      return new RegExp(`\\b${term}\\b`, 'i').test(message);
    });

    const purchaseIntent = hasAny(['buy', 'purchase', 'place an order', 'order now', 'want to order', 'need to order', 'book a', 'book my', 'reserve']) || (hasAny(['order', 'book']) && hasAny(['i want', 'i need', 'can i', 'please', 'ready to']));
    if (purchaseIntent || hasAny(['available', 'slot'])) {
      return "Of course ma! I'm so happy to help with your order. Unga service and requirement details share pannina, availability and next steps discuss pannalam. Ready ah irundha WhatsApp la continue pannunga ma: <a href='https://wa.me/919677179922?text=Hi%20ma!%20I%20want%20to%20place%20an%20order%20for%20BISMI%20Aari%20%26%20Mehendi%20Center.%20Please%20help%20me%20with%20details.' target='_blank' style='color:#25D366;text-decoration:none;font-weight:bold;'>📱 Continue on WhatsApp</a>";
    }

    if (hasAny(['nalam', 'health', 'irukinga'])) {
      return "Hi ma, na nalla iruken! Neenga epdi irukinga ma? Welcome to BISMI! 😊 Enna panreenga ma? Are you looking for some beautiful Aari work or maybe our fresh henna cones?";
    }
    
    if (hasAny(['vanakkam', 'namaskaram', 'assalamu', 'as-salamu', 'salaam', 'salam', 'wa alaikum', 'walaikum'])) {
      return "Wa alaikum assalam ma! Vanakkam 😊 Eppadi irukinga? Aari work details venuma, illati henna cones details venuma ma? Sollunga, I’ll guide you.";
    }
    
    if (hasAny(['price', 'cost', 'rate', 'pricing', 'how much', 'budget', 'velai', 'vilai', 'quotation', 'quote'])) {
      return "Sure ma! Aari pricing depends on design, coverage, materials and hours involved. Our <a href='https://bismiaarimehendi.store/aari-embroidery-price/'>Aari pricing guide</a> explains it clearly. Design photo share pannina, I can guide you more accurately ma.";
    }

    if (hasAny(['delivery', 'deliver', 'parcel', 'ship', 'shipping', 'courier', 'abroad', 'international'])) {
      return "Delivery pathi sollaren ma! Henna cones Tamil Nadu full ah deliver pannalam, abroad kooda request based arrange pannalam. Aari delivery or pickup details work and location based discuss pannuvom. Unga place sollunga ma?";
    }

    if (hasAny(['location', 'address', 'where', 'enga', 'area', 'thanjavur', 'thanjai', 'pandaravadai'])) {
      return "BISMI Pandaravadai, Thanjavur la irukku ma. Henna cones Tamil Nadu locations-ku deliver pannalam, and Aari pickup or delivery discuss pannuvom. Neenga enga irukinga ma?";
    }

    if (hasAny(['payment', 'upi', 'gpay', 'phonepe', 'paytm', 'advance'])) {
      return "Payment-ku GPay, PhonePe and UPI options discuss pannalam ma. Custom Aari orders-ku advance details design confirm pannumbodhu explain pannuvom. Unga requirement share pannunga ma.";
    }

    if (hasAny(['design', 'sample', 'example', 'pattern', 'photo', 'picture', 'model', 'portfolio'])) {
      return "Oh ma! Design examples paakanuma? Our <a href='https://bismiaarimehendi.store/aari-designs/'>Aari Designs page</a> and Gallery la previous work irukku. Ungalukku pidicha design screenshot eduthu share pannina, similar work possible ah discuss pannalam ma.";
    }

    if (hasAny(['bridal', 'bride', 'wedding', 'marriage', 'brides', 'engagement', 'reception', 'sangeet'])) {
      return "Oh ma! Bridal and wedding work pannuvom. Light, medium and heavy detailing, custom blouse designs and related Aari work discuss pannalam. Bridal blouse details inga paakalaam: <a href='https://bismiaarimehendi.store/bridal-aari-blouse/'>Bridal Aari page</a>. Event date and reference design irundha share pannunga ma.";
    }

    if (hasAny(['aari', 'embroidery', 'blouse', 'saree', 'sari', 'lehenga', 'pattu', 'zari', 'mirror work', 'border work'])) {
      return "Aari work is our specialty ma! Blouse, saree border and custom embroidery work pannuvom. Design types and process pathi inga paakalaam: <a href='https://bismiaarimehendi.store/aari-embroidery/'>Aari embroidery page</a>. Ungalukku custom work venumna, design photo and event date share pannunga ma.";
    }

    if (hasAny(['henna', 'cone', 'mehendi', 'mehandi', 'organic', 'natural', 'stain', 'chemical', 'pure'])) {
      return "Oh ma! Henna cones preparation and batch details pathi our Mehendi Cones page la explain pannirukku: <a href='https://bismiaarimehendi.store/mehendi-cones/'>view henna details</a>. Ungalukku quantity or delivery venumna sollunga ma.";
    }

    if (hasAny(['time', 'duration', 'how long', 'deadline', 'event date', 'neram', 'evlo'])) {
      return "Good question ma! Aari timeline design complexity and coverage based irukkum. <a href='https://bismiaarimehendi.store/aari-order-process/'>Order Process page</a> la planning details irukku. Event date sollunga ma, availability pathi guide pannaren.";
    }

    if (hasAny(['instagram', 'gallery', 'photos', 'pics'])) {
      return "Oh yes ma! Instagram @bismi_aari_mehendi_center and our Gallery la work paakalaam. Ungalukku pidicha design screenshot share pannunga ma.";
    }

    if (hasAny(['gift', 'gifting', 'present'])) {
      return "Aww ma, gifting-ku henna cone sets or custom Aari work consider pannalam. Occasion and budget sollunga ma, suitable option suggest pannaren.";
    }

    if (hasAny(['thank', 'thanks', 'nandri'])) {
      return "You’re most welcome ma! 😊 Innum edhavadhu Aari or henna details venumna ketkalaam ma.";
    }

    if (hasAny(['hello', 'hi', 'hey', 'welcome'])) {
      return "Hi ma!  Neenga epdi irukinga? Welcome to BISMI! 😊 I'm so happy you came to chat with me! Enna panreenga ma? Are you looking for some beautiful Aari work or maybe our fresh henna cones?";
    }
    if (hasAny(['allah', 'alhamdulillah', 'masha allah', 'mashaallah'])) {
      return "Masha Allah ma! Romba nandri 😊 Ungaloda appreciation na romba sandhosham. Enna design pathi yosikringala ma?";
    }

    if (hasAny(['nalla', 'romba nalla'])) {
      return "Aama ma, romba nalla irukku! I'm so happy you like it! What exactly are you looking for ma? Aari work or henna cones? I can help you with everything!";
    }

    if (hasAny(['seri', 'okay', 'aama'])) {
      return "Seri ma! Super! Tell me more about what you need ma. I'm here to help you with all our beautiful work!";
    }

    return "Oh ok ma! I want to understand your requirement properly. Are you looking for Aari work, bridal blouse work, henna cones, designs, pricing, or delivery details? Sollunga ma, I’ll guide you.";
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

