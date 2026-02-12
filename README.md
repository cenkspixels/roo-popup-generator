# Roo Popup Generator

A visual editor for creating and customizing casino-style popup components. Edit JSON configs, see a live preview, and copy production-ready HTML + CSS with one click.

**No build tools required** — works directly on GitHub Pages.

---

## Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-org>/roo-popup.git
   cd roo-popup
   ```

2. Open `index.html` in your browser (or use a local server):
   ```bash
   npx serve .
   ```

3. That's it — start editing!

## How It Works

| Area | Description |
|------|-------------|
| **Template selector** | Pick from existing popup designs (Special Offer, Free Coins V1, Free Coins V2, …) |
| **Live preview** | Instantly renders the popup as you edit the JSON config |
| **JSON config editor** | Adjust titles, images, amounts, CTA text, colors, and more |
| **Code output** | Clean, copy-ready HTML + CSS — no editor artifacts |
| **Copy All** | One click copies the full HTML + embedded `<style>` block |

## Project Structure

```
roo-popup/
  index.html              – editor / generator page
  css/
    editor.css            – editor UI styles (dark theme)
    popup.css             – all popup component styles (tokens + variants)
  js/
    app.js                – main app: wires editor, preview, code output
    templates.js          – template registry (HTML templates + default configs)
  assets/
    images/               – shared popup images (coins, characters, backgrounds)
  README.md               – this file
```

## Adding a New Popup Template

1. Add your images to `assets/images/`
2. Open `js/templates.js` and add a new object to the `TEMPLATES` array:

```js
{
  name: 'My New Popup',
  defaultConfig: {
    title: '...',
    subtitle: '...',
    heroImage: 'assets/images/my-hero.png',
    amounts: [
      { icon: 'assets/images/gc-coin.png', value: '1,000', color: '#ffe14d' }
    ],
    cta: { text: 'Click Me' }
  },
  render(config) {
    return `<div class="popup-overlay">...</div>`;
  },
  css: `.popup--my-new .popup-bg { ... }`
}
```

3. The new template automatically appears in the dropdown selector.

## Adding Popups from Figma

1. Share a Figma URL
2. Use the Figma MCP to fetch the design (screenshot + code context)
3. Download new assets to `assets/images/`
4. Add a new template entry in `js/templates.js`
5. It immediately appears in the template selector

## Deployment

Push to GitHub and enable **GitHub Pages** (Settings → Pages → Source: main branch, root folder). The site is live at `https://<your-org>.github.io/roo-popup/`.

## Tech Stack

- **Vanilla HTML / CSS / JS** — zero dependencies, no build step
- **Prism.js** (CDN) — syntax highlighting for code output
- **Inter + Fira Code** (Google Fonts) — typography

## License

MIT
