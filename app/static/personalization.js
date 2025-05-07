// Personalized Greeting for VOXHEART
// Author: AI

function getGreetingTime() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
}

function showGreeting(name) {
    const greetingArea = document.getElementById('greeting-area');
    greetingArea.innerHTML = `
      <div id="personal-greeting" style="display:flex;align-items:center;justify-content:center;gap:0.7rem;margin-bottom:1.5rem;animation:fadeInUp 1s cubic-bezier(.23,1.01,.32,1) both;">
        <span style="font-size:1.45rem;font-weight:700;color:#2563eb;text-shadow:0 2px 8px rgba(30,41,59,0.13);">
          ${getGreetingTime()}, ${name}!
        </span>
        <button id="edit-name-btn" title="Edit name" style="background:none;border:none;cursor:pointer;font-size:1.2rem;color:#2563eb;padding:0 0.2rem;">
          <i class="fas fa-edit"></i>
        </button>
      </div>
    `;
    document.getElementById('edit-name-btn').onclick = showNameModal;
}

function showNameModal() {
    const modal = document.getElementById('name-modal');
    modal.style.display = 'flex';
    document.getElementById('name-input').value = localStorage.getItem('voxheart_name') || '';
    setTimeout(() => {
      document.getElementById('name-input').focus();
    }, 100);
}

function hideNameModal() {
    document.getElementById('name-modal').style.display = 'none';
}

// --- Dynamic Health Tips ---
const HEALTH_TIPS = [
  "Stay active: Aim for at least 30 minutes of moderate exercise most days.",
  "Eat more fruits and vegetables for a heart-healthy diet.",
  "Limit salt and processed foods to help control blood pressure.",
  "Don't smoke, and avoid secondhand smoke whenever possible.",
  "Manage stress with relaxation, mindfulness, or hobbies you enjoy.",
  "Get regular sleep: 7–8 hours per night helps your heart recover.",
  "Keep a healthy weight to reduce your risk of heart disease.",
  "See your doctor for regular checkups and screenings.",
  "Drink water instead of sugary drinks for better heart health.",
  "Take breaks from sitting—move around every hour!"
];
let tipIndex = 0;
let tipInterval = null;

function renderHealthTip(idx) {
  const card = document.getElementById('health-tip-card');
  card.innerHTML = `
    <div class="tip-card" style="background:linear-gradient(90deg,#2563eb 0%,#0ea5e9 100%);color:#fff;border-radius:1.2rem;box-shadow:0 4px 16px rgba(37,99,235,0.10);padding:1.5rem 2rem;max-width:600px;margin:0 auto 2rem auto;display:flex;align-items:center;gap:1.2rem;position:relative;min-height:80px;">
      <button id="tip-prev" aria-label="Previous tip" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;opacity:0.7;transition:opacity 0.2s;position:absolute;left:1rem;top:50%;transform:translateY(-50%);"><i class="fas fa-chevron-left"></i></button>
      <div id="tip-text" style="flex:1;text-align:center;font-size:1.18rem;font-weight:600;opacity:0;transition:opacity 0.5s;">${HEALTH_TIPS[idx]}</div>
      <button id="tip-next" aria-label="Next tip" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;opacity:0.7;transition:opacity 0.2s;position:absolute;right:1rem;top:50%;transform:translateY(-50%);"><i class="fas fa-chevron-right"></i></button>
    </div>
  `;
  setTimeout(() => {
    document.getElementById('tip-text').style.opacity = 1;
  }, 50);
  document.getElementById('tip-prev').onclick = () => {
    tipIndex = (tipIndex - 1 + HEALTH_TIPS.length) % HEALTH_TIPS.length;
    fadeToTip(tipIndex);
    resetTipInterval();
  };
  document.getElementById('tip-next').onclick = () => {
    tipIndex = (tipIndex + 1) % HEALTH_TIPS.length;
    fadeToTip(tipIndex);
    resetTipInterval();
  };
}

function fadeToTip(idx) {
  const tipText = document.getElementById('tip-text');
  if (!tipText) return;
  tipText.style.opacity = 0;
  setTimeout(() => {
    tipText.textContent = HEALTH_TIPS[idx];
    tipText.style.opacity = 1;
  }, 400);
}

