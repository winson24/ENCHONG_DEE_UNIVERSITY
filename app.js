// ===== TAB NAVIGATION =====
function switchTab(tab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById('page-' + tab);
  if (page) page.classList.add('active');
  const link = document.querySelector(`.nav-link[data-tab="${tab}"]`);
  if (link) link.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (tab === 'id-maker') initIDCard();
  if (tab === 'gallery') renderGallery();
}

// Nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchTab(link.dataset.tab);
  });
});

// Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Navbar scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 3;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 12 + 8}s;animation-delay:${Math.random() * 10}s`;
    container.appendChild(p);
  }
}
createParticles();

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target).toLocaleString() + '+';
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
setTimeout(() => animateCounter(document.getElementById('counter-members'), 12480), 500);

// ===== PHOTO UPLOAD =====
const photoInput = document.getElementById('photoInput');
photoInput.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const src = e.target.result;
    // Form preview
    const prev = document.getElementById('photoPreview');
    const placeholder = document.getElementById('photoPlaceholder');
    prev.src = src;
    prev.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';
    // Card photo
    const cardImg = document.getElementById('cardPhotoImg');
    const cardPlaceholder = document.getElementById('cardPhotoPlaceholder');
    cardImg.src = src;
    cardImg.style.display = 'block';
    if (cardPlaceholder) cardPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
});

// ===== LIVE PREVIEW UPDATE =====
function liveUpdate() {
  const name = document.getElementById('inputName').value.trim().toUpperCase() || 'YOUR NAME';
  const position = document.getElementById('inputPosition').value;
  const dept = document.getElementById('inputDept').value;
  const year = document.getElementById('inputYear').value;
  const idSuffix = document.getElementById('inputId').value.replace(/\D/g, '').substring(0, 4) || 'XXXX';
  const studentId = `EDU-${year}-${idSuffix}`;
  const quoteEl = document.getElementById('inputQuote');
  const quote = quoteEl ? quoteEl.value.trim() : '';
  const defaultQuote = '"True yearning isn\'t just about feeling the absence; it\'s the quiet strength that drives a heart forward while holding onto its deepest hopes."';

  document.getElementById('cf-name').textContent = name;
  document.getElementById('cf-position').textContent = position;
  document.getElementById('cf-dept').textContent = dept;
  document.getElementById('cf-id').textContent = studentId;
  document.getElementById('cf-joined').textContent = year;
  document.getElementById('cardRoleBadge').textContent = position;
  document.getElementById('cardBarcodeLabel').textContent = studentId;

  const footerEl = document.getElementById('cardFooterText');
  if (footerEl) footerEl.textContent = quote || defaultQuote;

  // update char count
  const counter = document.getElementById('quoteCharCount');
  if (counter && quoteEl) counter.textContent = quoteEl.value.length;
}

['inputName', 'inputPosition', 'inputDept', 'inputYear', 'inputId', 'inputQuote'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', liveUpdate);
});

// ===== GENERATE ID =====
let qrGenerated = false;
let barcodeGenerated = false;

function initIDCard() {
  generateQR();
  generateBarcode();
}

function generateQR() {
  const qrEl = document.getElementById('cardQr');
  qrEl.innerHTML = '';
  const idSuffix = document.getElementById('inputId').value.replace(/\D/g, '').substring(0, 4) || 'XXXX';
  const year = document.getElementById('inputYear').value;
  const studentId = `EDU-${year}-${idSuffix}`;
  new QRCode(qrEl, {
    text: `https://enchongdeeu.yearner/${studentId}`,
    width: 55, height: 55,
    colorDark: '#0d2b5e', colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  });
}

function generateBarcode() {
  const idSuffix = document.getElementById('inputId').value.replace(/\D/g, '').substring(0, 4) || 'XXXX';
  const year = document.getElementById('inputYear').value;
  const studentId = `EDU-${year}-${idSuffix}`;
  try {
    JsBarcode('#cardBarcode', studentId, {
      format: 'CODE128', width: 1.5, height: 36,
      displayValue: false, background: '#ffffff', lineColor: '#0d2b5e'
    });
  } catch (e) { console.warn('Barcode error:', e); }
  document.getElementById('cardBarcodeLabel').textContent = studentId;
}

