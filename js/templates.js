/* ============================================================
   TEMPLATE REGISTRY
   Each template: { name, defaultConfig, render(config) }
   ============================================================ */

const CLOSE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
                <line x1="6" y1="6" x2="18" y2="18"></line>
                <line x1="18" y1="6" x2="6" y2="18"></line>
              </svg>`;

// eslint-disable-next-line no-unused-vars
const TEMPLATES = [

  /* -------------------------------------------------------
     TEMPLATE 1: Special Offer
     ------------------------------------------------------- */
  {
    name: 'Special Offer',
    defaultConfig: {
      title: 'Special Offer! 🎁',
      subtitle: 'SHOW UP DAILY - AND CLAIM YOUR REWARDS',
      heroImage: 'assets/images/roo-character.png',
      bgSvg: 'assets/images/offer-bg-wave.svg',
      scatterImages: {
        tl: 'assets/images/sc-coins-scatter1.png',
        mr: 'assets/images/sc-coins-scatter2.png',
        br: 'assets/images/roo-coins-scatter.png'
      },
      amounts: [
        { icon: 'assets/images/gc-coin.png', value: '1,000,000', type: 'gc' },
        { icon: 'assets/images/sc-coin.png', value: '40', type: 'sc', label: 'FOR\nFREE' }
      ],
      cta: { text: 'Buy for $24.99' }
    },

    render(config) {
      const amountsHtml = config.amounts.map((a, i) => {
        const colorClass = a.type === 'gc' ? 'popup-amount-value--gc' : 'popup-amount-value--sc';
        const labelHtml = a.label ? `\n                  <span class="popup-amount-label">${a.label}</span>` : '';
        const block = `                <div class="popup-amount">
                  <img class="popup-amount-icon" src="${a.icon}" alt="">
                  <span class="popup-amount-value ${colorClass}">${a.value}</span>${labelHtml}
                </div>`;
        return i < config.amounts.length - 1
          ? block + '\n                <span class="popup-amount-separator">+</span>'
          : block;
      }).join('\n');

      const scatter = config.scatterImages || {};

      return `<div class="popup-overlay active">
          <div class="popup-container popup-special-offer">
            <div class="popup-bg-svg">
              <img src="${config.bgSvg}" alt="">
            </div>
            <button class="popup-close" aria-label="Close">
              ${CLOSE_SVG}
            </button>
            <h2 class="popup-title">${config.title}</h2>
            <div class="popup-hero popup-hero--animated">
              <img class="popup-scatter scatter-tl" src="${scatter.tl}" alt="">
              <img class="popup-scatter scatter-mr" src="${scatter.mr}" alt="">
              <img class="popup-scatter scatter-br" src="${scatter.br}" alt="">
              <img class="popup-hero-main" src="${config.heroImage}" alt="">
            </div>
            <div class="popup-content">
              <p class="popup-subtitle">${config.subtitle}</p>
              <div class="popup-amounts">
${amountsHtml}
              </div>
              <button class="popup-cta">${config.cta.text}</button>
            </div>
          </div>
        </div>`;
    }
  },

  /* -------------------------------------------------------
     TEMPLATE 2: Free Coins V1
     ------------------------------------------------------- */
  {
    name: 'Free Coins V1',
    defaultConfig: {
      heroImage: 'assets/images/pot-of-gold.png',
      titleImage: 'assets/images/claim-title.png',
      subtitle: 'You have coins waiting for you!',
      currencies: [
        { icon: 'assets/images/sc-coin.png', value: '1', label: 'FOR FREE' }
      ],
      cta: { text: 'Claim Now' },
      claimCoinImage: 'assets/images/sc-coin.png'
    },

    render(config) {
      const currencyRows = (config.currencies || []).map(c => {
        const labelHtml = c.label ? `\n                  <span class="popup-currency-label">${c.label}</span>` : '';
        return `                <div class="popup-currency-row">
                  <img class="popup-currency-icon" src="${c.icon}" alt="">
                  <span class="popup-currency-value">${c.value}</span>${labelHtml}
                </div>`;
      }).join('\n');

      const titleHtml = config.titleImage
        ? `<img class="popup-title-image" src="${config.titleImage}" alt="CLAIM YOUR FREE COINS!">`
        : '';

      const coinImg = config.claimCoinImage || 'assets/images/sc-coin.png';

      return `<div class="popup-overlay active">
          <div class="popup-container popup-free-coins">
            <button class="popup-close" aria-label="Close">
              ${CLOSE_SVG}
            </button>
            <div class="popup-hero popup-hero--animated">
              <img src="${config.heroImage}" alt="">
            </div>
            ${titleHtml}
            <div class="popup-content">
              <p class="popup-subtitle">${config.subtitle}</p>
              <div class="popup-currencies">
${currencyRows}
              </div>
              <button class="popup-cta" id="cta-v1">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + -40px); animation-delay: 0s;">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + -15px); animation-delay: 0.07s;">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + 10px); animation-delay: 0.14s;">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + 35px); animation-delay: 0.21s;">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + -25px); animation-delay: 0.28s;">
                <span>${config.cta.text}</span>
              </button>
            </div>
          </div>
        </div>`;
    }
  },

  /* -------------------------------------------------------
     TEMPLATE 3: Free Coins V2 (Login Rewards)
     ------------------------------------------------------- */
  {
    name: 'Free Coins V2',
    defaultConfig: {
      title: 'LOGIN REWARDS',
      subtitle: 'SHOW UP DAILY - AND CLAIM YOUR REWARDS',
      heroImage: 'assets/images/gift-box.png',
      scatterImages: {
        tl: 'assets/images/sc-coins-scatter1.png',
        mr: 'assets/images/sc-coins-scatter2.png',
        tr: 'assets/images/roo-coins-scatter.png'
      },
      cta: { text: 'Claim 1 SC', icon: 'assets/images/sc-coin.png' },
      claimCoinImage: 'assets/images/sc-coin.png'
    },

    render(config) {
      const scatter = config.scatterImages || {};
      const ctaIcon = config.cta.icon
        ? `<img class="popup-cta-icon" src="${config.cta.icon}" alt="">`
        : '';
      const coinImg = config.claimCoinImage || 'assets/images/sc-coin.png';

      return `<div class="popup-overlay active">
          <div class="popup-container popup-free-coins-v2">
            <button class="popup-close" aria-label="Close">
              ${CLOSE_SVG}
            </button>
            <h2 class="popup-title">${config.title}</h2>
            <div class="popup-hero popup-hero--animated">
              <img class="popup-scatter scatter-tl" src="${scatter.tl}" alt="">
              <img class="popup-scatter scatter-mr" src="${scatter.mr}" alt="">
              <img class="popup-scatter scatter-tr" src="${scatter.tr}" alt="">
              <img class="popup-hero-main" src="${config.heroImage}" alt="">
            </div>
            <div class="popup-content">
              <p class="popup-subtitle">${config.subtitle}</p>
              <button class="popup-cta" id="cta-v2">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + -40px); animation-delay: 0s;">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + -15px); animation-delay: 0.07s;">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + 10px); animation-delay: 0.14s;">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + 35px); animation-delay: 0.21s;">
                <img class="popup-claim-coin" src="${coinImg}" alt="" style="--coin-x: calc(-50% + -25px); animation-delay: 0.28s;">
                ${ctaIcon}
                <span>${config.cta.text}</span>
              </button>
            </div>
          </div>
        </div>`;
    }
  }
];