function startTipInterval() {
  tipInterval = setInterval(() => {
    tipIndex = (tipIndex + 1) % HEALTH_TIPS.length;
    fadeToTip(tipIndex);
  }, 6000);
}
function resetTipInterval() {
  clearInterval(tipInterval);
  startTipInterval();
}

// --- Button Ripple Effect ---
function addRippleEffect(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  circle.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = size + 'px';
  circle.style.left = (e.clientX - rect.left - size/2) + 'px';
  circle.style.top = (e.clientY - rect.top - size/2) + 'px';
  btn.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
}

// --- Floating Label Support ---
function updateFilledClass(input) {
  const group = input.closest('.form-group');
  if (!group) return;
  if (input.value) {
    group.classList.add('filled');
  } else {
    group.classList.remove('filled');
  }
}

// --- Dark Mode Toggle ---
function setDarkMode(on) {
  document.body.classList.toggle('dark-mode', on);
  const icon = document.querySelector('#dark-toggle i');
  if (icon) icon.className = on ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('voxheart_dark', on ? '1' : '0');
}

// --- Mascot Animation & Easter Egg ---
function mascotWave() {
  const mascot = document.getElementById('mascot-heart');
  if (!mascot) return;
  mascot.classList.add('mascot-wave');
  setTimeout(() => mascot.classList.remove('mascot-wave'), 1800);
}
function mascotBounce() {
  const mascot = document.getElementById('mascot-heart');
  if (!mascot) return;
  mascot.classList.add('mascot-bounce');
  setTimeout(() => mascot.classList.remove('mascot-bounce'), 900);
}
function mascotDance() {
  const mascot = document.getElementById('mascot-heart');
  if (!mascot) return;
  mascot.classList.add('mascot-dance');
  setTimeout(() => mascot.classList.remove('mascot-dance'), 2200);
}
function mascotBroken() {
  const mascot = document.getElementById('mascot-heart');
  if (!mascot) return;
  mascot.classList.add('mascot-broken');
  setTimeout(() => mascot.classList.remove('mascot-broken'), 2200);
}
let mascotClicks = 0;

document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('voxheart_name');
    if (!name) {
        showNameModal();
    } else {
        showGreeting(name);
    }
    document.getElementById('name-submit').onclick = () => {
        const val = document.getElementById('name-input').value.trim();
        if (val.length > 0) {
            localStorage.setItem('voxheart_name', val);
            showGreeting(val);
            hideNameModal();
        } else {
            document.getElementById('name-input').focus();
        }
    };
    document.getElementById('name-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            document.getElementById('name-submit').click();
        }
    });
    // Hide modal on outside click
    document.getElementById('name-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('name-modal')) hideNameModal();
    });
    renderHealthTip(tipIndex);
    startTipInterval();
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', addRippleEffect);
    });
    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => updateFilledClass(input));
      updateFilledClass(input);
    });
    const darkPref = localStorage.getItem('voxheart_dark');
    setDarkMode(darkPref === '1');
    const darkBtn = document.getElementById('dark-toggle');
    if (darkBtn) {
      darkBtn.onclick = () => setDarkMode(!document.body.classList.contains('dark-mode'));
    }
    mascotWave();
    const mascot = document.getElementById('mascot-heart');
    if (mascot) {
      mascot.addEventListener('mouseenter', mascotWave);
      mascot.addEventListener('focus', mascotWave);
      mascot.addEventListener('click', () => {
        mascotBounce();
        mascotClicks++;
        if (mascotClicks === 5) {
          mascotDance();
          mascotClicks = 0;
        }
      });
    }
    // Mascot reacts to results
    const safeBadge = document.querySelector('.prediction-badge.prediction-safe');
    if (safeBadge && mascot) {
      setTimeout(mascotDance, 700);
    }
    const riskBadge = document.querySelector('.prediction-badge.prediction-risk');
    if (riskBadge && mascot) {
      setTimeout(mascotBroken, 700);
    }
});