function generateID() {
  liveUpdate();
  generateQR();
  generateBarcode();
  const btn = document.getElementById('generateBtn');
  btn.textContent = '✅ ID Generated!';
  btn.style.background = 'linear-gradient(135deg,#1a7a4c,#2aab6b)';
  setTimeout(() => {
    btn.textContent = '✨ Generate My ID Card';
    btn.style.background = '';
  }, 2000);
}

// ===== DOWNLOAD ID =====
function downloadID() {
  const card = document.getElementById('idCard');
  html2canvas(card, { scale: 3, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
    const link = document.createElement('a');
    const name = document.getElementById('inputName').value.trim().replace(/\s+/g, '_') || 'Yearner';
    link.download = `EDU_ID_${name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// ===== RESET FORM =====
function resetForm() {
  document.getElementById('inputName').value = '';
  document.getElementById('inputPosition').value = 'STUDENT';
  document.getElementById('inputDept').value = 'YEARNING';
  document.getElementById('inputYear').value = '2026';
  document.getElementById('inputId').value = '';
  document.getElementById('photoInput').value = '';
  const defaultQuote = '"True yearning isn\'t just about feeling the absence; it\'s the quiet strength that drives a heart forward while holding onto its deepest hopes."';
  const quoteEl = document.getElementById('inputQuote');
  if (quoteEl) quoteEl.value = defaultQuote;
  const counter = document.getElementById('quoteCharCount');
  if (counter) counter.textContent = defaultQuote.length;
  // Reset photo
  document.getElementById('photoPreview').style.display = 'none';
  const ph = document.getElementById('photoPlaceholder');
  if (ph) ph.style.display = 'flex';
  const cardImg = document.getElementById('cardPhotoImg');
  cardImg.src = '';
  cardImg.style.display = 'none';
  const cardPh = document.getElementById('cardPhotoPlaceholder');
  if (cardPh) cardPh.style.display = 'flex';
  liveUpdate();
  generateQR();
  generateBarcode();
}

// ===== GALLERY DATA =====
const galleryData = [
  { name: 'WINSON MIRANDA', dept: 'YEARNING', id: 'EDU-2026-2126', year: '2026', color: '#1a3a6b' },
  { name: 'SOFIA REYES', dept: 'DEVOTION', id: 'EDU-2026-0312', year: '2026', color: '#1a3a6b' },
  { name: 'MARCO SANTOS', dept: 'ADMIRATION', id: 'EDU-2026-1887', year: '2026', color: '#1a3a6b' },
  { name: 'ALEXA LOZANO', dept: 'YEARNING', id: 'EDU-2025-4521', year: '2025', color: '#1a3a6b' },
  { name: 'JORDAN TAN', dept: 'LONGING', id: 'EDU-2026-0099', year: '2026', color: '#1a3a6b' },
  { name: 'BELLE GARCIA', dept: 'YEARNING', id: 'EDU-2025-7733', year: '2025', color: '#1a3a6b' },
  { name: 'RYAN DELA CRUZ', dept: 'DEVOTION', id: 'EDU-2026-3310', year: '2026', color: '#1a3a6b' },
  { name: 'CAMILLE RAMOS', dept: 'ADMIRATION', id: 'EDU-2024-5501', year: '2024', color: '#1a3a6b' },
];

function miniCard(person) {
  return `
  <div class="gallery-item" title="${person.name}">
    <div class="gallery-mini-card">
      <div class="gmc-header">ENCHONG DEE UNIVERSITY</div>
      <div class="gmc-body">
        <div class="gmc-photo">
          <svg viewBox="0 0 80 80" fill="none" style="width:38px;height:38px"><circle cx="40" cy="28" r="16" fill="#1a3a6b" opacity=".4"/><ellipse cx="40" cy="68" rx="26" ry="20" fill="#1a3a6b" opacity=".4"/></svg>
        </div>
        <div class="gmc-info">
          <div class="gmc-name">${person.name}</div>
          <div class="gmc-field">DEPT: ${person.dept}</div>
          <div class="gmc-field">ID: ${person.id}</div>
          <div class="gmc-field">JOINED: ${person.year}</div>
        </div>
      </div>
      <div class="gmc-footer">"True yearning isn't just about feeling the absence; it's the quiet strength that drives a heart forward..."</div>
    </div>
    <div class="gallery-item-name">${person.name}</div>
  </div>`;
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (grid.children.length > 0) return;
  grid.innerHTML = galleryData.map(miniCard).join('');
}

// ===== INIT =====
liveUpdate();

// ===== YOUTUBE MUSIC PLAYER =====
let ytPlayer = null;
let ytMuted = false;
let ytPlaying = false;
let ytTitleInterval = null;

// Called automatically by YouTube IFrame API once script loads
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('ytPlayer', {
    height: '1',
    width: '1',
    playerVars: {
      listType: 'playlist',
      list: 'PLiy0XOfUv4hHoME_9Odd_LGqGERwFkvMD',
      autoplay: 1,
      mute: 1,          // start muted to satisfy autoplay policy
      controls: 0,
      disablekb: 1,
      loop: 1,
      rel: 0,
      playsinline: 1,
      enablejsapi: 1,
    },
    events: {
      onReady: onYtReady,
      onStateChange: onYtStateChange,
    }
  });
}

function onYtReady(e) {
  e.target.playVideo();
  ytMuted = true;
  updateMuteIcon();
  // Unmute on first user interaction
  document.addEventListener('click', function unmuteFn() {
    if (ytPlayer && ytMuted) {
      ytPlayer.unMute();
      ytMuted = false;
      updateMuteIcon();
    }
    document.removeEventListener('click', unmuteFn);
  }, { once: true });
  startTitlePoll();
}

function onYtStateChange(e) {
  const state = e.data;
  if (state === YT.PlayerState.PLAYING) {
    ytPlaying = true;
    document.getElementById('mpDisc').classList.add('spinning');
    document.getElementById('mpMiniDisc').classList.add('spinning');
    document.getElementById('mpPlayIcon').innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  } else {
    ytPlaying = false;
    document.getElementById('mpDisc').classList.remove('spinning');
    document.getElementById('mpMiniDisc').classList.remove('spinning');
    document.getElementById('mpPlayIcon').innerHTML = '<path d="M8 5v14l11-7z"/>';
  }
  updateSongTitle();
}

function startTitlePoll() {
  clearInterval(ytTitleInterval);
  ytTitleInterval = setInterval(updateSongTitle, 3000);
  updateSongTitle();
}

function updateSongTitle() {
  if (!ytPlayer || typeof ytPlayer.getVideoData !== 'function') return;
  try {
    const data = ytPlayer.getVideoData();
    const title = (data && data.title) ? data.title : 'Yearner Playlist';
    const el = document.getElementById('mpTitle');
    if (el) {
      el.textContent = title;
      // Enable marquee for long titles
      el.classList.toggle('marquee', title.length > 22);
    }
  } catch (_) {}
}

function ytToggle() {
  if (!ytPlayer) return;
  if (ytPlaying) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
    if (ytMuted) {
      ytPlayer.unMute();
      ytMuted = false;
      updateMuteIcon();
    }
  }
}

function ytNext() {
  if (!ytPlayer) return;
  ytPlayer.nextVideo();
  setTimeout(updateSongTitle, 600);
}

function ytPrev() {
  if (!ytPlayer) return;
  ytPlayer.previousVideo();
  setTimeout(updateSongTitle, 600);
}

function ytToggleMute() {
  if (!ytPlayer) return;
  if (ytMuted) {
    ytPlayer.unMute();
    ytMuted = false;
  } else {
    ytPlayer.mute();
    ytMuted = true;
  }
  updateMuteIcon();
}

function updateMuteIcon() {
  const btn = document.getElementById('mpVol');
  const icon = document.getElementById('mpVolIcon');
  if (!btn || !icon) return;
  if (ytMuted) {
    btn.classList.add('muted');
    icon.innerHTML = '<path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.82 8.82 0 0 0 17.73 20L19 21.27 20.27 20 5.27 3 4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>';
  } else {
    btn.classList.remove('muted');
    icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
  }
}

function toggleMusicPlayer() {
  const player = document.getElementById('musicPlayer');
  const pill = document.getElementById('mpMiniPill');
  if (player.style.display === 'none') {
    player.style.display = 'flex';
    pill.style.display = 'none';
  } else {
    player.style.display = 'none';
    pill.style.display = 'flex';
  }
}
