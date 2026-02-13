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
  let cachedPopupCSS = '';

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    populateTemplateSelector();
    bindEvents();
    // Load popup.css for the code output panel
    fetch('css/popup.css')
      .then(r => r.text())
      .then(css => { cachedPopupCSS = css; })
      .catch(() => { cachedPopupCSS = '/* Could not load popup.css */'; })
      .finally(() => { loadTemplate(0); });
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
    // Bind interactive behaviours inside the preview
    bindPreviewInteractions();
  }

  function bindPreviewInteractions() {
    // Coin fountain on Free Coins V2 CTA
    const ctaV2 = previewArea.querySelector('#cta-v2');
    if (ctaV2) {
      ctaV2.addEventListener('click', function () {
        if (this.classList.contains('is-claimed')) return;
        this.classList.add('is-claimed');
        // Reset after animation completes so it can be triggered again
        setTimeout(() => {
          this.classList.remove('is-claimed');
        }, 1200);
      });
    }

    // Close button behaviour (re-open after brief hide)
    previewArea.querySelectorAll('.popup-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); // Don't actually close in the editor
      });
    });
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

    // CSS — full popup.css contents
    const css = cachedPopupCSS || '/* Loading CSS... */';

    // Set text content (Prism will highlight)
    htmlOutput.textContent = html;
    cssOutput.textContent = css;

    // Re-highlight
    if (window.Prism) {
      Prism.highlightElement(htmlOutput);
      Prism.highlightElement(cssOutput);
    }
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
    const css = cachedPopupCSS;
    const fontLink = "https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800;900&display=swap";
    const combined = `<!-- Add Google Font: ${fontLink} -->\n\n<!-- HTML -->\n${html}\n\n<style>\n${css}\n</style>`;
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
    templateSelect.addEventListener('change', (e) => {
      loadTemplate(parseInt(e.target.value, 10));
    });

    configEditor.addEventListener('input', onConfigInput);

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

    copyAllBtn.addEventListener('click', copyAll);

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
