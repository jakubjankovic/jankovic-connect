/* Jakub Benjamin Jankovič — Digital Contact Hub
 * Static landing page logic: real contact links, clipboard, vCard, QR target.
 */

// === Profile / links ===
var PROFILE = {
  fullName: 'Jakub Benjamin Jankovič',
  firstName: 'Jakub Benjamin',
  lastName: 'Jankovič',
  phone: '+421 903 703 725',
  phoneDial: '+421903703725',
  email: 'jakubjankovic100@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jakub-benjamin-jankovi%C4%8D-b7929320b/',
  facebook: 'https://www.facebook.com/profile.php?id=100022833794468',
  title: 'Bankovníctvo • Networking • Vzťahy s klientmi',
};

// Public landing-page URL (what the QR / NFC tag / vCard website point to).
// Set this to your PERMANENT deployed URL (see DEPLOY.md). The QR encodes it.
var PUBLIC_CARD_URL = 'https://jakubjankovic.github.io/jankovic-connect/';

// Real Google Calendar Appointment Schedule booking page.
var BOOKING_LINK = 'https://calendar.app.google/hirwrfbkkEG6uXE16';

function $(id) {
  return document.getElementById(id);
}

function toast(message) {
  var el = $('toast');
  $('toastMsg').textContent = message;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(function () {
    el.classList.remove('show');
  }, 2000);
}

function flashSub(btn, subEl, label) {
  var original = subEl.textContent;
  btn.classList.add('is-success');
  subEl.textContent = label;
  setTimeout(function () {
    btn.classList.remove('is-success');
    subEl.textContent = original;
  }, 2000);
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise(function (resolve) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {}
    document.body.removeChild(ta);
    resolve();
  });
}

function buildVCard() {
  var lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:' + PROFILE.lastName + ';' + PROFILE.firstName + ';;;',
    'FN:' + PROFILE.fullName,
    'TITLE:' + PROFILE.title,
    'TEL;TYPE=CELL:' + PROFILE.phoneDial,
    'EMAIL;TYPE=WORK:' + PROFILE.email,
    'URL:' + PUBLIC_CARD_URL,
    'X-SOCIALPROFILE;TYPE=linkedin:' + PROFILE.linkedin,
    'X-SOCIALPROFILE;TYPE=facebook:' + PROFILE.facebook,
    'NOTE:LinkedIn: ' + PROFILE.linkedin + '\\nFacebook: ' + PROFILE.facebook,
    'END:VCARD',
  ];
  return lines.join('\r\n');
}

function downloadVCard() {
  var blob = new Blob([buildVCard()], {type: 'text/vcard;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'jakub-benjamin-jankovic-contact.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
  // Wire real links
  $('linkedin').href = PROFILE.linkedin;
  $('facebook').href = PROFILE.facebook;
  $('email').href = 'mailto:' + PROFILE.email;
  $('call').href = 'tel:' + PROFILE.phoneDial;
  $('booking').href = BOOKING_LINK;

  // Save Contact -> download .vcf
  $('saveContact').addEventListener('click', function () {
    downloadVCard();
    toast('Kontakt stiahnutý (.vcf)');
  });

  // Copy email -> clipboard
  $('copyEmail').addEventListener('click', function () {
    var btn = this;
    copyText(PROFILE.email).then(function () {
      flashSub(btn, $('copyEmailSub'), 'Email skopírovaný ✓');
      toast('Email skopírovaný');
    });
  });

  // Show the URL the QR encodes (helpful for verification)
  var qrUrlEl = $('qrUrl');
  if (qrUrlEl) {
    qrUrlEl.textContent = PUBLIC_CARD_URL;
  }
});
