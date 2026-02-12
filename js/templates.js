/* ============================================================
   TEMPLATE REGISTRY
   Each template: { name, defaultConfig, render(config), css }
   ============================================================ */

// eslint-disable-next-line no-unused-vars
const TEMPLATES = [

  /* -------------------------------------------------------
     TEMPLATE 1: Special Offer
     ------------------------------------------------------- */
  {
    name: 'Special Offer',
    defaultConfig: {
      title: 'Special Offer! 🎁',
      subtitle: 'SHOW UP DAILY — AND CLAIM YOUR REWARDS',
      heroImage: 'assets/images/roo-character.svg',
      bgImage: 'assets/images/offer-bg-wave.svg',
      scatterImages: [
        { src: 'assets/images/star-gold.svg', top: '8%', left: '10%', size: '24px', rotate: '-15deg' },
        { src: 'assets/images/star-gold.svg', top: '12%', right: '12%', size: '18px', rotate: '20deg' },
        { src: 'assets/images/sparkle.svg', bottom: '30%', left: '6%', size: '20px', rotate: '0deg' }
      ],
      amounts: [
        { icon: 'assets/images/gc-coin.svg', value: '1,000,000', color: '#ffe14d' },
        { icon: 'assets/images/sc-coin.svg', value: '40', color: '#0fffb2', label: 'FOR\nFREE' }
      ],
      cta: { text: 'Buy for $24.99' },
      timer: { label: 'Offer expires in', value: '04:59:32' }
    },

    render(config) {
      const scatterHtml = (config.scatterImages || []).map(s => {
        const style = [
          s.top ? `top:${s.top}` : '',
          s.bottom ? `bottom:${s.bottom}` : '',
          s.left ? `left:${s.left}` : '',
          s.right ? `right:${s.right}` : '',
          s.size ? `width:${s.size};height:${s.size}` : '',
          s.rotate ? `transform:rotate(${s.rotate})` : ''
        ].filter(Boolean).join(';');
        return `    <img class="popup-scatter" src="${s.src}" alt="" style="${style}">`;
      }).join('\n');

      const amountsHtml = config.amounts.map(a => {
        const labelHtml = a.label
          ? `\n        <span class="popup-amount-label" style="color:${a.color}">${a.label}</span>`
          : '';
        return `      <div class="popup-amount">
        <img class="popup-amount-icon" src="${a.icon}" alt="">
        <span class="popup-amount-value" style="color:${a.color}">${a.value}</span>${labelHtml}
      </div>`;
      }).join('\n');

      const dividerHtml = config.amounts.length > 1
        ? '\n      <div class="popup-divider"><span>+</span></div>\n'
        : '';

      // Insert divider between amounts
      const amountsWithDivider = config.amounts.length > 1
        ? config.amounts.map((a, i) => {
            const labelHtml = a.label
              ? `\n        <span class="popup-amount-label" style="color:${a.color}">${a.label}</span>`
              : '';
            const block = `      <div class="popup-amount">
        <img class="popup-amount-icon" src="${a.icon}" alt="">
        <span class="popup-amount-value" style="color:${a.color}">${a.value}</span>${labelHtml}
      </div>`;
            return i < config.amounts.length - 1
              ? block + '\n      <div class="popup-divider"><span>+</span></div>'
              : block;
          }).join('\n')
        : amountsHtml;

      const timerHtml = config.timer
        ? `\n    <div class="popup-timer">${config.timer.label} <span class="popup-timer-value">${config.timer.value}</span></div>`
        : '';

      const bgImageHtml = config.bgImage
        ? `\n    <div class="popup-bg-image" style="background-image:url('${config.bgImage}')"></div>`
        : '';

      return `<div class="popup-overlay">
  <div class="popup-container popup--special-offer">
    <div class="popup-bg"></div>${bgImageHtml}
    <button class="popup-close">&times;</button>
${scatterHtml ? scatterHtml + '\n' : ''}    <div class="popup-content">
      <div class="popup-badge popup-badge--gold">Limited Time</div>
      <h2 class="popup-title">${config.title}</h2>
      <p class="popup-subtitle">${config.subtitle}</p>
      <div class="popup-hero">
        <img src="${config.heroImage}" alt="Hero">
      </div>
      <div class="popup-amounts">
${amountsWithDivider}
      </div>
      <button class="popup-cta">${config.cta.text}</button>${timerHtml}
    </div>
  </div>
</div>`;
    },

    css: `.popup--special-offer .popup-bg {
  background: linear-gradient(180deg, #3b1578 0%, #1a0a2e 60%, #0d051a 100%);
}

.popup--special-offer .popup-title {
  font-size: 28px;
  background: linear-gradient(180deg, #fff 0%, #e0d0ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.popup--special-offer .popup-cta {
  background: linear-gradient(180deg, #ffe14d 0%, #ffc800 100%);
}`
  },

  /* -------------------------------------------------------
     TEMPLATE 2: Free Coins V1
     ------------------------------------------------------- */
  {
    name: 'Free Coins V1',
    defaultConfig: {
      title: 'FREE COINS!',
      subtitle: 'Collect your daily bonus',
      heroImage: 'assets/images/coin-pile.svg',
      amounts: [
        { icon: 'assets/images/gc-coin.svg', value: '500,000', color: '#ffe14d' }
      ],
      cta: { text: 'Collect Now' }
    },

    render(config) {
      const amountsHtml = config.amounts.map(a => {
        const labelHtml = a.label
          ? `\n        <span class="popup-amount-label" style="color:${a.color}">${a.label}</span>`
          : '';
        return `      <div class="popup-amount">
        <img class="popup-amount-icon" src="${a.icon}" alt="">
        <span class="popup-amount-value" style="color:${a.color}">${a.value}</span>${labelHtml}
      </div>`;
      }).join('\n');

      return `<div class="popup-overlay">
  <div class="popup-container popup--free-coins-v1">
    <div class="popup-bg"></div>
    <button class="popup-close">&times;</button>
    <div class="popup-content">
      <h2 class="popup-title">${config.title}</h2>
      <p class="popup-subtitle">${config.subtitle}</p>
      <div class="popup-hero">
        <img src="${config.heroImage}" alt="Coins">
      </div>
      <div class="popup-amounts">
${amountsHtml}
      </div>
      <button class="popup-cta">${config.cta.text}</button>
    </div>
  </div>
</div>`;
    },

    css: `.popup--free-coins-v1 .popup-bg {
  background: linear-gradient(180deg, #0a2a4a 0%, #0d1b2a 100%);
}

.popup--free-coins-v1 .popup-title {
  color: #ffe14d;
  font-size: 32px;
}

.popup--free-coins-v1 .popup-cta {
  background: linear-gradient(180deg, #0fffb2 0%, #00d68f 100%);
  color: #0a2e1a;
}`
  },

  /* -------------------------------------------------------
     TEMPLATE 3: Free Coins V2
     ------------------------------------------------------- */
  {
    name: 'Free Coins V2',
    defaultConfig: {
      title: 'Claim Your Free Coins',
      subtitle: 'Daily Login Reward',
      heroImage: 'assets/images/treasure-chest.svg',
      amounts: [
        { icon: 'assets/images/gc-coin.svg', value: '2,000,000', color: '#ffe14d' },
        { icon: 'assets/images/sc-coin.svg', value: '10', color: '#0fffb2', label: 'FREE' }
      ],
      cta: { text: 'Claim Reward' }
    },

    render(config) {
      const amountsHtml = config.amounts.map(a => {
        const labelHtml = a.label
          ? `\n          <span class="popup-amount-label" style="color:${a.color}">${a.label}</span>`
          : '';
        return `        <div class="popup-amount">
          <img class="popup-amount-icon" src="${a.icon}" alt="">
          <span class="popup-amount-value" style="color:${a.color}">${a.value}</span>${labelHtml}
        </div>`;
      }).join('\n');

      return `<div class="popup-overlay">
  <div class="popup-container popup--free-coins-v2">
    <div class="popup-bg"></div>
    <button class="popup-close">&times;</button>
    <div class="popup-content">
      <h2 class="popup-title">${config.title}</h2>
      <p class="popup-subtitle">${config.subtitle}</p>
      <div class="popup-hero">
        <img src="${config.heroImage}" alt="Treasure">
      </div>
      <div class="popup-amounts">
${amountsHtml}
      </div>
      <button class="popup-cta">${config.cta.text}</button>
    </div>
  </div>
</div>`;
    },

    css: `.popup--free-coins-v2 .popup-bg {
  background: linear-gradient(180deg, #1e0540 0%, #12002b 80%, #0a0015 100%);
}

.popup--free-coins-v2 .popup-title {
  font-size: 24px;
  color: #ffffff;
}

.popup--free-coins-v2 .popup-subtitle {
  color: #0fffb2;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.popup--free-coins-v2 .popup-amounts {
  flex-direction: column;
  gap: 12px;
}

.popup--free-coins-v2 .popup-amount {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 20px;
  width: 100%;
  justify-content: flex-start;
}

.popup--free-coins-v2 .popup-cta {
  background: linear-gradient(180deg, #a855f7 0%, #7c3aed 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
}

.popup--free-coins-v2 .popup-cta:hover {
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
}`
  }
];