// Mascot animation CSS
const mascotStyle = document.createElement('style');
mascotStyle.innerHTML = `
#mascot-heart { transition: transform 0.22s cubic-bezier(.23,1.01,.32,1); }
#mascot-heart.mascot-wave svg { animation: mascot-wave 1.8s cubic-bezier(.23,1.01,.32,1); }
@keyframes mascot-wave {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(-10deg); }
  20% { transform: rotate(12deg); }
  30% { transform: rotate(-8deg); }
  40% { transform: rotate(8deg); }
  50% { transform: rotate(-6deg); }
  60% { transform: rotate(6deg); }
  70% { transform: rotate(-4deg); }
  80% { transform: rotate(4deg); }
  90% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
}
#mascot-heart.mascot-bounce { animation: mascot-bounce 0.9s cubic-bezier(.23,1.01,.32,1); }
@keyframes mascot-bounce {
  0% { transform: scale(1); }
  20% { transform: scale(1.18,0.88); }
  40% { transform: scale(0.92,1.12); }
  60% { transform: scale(1.08,0.96); }
  80% { transform: scale(0.98,1.04); }
  100% { transform: scale(1); }
}
#mascot-heart.mascot-dance svg { animation: mascot-dance 2.2s cubic-bezier(.23,1.01,.32,1); }
@keyframes mascot-dance {
  0% { transform: rotate(0deg) scale(1); }
  10% { transform: rotate(-10deg) scale(1.1); }
  20% { transform: rotate(10deg) scale(1.1); }
  30% { transform: rotate(-10deg) scale(1.1); }
  40% { transform: rotate(10deg) scale(1.1); }
  50% { transform: rotate(-10deg) scale(1.1); }
  60% { transform: rotate(10deg) scale(1.1); }
  70% { transform: rotate(-10deg) scale(1.1); }
  80% { transform: rotate(10deg) scale(1.1); }
  90% { transform: rotate(-10deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}
#mascot-heart.mascot-broken svg #mascot-heart-shape {
  transition: fill 0.5s;
  fill: #ef4444 !important;
}
#mascot-heart.mascot-broken { animation: mascot-shake 1.2s cubic-bezier(.23,1.01,.32,1); }
@keyframes mascot-shake {
  0%,100% { transform: none; }
  10%,30%,50%,70%,90% { transform: translateX(-6px) rotate(-4deg); }
  20%,40%,60%,80% { transform: translateX(6px) rotate(4deg); }
}
#mascot-heart.mascot-broken::after {
  content: '';
  position: absolute;
  left: 50%; top: 38%;
  width: 4px; height: 32px;
  background: repeating-linear-gradient(135deg,#fff 0 2px,#ef4444 2px 6px);
  border-radius: 2px;
  transform: translate(-50%,0) rotate(-18deg);
  z-index: 2;
  box-shadow: 0 0 8px #ef4444;
  animation: mascot-crack 1.2s cubic-bezier(.23,1.01,.32,1);
}
@keyframes mascot-crack {
  0% { height: 0; opacity: 0; }
  40% { height: 32px; opacity: 1; }
  100% { height: 32px; opacity: 1; }
}
#mascot-heart.mascot-broken svg ellipse[id^='mascot-heart-eye-'] {
  fill: #ef4444;
}
#mascot-heart.mascot-broken svg ellipse[id^='mascot-heart-eye-left'],
#mascot-heart.mascot-broken svg ellipse[id^='mascot-heart-eye-right'] {
  rx: 2.2; ry: 2.2;
}
#mascot-heart.mascot-broken svg ellipse[id^='mascot-heart-eye-left'] ~ ellipse,
#mascot-heart.mascot-broken svg ellipse[id^='mascot-heart-eye-right'] ~ ellipse {
  display: none;
}
#mascot-heart.mascot-broken svg ellipse[id^='mascot-heart-eye-left'] {
  cx: 32; cy: 43;
}
#mascot-heart.mascot-broken svg ellipse[id^='mascot-heart-eye-right'] {
  cx: 52; cy: 43;
}
`;
document.head.appendChild(mascotStyle); 