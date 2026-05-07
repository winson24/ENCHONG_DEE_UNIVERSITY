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
