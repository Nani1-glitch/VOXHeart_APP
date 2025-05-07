// Apple-level Hands-Free Voice Input Module for VOXHEART
// Author: AI

const VOX_VOICE_FIELDS = [
  { name: 'age', label: 'Please say your age in years.' },
  { name: 'gender', label: 'Say your gender: male or female.' },
  { name: 'height', label: 'What is your height in centimeters?' },
  { name: 'weight', label: 'Tell me your weight in kilograms.' },
  { name: 'ap_hi', label: 'What is your systolic blood pressure?' },
  { name: 'ap_lo', label: 'Now your diastolic blood pressure?' },
  { name: 'cholesterol', label: 'Rate your cholesterol: normal, above normal, or well above normal.' },
  { name: 'gluc', label: 'Rate your glucose: normal, above normal, or well above normal.' },
  { name: 'smoke', label: 'Do you smoke? Say yes or no.' },
  { name: 'alco', label: 'Do you consume alcohol? Say yes or no.' },
  { name: 'active', label: 'Are you physically active? Say yes or no.' }
];

function createVoiceModal() {
  if (document.getElementById('voice-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'voice-modal';
  modal.innerHTML = `
    <div class="voice-modal-backdrop"></div>
    <div class="voice-modal-content">
      <div class="voice-modal-header">
        <span id="voice-step"></span>
        <button id="voice-close" aria-label="Close">&times;</button>
      </div>
      <div class="voice-modal-body">
        <div id="voice-visualizer" style="display:flex;justify-content:center;align-items:center;margin-bottom:1.1rem;"></div>
        <div id="voice-prompt"></div>
        <div id="voice-transcript" class="voice-transcript"></div>
        <div id="voice-feedback"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('voice-close').onclick = closeVoiceModal;
}

function closeVoiceModal() {
  const modal = document.getElementById('voice-modal');
  if (modal) modal.remove();
  if (window.vox_recognition) window.vox_recognition.stop();
}

function speak(text, cb) {
  const synth = window.speechSynthesis;
  if (!synth) { cb && cb(); return; }
  const utter = new SpeechSynthesisUtterance(text);
  // Try to pick a female, emotional voice
  const voices = synth.getVoices();
  let found = voices.find(v => v.name.toLowerCase().includes('female') && v.lang.startsWith('en'));
  if (!found) found = voices.find(v => v.name.toLowerCase().includes('woman') && v.lang.startsWith('en'));
  if (!found) found = voices.find(v => v.lang.startsWith('en') && v.gender === 'female');
  if (!found) found = voices.find(v => v.lang.startsWith('en'));
  if (found) utter.voice = found;
  utter.pitch = 1.2;
  utter.rate = 0.97;
  utter.volume = 1;
  utter.onend = () => { cb && cb(); };
  synth.speak(utter);
}

function runAppleVoiceForm() {
  createVoiceModal();
  let step = 0;
  let results = {};
  const promptEl = document.getElementById('voice-prompt');
  const transcriptEl = document.getElementById('voice-transcript');
  const feedbackEl = document.getElementById('voice-feedback');
  const stepEl = document.getElementById('voice-step');
  const form = document.querySelector('form');

  function updateStep() {
    stepEl.textContent = `Step ${step + 1} of ${VOX_VOICE_FIELDS.length}`;
    promptEl.textContent = VOX_VOICE_FIELDS[step].label;
    transcriptEl.textContent = '';
    feedbackEl.textContent = '';
  }

  function fillField(val) {
    const field = VOX_VOICE_FIELDS[step].name;
    const input = document.querySelector(`[name='${field}']`);
    if (input) input.value = val;
    results[field] = val;
  }

  function listenAndProceed() {
    if (!('webkitSpeechRecognition' in window)) {
      feedbackEl.textContent = 'Voice input not supported in this browser.';
      speak('Sorry, voice input is not supported in this browser.');
      return;
    }
    feedbackEl.textContent = 'Listening...';
    transcriptEl.textContent = '';
    showVoiceVisualizer();
    const recognition = new webkitSpeechRecognition();
    window.vox_recognition = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = function(event) {
      hideVoiceVisualizer();
      const transcript = event.results[0][0].transcript;
      transcriptEl.textContent = transcript;
      feedbackEl.textContent = 'Heard!';
      fillField(transcript);
      setTimeout(() => {
        step++;
        if (step < VOX_VOICE_FIELDS.length) {
          updateStep();
          speak(VOX_VOICE_FIELDS[step].label, listenAndProceed);
        } else {
          // All done
          speak('Submitting the form.', () => {
            closeVoiceModal();
            setTimeout(() => {
              form.submit();
            }, 400);
          });
        }
      }, 600);
    };
    recognition.onerror = function(event) {
      hideVoiceVisualizer();
      feedbackEl.textContent = 'Sorry, could not understand. Please try again.';
      speak('Sorry, could not understand. Please try again.', listenAndProceed);
    };
    recognition.onend = function() {
      hideVoiceVisualizer();
      if (!transcriptEl.textContent) {
        feedbackEl.textContent = 'No input detected. Please try again.';
        speak('No input detected. Please try again.', listenAndProceed);
      }
    };
    recognition.start();
  }

  // Start the first prompt
  updateStep();
  speak(VOX_VOICE_FIELDS[step].label, listenAndProceed);
}

// Add floating button
function addVoiceFloatingBtn() {
  if (document.getElementById('voice-float-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'voice-float-btn';
  btn.className = 'btn btn-secondary';
  btn.style.position = 'fixed';
  btn.style.bottom = '32px';
  btn.style.right = '32px';
  btn.style.zIndex = 2000;
  btn.style.borderRadius = '50%';
  btn.style.width = '64px';
  btn.style.height = '64px';
  btn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
  btn.innerHTML = '<i class="fas fa-microphone"></i>';
  btn.onclick = runAppleVoiceForm;
  document.body.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', addVoiceFloatingBtn);

// Modal styles
const style = document.createElement('style');
style.innerHTML = `
#voice-modal { position: fixed; top:0; left:0; width:100vw; height:100vh; z-index:3000; display:flex; align-items:center; justify-content:center; }
.voice-modal-backdrop { position:absolute; top:0; left:0; width:100vw; height:100vh; background:rgba(30,41,59,0.25); }
.voice-modal-content { position:relative; background:white; border-radius:1.2rem; box-shadow:0 8px 32px rgba(0,0,0,0.18); padding:2.5rem 2rem 1.5rem 2rem; min-width:340px; max-width:90vw; }
.voice-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; font-size:1.1rem; font-weight:600; color:#2563eb; }
.voice-modal-body { margin-bottom:1.2rem; }
.voice-modal-footer { display:flex; gap:1rem; justify-content:flex-end; }
#voice-prompt { font-size:1.1rem; margin-bottom:0.7rem; color:#1e293b; }
.voice-transcript { font-size:1.2rem; color:#0ea5e9; margin-bottom:0.5rem; min-height:1.5em; }
#voice-feedback { font-size:0.95rem; color:#64748b; min-height:1.2em; }
#voice-close { background:none; border:none; font-size:2rem; color:#64748b; cursor:pointer; }
#voice-close:hover { color:#ef4444; }
`;
document.head.appendChild(style);

// Add visualizer CSS
const visualizerStyle = document.createElement('style');
visualizerStyle.innerHTML = `
.voice-bars { display: flex; gap: 0.18rem; height: 28px; }
.voice-bar { width: 6px; border-radius: 6px; background: linear-gradient(180deg,#2563eb 0%,#0ea5e9 100%); opacity: 0.85; animation: bar-bounce 1.1s infinite; }
.voice-bar:nth-child(2) { animation-delay: 0.15s; }
.voice-bar:nth-child(3) { animation-delay: 0.3s; }
.voice-bar:nth-child(4) { animation-delay: 0.45s; }
.voice-bar:nth-child(5) { animation-delay: 0.6s; }
@keyframes bar-bounce {
  0%,100% { height: 12px; }
  50% { height: 28px; }
}`;
document.head.appendChild(visualizerStyle);

function showVoiceVisualizer() {
  const vis = document.getElementById('voice-visualizer');
  if (!vis) return;
  vis.innerHTML = `<div class='voice-bars'>
    <div class='voice-bar'></div>
    <div class='voice-bar'></div>
    <div class='voice-bar'></div>
    <div class='voice-bar'></div>
    <div class='voice-bar'></div>
  </div>`;
}
function hideVoiceVisualizer() {
  const vis = document.getElementById('voice-visualizer');
  if (vis) vis.innerHTML = '';
} 