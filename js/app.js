/* ============================================================
   APP.JS — Main Application
   Wires template selector, JSON editor, live preview,
   and code output together.
   ============================================================ */

(function () {
  'use strict';

  // --- DOM refs ---
  const templateSelect = document.getElementById('templateSelect');
  const previewArea = document.getElementById('previewArea');
  const configEditor = document.getElementById('configEditor');
  const configError = document.getElementById('configError');
  const htmlOutput = document.getElementById('htmlOutput');
  const cssOutput = document.getElementById('cssOutput');
  const copyAllBtn = document.getElementById('copyAllBtn');

  // --- State ---
  let currentTemplateIndex = 0;
  let currentConfig = null;
  let debounceTimer = null;

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    populateTemplateSelector();
    bindEvents();
    loadTemplate(0);
  }

  // ----------------------------------------------------------
  // Template selector
  // ----------------------------------------------------------
  function populateTemplateSelector() {
    TEMPLATES.forEach((tpl, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = tpl.name;
      templateSelect.appendChild(opt);
    });
  }

  function loadTemplate(index) {
    currentTemplateIndex = index;
    const tpl = TEMPLATES[index];
    currentConfig = JSON.parse(JSON.stringify(tpl.defaultConfig)); // deep clone
    configEditor.value = JSON.stringify(currentConfig, null, 2);
    hideError();
    updatePreview();
    updateCodeOutput();
  }

  // ----------------------------------------------------------
  // Preview
  // ----------------------------------------------------------
  function updatePreview() {
    const tpl = TEMPLATES[currentTemplateIndex];
    try {
      previewArea.innerHTML = tpl.render(currentConfig);
    } catch (e) {
      previewArea.innerHTML = '<p style="color:#fca5a5;font-size:13px;">Render error: ' + escapeHtml(e.message) + '</p>';
    }
  }

  // ----------------------------------------------------------
  // Code output
  // ----------------------------------------------------------
  function updateCodeOutput() {
    const tpl = TEMPLATES[currentTemplateIndex];

    // HTML
    let html = '';
    try {
      html = tpl.render(currentConfig);
    } catch (e) {
      html = '<!-- Render error: ' + e.message + ' -->';
    }

    // CSS — combine base tokens + base styles + variant CSS
    const css = generateCSS(tpl);

    // Set text content (Prism will highlight)
    htmlOutput.textContent = html;
    cssOutput.textContent = css;

    // Re-highlight
    if (window.Prism) {
      Prism.highlightElement(htmlOutput);
      Prism.highlightElement(cssOutput);
    }
  }

  function generateCSS(tpl) {
    // We output a self-contained CSS block for the popup
    return `/* === Popup Base Styles === */

.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.popup-container {
  position: relative;
  width: 380px;
  max-width: 95vw;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
  text-align: center;
  color: #ffffff;
}

.popup-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.popup-bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  z-index: 1;
}

.popup-content {
  position: relative;
  z-index: 2;
  padding: 24px;
}

.popup-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  line-height: 1;
}

.popup-title {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 4px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.popup-subtitle {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 20px;
}

.popup-hero {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.popup-hero img {
  max-height: 140px;
  width: auto;
  filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
}

.popup-amounts {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.popup-amount {
  display: flex;
  align-items: center;
  gap: 8px;
}

.popup-amount-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: contain;
}

.popup-amount-value {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.popup-amount-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1.2;
  white-space: pre-line;
  opacity: 0.9;
}

.popup-divider {
  display: flex;
  align-items: center;
  gap: 8px;
}

.popup-divider span {
  font-size: 16px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.popup-divider::before,
.popup-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
}

.popup-cta {
  display: inline-block;
  width: 100%;
  padding: 16px 32px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 700;
  color: #1a0a2e;
  background: linear-gradient(180deg, #ffe14d 0%, #ffc800 100%);
  box-shadow: 0 4px 15px rgba(255, 200, 0, 0.4);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 16px;
}

.popup-scatter {
  position: absolute;
  z-index: 3;
  pointer-events: none;
}

.popup-timer {
  margin-top: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.popup-timer-value {
  font-weight: 700;
  color: #ffe14d;
}

.popup-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.popup-badge--gold {
  background: linear-gradient(135deg, #ffe14d, #ffc800);
  color: #1a0a2e;
}

.popup-badge--green {
  background: linear-gradient(135deg, #0fffb2, #00d68f);
  color: #0a2e1a;
}

/* === Variant Styles === */

${tpl.css}`;
  }

  // ----------------------------------------------------------
  // Config editor handling
  // ----------------------------------------------------------
  function onConfigInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const raw = configEditor.value;
      try {
        currentConfig = JSON.parse(raw);
        hideError();
        updatePreview();
        updateCodeOutput();
      } catch (e) {
        showError(e.message);
      }
    }, 300);
  }

  function showError(msg) {
    configError.textContent = msg;
    configError.hidden = false;
  }

  function hideError() {
    configError.textContent = '';
    configError.hidden = true;
  }

  // ----------------------------------------------------------
  // Copy functionality
  // ----------------------------------------------------------
  function copyToClipboard(text, btnEl) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
      if (btnEl) {
        btnEl.classList.add('copied');
        const orig = btnEl.textContent;
        btnEl.textContent = 'Copied!';
        setTimeout(() => {
          btnEl.classList.remove('copied');
          btnEl.textContent = orig;
        }, 1500);
      }
    });
  }

  function copyAll() {
    const tpl = TEMPLATES[currentTemplateIndex];
    let html = '';
    try {
      html = tpl.render(currentConfig);
    } catch (_) {
      html = '';
    }
    const css = generateCSS(tpl);
    const combined = `<!-- HTML -->\n${html}\n\n<!-- CSS -->\n<style>\n${css}\n</style>`;
    copyToClipboard(combined, copyAllBtn);
  }

  // ----------------------------------------------------------
  // Toast notification
  // ----------------------------------------------------------
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    // Trigger reflow for animation
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // ----------------------------------------------------------
  // Utility
  // ----------------------------------------------------------
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ----------------------------------------------------------
  // Event bindings
  // ----------------------------------------------------------
  function bindEvents() {
    // Template selector
    templateSelect.addEventListener('change', (e) => {
      loadTemplate(parseInt(e.target.value, 10));
    });

    // Config editor
    configEditor.addEventListener('input', onConfigInput);

    // Tab key support in textarea
    configEditor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = configEditor.selectionStart;
        const end = configEditor.selectionEnd;
        configEditor.value = configEditor.value.substring(0, start) + '  ' + configEditor.value.substring(end);
        configEditor.selectionStart = configEditor.selectionEnd = start + 2;
        onConfigInput();
      }
    });

    // Copy All button
    copyAllBtn.addEventListener('click', copyAll);

    // Individual copy buttons
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          copyToClipboard(targetEl.textContent, btn);
        }
      });
    });
  }

  // ----------------------------------------------------------
  // Boot
  // ----------------------------------------------------------
  document.addEventListener('DOMContentLoaded', init);

})();
