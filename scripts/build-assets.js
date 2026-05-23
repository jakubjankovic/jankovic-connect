/* Regenerate the landing page's brand images from the master photo.
 * Outputs into landing-page/:
 *   - favicon-32.png            (favicon)
 *   - apple-touch-icon-180.png  (iOS home-screen icon)
 *   - og-banner.jpg (1200x630)  (link preview for WhatsApp / LinkedIn / X …)
 *
 * Sources: landing-page/icon-512.png (square face crop) and
 *          landing-page/portrait-600.jpg (square head-centered headshot).
 *
 * Usage:  npm install sharp   (build/dev only)
 *         node scripts/build-assets.js
 *
 * Note: the QR code is generated separately — see scripts/make-qr.js.
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const LP = path.resolve(__dirname, '..', 'landing-page');
const p = (f) => path.join(LP, f);

async function favicons() {
  await sharp(p('icon-512.png')).resize(32, 32).png().toFile(p('favicon-32.png'));
  await sharp(p('icon-512.png')).resize(180, 180).png().toFile(p('apple-touch-icon-180.png'));
}

async function ogBanner() {
  const W = 1200, H = 630;
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="bgg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#070504"/><stop offset="0.5" stop-color="#100c08"/><stop offset="1" stop-color="#050403"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.23" cy="0.5" r="0.55">
        <stop offset="0" stop-color="#3c2d12" stop-opacity="0.6"/><stop offset="1" stop-color="#3c2d12" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bgg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
  </svg>`;
  const base = await sharp(Buffer.from(bg)).png().toBuffer();

  const D = 400, cx = 270, cy = 315, left = cx - D / 2, top = cy - D / 2;
  const photo = await sharp(p('portrait-600.jpg')).resize(D, D).png().toBuffer();
  const circleMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${D}" height="${D}"><circle cx="${D / 2}" cy="${D / 2}" r="${D / 2}" fill="#fff"/></svg>`);
  const photoCircle = await sharp(photo).composite([{ input: circleMask, blend: 'dest-in' }]).png().toBuffer();

  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#c4922f"/><stop offset="0.4" stop-color="#f3d588"/><stop offset="0.6" stop-color="#fbeab4"/><stop offset="1" stop-color="#c4922f"/>
      </linearGradient>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${D / 2 + 6}" fill="none" stroke="url(#gold)" stroke-width="8"/>
    <text x="525" y="258" font-family="Playfair Display, Georgia, serif" font-size="66" font-weight="600" fill="#f8e7b2">Jakub Benjamin</text>
    <text x="525" y="332" font-family="Playfair Display, Georgia, serif" font-size="66" font-weight="600" fill="#f8e7b2">Jankovič</text>
    <rect x="527" y="364" width="300" height="3" rx="1.5" fill="url(#gold)"/>
    <text x="525" y="418" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="26" fill="#e8c97a">Bankovníctvo • Networking • Vzťahy s klientmi</text>
    <text x="527" y="466" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="17" letter-spacing="4" fill="#c4922f">DIGITÁLNA VIZITKA</text>
  </svg>`;

  await sharp(base)
    .composite([
      { input: photoCircle, top, left },
      { input: Buffer.from(overlay), top: 0, left: 0 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(p('og-banner.jpg'));
}

(async () => {
  await favicons();
  await ogBanner();
  const b = await sharp(p('og-banner.jpg')).metadata();
  console.log('favicon-32.png, apple-touch-icon-180.png, og-banner.jpg (' + b.width + 'x' + b.height + ', ' + fs.statSync(p('og-banner.jpg')).size + 'B)');
})().catch((e) => { console.error(e); process.exit(1); });
