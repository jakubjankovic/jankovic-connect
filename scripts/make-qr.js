/* Generate landing-page/qr.svg encoding the given URL.
 * Usage: node scripts/make-qr.js "https://your-permanent-url"
 * Requires the 'qrcode' package (npm install qrcode  — dev/build only).
 */
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const url = process.argv[2];
if (!url || /PLACEHOLDER/.test(url) || !/^https?:\/\//.test(url)) {
  console.error(
    'Provide a real absolute URL, e.g.\n  node scripts/make-qr.js "https://you.github.io/jankovic-connect/"',
  );
  process.exit(1);
}

const out = path.resolve(__dirname, '..', 'landing-page', 'qr.svg');

QRCode.toString(
  url,
  {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {dark: '#0a0908ff', light: '#fffdf6ff'},
  },
  (err, svg) => {
    if (err) {
      console.error('QR generation failed:', err.message);
      process.exit(1);
    }
    fs.writeFileSync(out, svg);
    console.log('Wrote ' + out + ' (' + svg.length + ' bytes) -> ' + url);
  },
);
