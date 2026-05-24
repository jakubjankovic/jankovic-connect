/* Jakub Benjamin Jankovič — Digital Contact Hub
 * Links, personal/company chooser, WhatsApp, share, clipboard, vCard 3.0
 * (RFC-2426 line folding + escaping + photo), SK/EN/DE language toggle with
 * browser auto-detect, privacy-friendly event tracking, service worker,
 * accessibility (focus-visible, modal focus trap).
 */

var PROFILE = {
  fullName: 'Jakub Benjamin Jankovič',
  firstName: 'Jakub Benjamin',
  lastName: 'Jankovič',
  emailPersonal: 'jakubjankovic100@gmail.com',
  emailCompany: 'jankovic.jakub.benjamin@slsp.sk',
  phonePersonal: '+421 903 703 725',
  phonePersonalDial: '+421903703725',
  phonePersonalWa: '421903703725',
  phoneCompany: '+421 910 683 917',
  phoneCompanyDial: '+421910683917',
  phoneCompanyWa: '421910683917',
  linkedin: 'https://www.linkedin.com/in/jakub-benjamin-jankovi%C4%8D-b7929320b/',
  facebook: 'https://www.facebook.com/profile.php?id=100022833794468',
};

var PUBLIC_CARD_URL = 'https://jakubjankovic.github.io/jankovic-connect/';
var BOOKING_LINK = 'https://calendar.app.google/hirwrfbkkEG6uXE16';
var PHOTO_WEBP = 'portrait-600.webp?v=8';
var PHOTO_JPG = 'portrait-600.jpg?v=8';

// Anonymous, cookieless stats (GoatCounter). Set to '' to disable.
// Create the free account at goatcounter.com and claim this exact code.
var GOATCOUNTER = 'https://jankovic-connect.goatcounter.com/count';

var TR = {
  sk: {
    role: 'Bankovníctvo • Networking • Vzťahy s klientmi',
    org: 'Digitálna vizitka',
    location: 'Bratislava, Slovensko',
    intro:
      'Prepájam ľudí, budujem profesionálne vzťahy a vediem zmysluplné rozhovory o kariére, financiách, príležitostiach a osobnom raste.',
    save: 'Uložiť kontakt',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    email: 'Napísať e-mail',
    copy: 'Kopírovať e-mail',
    call: 'Zavolať',
    facebook: 'Facebook',
    book: 'Rezervovať termín',
    share: 'Zdieľať vizitku',
    tagline: 'Spojme sa. Vytvorme hodnotu.',
    qr: 'Oskenujte pre spojenie',
    qr_alt: 'QR kód na túto digitálnu vizitku',
    disclaimer:
      'Toto je osobná digitálna vizitka. Nejde o oficiálnu stránku banky ani o individuálne finančné poradenstvo.',
    footer: 'Prajem Vám veľa úspechov',
    personal: 'Osobný',
    company: 'Firemný',
    close: 'Zavrieť',
    ch_email: 'Napísať e-mail',
    ch_copy: 'Kopírovať e-mail',
    ch_call: 'Zavolať',
    ch_whatsapp: 'WhatsApp',
    t_contact: 'Kontakt stiahnutý',
    t_copied_p: 'Osobný e-mail skopírovaný',
    t_copied_c: 'Firemný e-mail skopírovaný',
    t_shared: 'Odkaz skopírovaný',
  },
  en: {
    role: 'Banking • Networking • Client Relationships',
    org: 'Digital business card',
    location: 'Bratislava, Slovakia',
    intro:
      'I connect people, build professional relationships and have meaningful conversations about careers, finance, opportunities and personal growth.',
    save: 'Save contact',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    email: 'Send email',
    copy: 'Copy email',
    call: 'Call',
    facebook: 'Facebook',
    book: 'Book a meeting',
    share: 'Share card',
    tagline: "Let's connect. Let's create value.",
    qr: 'Scan to connect',
    qr_alt: 'QR code for this digital business card',
    disclaimer:
      'This is a personal digital business card. It is not an official bank website or individual financial advice.',
    footer: 'Wishing you great success',
    personal: 'Personal',
    company: 'Company',
    close: 'Close',
    ch_email: 'Send email',
    ch_copy: 'Copy email',
    ch_call: 'Call',
    ch_whatsapp: 'WhatsApp',
    t_contact: 'Contact downloaded',
    t_copied_p: 'Personal email copied',
    t_copied_c: 'Company email copied',
    t_shared: 'Link copied',
  },
  de: {
    role: 'Bankwesen • Networking • Kundenbeziehungen',
    org: 'Digitale Visitenkarte',
    location: 'Bratislava, Slowakei',
    intro:
      'Ich verbinde Menschen, baue berufliche Beziehungen auf und führe sinnvolle Gespräche über Karriere, Finanzen, Chancen und persönliche Entwicklung.',
    save: 'Kontakt speichern',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    email: 'E-Mail schreiben',
    copy: 'E-Mail kopieren',
    call: 'Anrufen',
    facebook: 'Facebook',
    book: 'Termin buchen',
    share: 'Visitenkarte teilen',
    tagline: 'Verbinden wir uns. Schaffen wir Wert.',
    qr: 'Zum Verbinden scannen',
    qr_alt: 'QR-Code für diese digitale Visitenkarte',
    disclaimer:
      'Dies ist eine persönliche digitale Visitenkarte. Es handelt sich nicht um eine offizielle Bank-Website oder um individuelle Finanzberatung.',
    footer: 'Ich wünsche Ihnen viel Erfolg',
    personal: 'Privat',
    company: 'Geschäftlich',
    close: 'Schließen',
    ch_email: 'E-Mail schreiben',
    ch_copy: 'E-Mail kopieren',
    ch_call: 'Anrufen',
    ch_whatsapp: 'WhatsApp',
    t_contact: 'Kontakt heruntergeladen',
    t_copied_p: 'Private E-Mail kopiert',
    t_copied_c: 'Geschäftliche E-Mail kopiert',
    t_shared: 'Link kopiert',
  },
};

// Language cycle order for the single toggle button
var NEXT_LANG = {sk: 'en', en: 'de', de: 'sk'};

// Compact SVG flags for the language toggle
var FLAG_UK =
  '<svg class="flag" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<clipPath id="ukc"><rect width="60" height="30"/></clipPath>' +
  '<clipPath id="ukt"><path d="M30,15 60,0 60,15ZM30,15 60,30 30,30ZM30,15 0,30 0,15ZM30,15 0,0 30,0Z"/></clipPath>' +
  '<g clip-path="url(#ukc)">' +
  '<rect width="60" height="30" fill="#012169"/>' +
  '<path d="M0,0 60,30M60,0 0,30" stroke="#fff" stroke-width="6"/>' +
  '<path d="M0,0 60,30M60,0 0,30" clip-path="url(#ukt)" stroke="#C8102E" stroke-width="4"/>' +
  '<path d="M30,0V30M0,15H60" stroke="#fff" stroke-width="10"/>' +
  '<path d="M30,0V30M0,15H60" stroke="#C8102E" stroke-width="6"/>' +
  '</g></svg>';

var FLAG_SK =
  '<svg class="flag" viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<rect width="90" height="60" fill="#ee1c25"/>' +
  '<rect width="90" height="40" fill="#0b4ea2"/>' +
  '<rect width="90" height="20" fill="#fff"/>' +
  '<path d="M13,12h24v22c0,9-12,13-12,13s-12-4-12-13z" fill="#fff"/>' +
  '<path d="M16,15h18v19c0,7-9,10-9,10s-9-3-9-10z" fill="#ee1c25"/>' +
  '<g fill="#fff"><rect x="23.5" y="18" width="3" height="22"/><rect x="18.5" y="22.5" width="13" height="3"/><rect x="20.5" y="28" width="9" height="3"/></g>' +
  '<path d="M16,38c3-3,6-3,9,0c3-3,6-3,9,0v6h-18z" fill="#0b4ea2"/>' +
  '</svg>';

var FLAG_DE =
  '<svg class="flag" viewBox="0 0 5 3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<rect width="5" height="3" fill="#000"/>' +
  '<rect y="1" width="5" height="2" fill="#D00"/>' +
  '<rect y="2" width="5" height="1" fill="#FFCE00"/>' +
  '</svg>';

var FLAGS = {en: FLAG_UK, de: FLAG_DE, sk: FLAG_SK};
var FLAG_CODE = {en: 'EN', de: 'DE', sk: 'SK'};
var TOGGLE_ARIA = {
  en: 'Switch to English',
  de: 'Auf Deutsch umschalten',
  sk: 'Prepnúť do slovenčiny',
};

var lang = 'sk';
var inApp = !!window.ReactNativeWebView;

function $(id) {
  return document.getElementById(id);
}
function t(key) {
  return (TR[lang] && TR[lang][key]) || key;
}

/* ---- Privacy-friendly, cookieless event tracking (no-op if not enabled) ---- */
function track(event) {
  try {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({path: 'event-' + event, title: event, event: true});
    }
    if (typeof window.plausible === 'function') {
      window.plausible(event);
    }
  } catch (e) {}
}

function translate(next) {
  lang = next;
  document.documentElement.lang = next;
  try {
    localStorage.setItem('jbj_lang', next);
  } catch (e) {}
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (TR[next] && TR[next][k] != null) {
      el.textContent = TR[next][k];
    }
  });
  // Translate the QR image's alt text (accessibility)
  var qi = $('qrImg');
  if (qi && t('qr_alt')) {
    qi.alt = t('qr_alt');
  }
  // Toggle shows the flag + code of the NEXT language in the cycle
  var upcoming = NEXT_LANG[next];
  var tg = $('langToggle');
  if (tg) {
    tg.innerHTML = FLAGS[upcoming] + '<span>' + FLAG_CODE[upcoming] + '</span>';
    tg.setAttribute('aria-label', TOGGLE_ARIA[upcoming]);
  }
}

function detectLang() {
  try {
    var saved = localStorage.getItem('jbj_lang');
    if (saved && TR[saved]) return saved;
  } catch (e) {}
  var nav = (navigator.language || navigator.userLanguage || 'sk').toLowerCase();
  if (nav.indexOf('sk') === 0 || nav.indexOf('cs') === 0) return 'sk';
  if (nav.indexOf('de') === 0) return 'de';
  return 'en';
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

// Open external URL, falling back to same-tab navigation if a popup is blocked.
// NOTE: passing 'noopener' in the features string makes window.open return null
// even on success, which would wrongly trigger the fallback. So we omit it and
// null the opener manually; fall back to same-tab nav only if truly blocked.
function openExternal(url) {
  var w = window.open(url, '_blank');
  if (w) {
    try {
      w.opener = null;
    } catch (e) {}
  } else {
    location.href = url;
  }
}

/* ---- Personal / company chooser (email / copy / call / whatsapp) ---- */
var chooserTrigger = null;

function closeChooser() {
  $('chooser').classList.remove('show');
  if (chooserTrigger && chooserTrigger.focus) {
    chooserTrigger.focus();
  }
  chooserTrigger = null;
}

function openChooser(type, trigger) {
  chooserTrigger = trigger || document.activeElement;
  var titles = {email: 'ch_email', copy: 'ch_copy', call: 'ch_call', whatsapp: 'ch_whatsapp'};
  $('chooserTitle').textContent = t(titles[type]);
  $('optPersonalLabel').textContent = t('personal');
  $('optCompanyLabel').textContent = t('company');
  $('chooserClose').textContent = t('close');

  var isPhone = type === 'call' || type === 'whatsapp';
  $('optPersonalVal').textContent = isPhone ? PROFILE.phonePersonal : PROFILE.emailPersonal;
  $('optCompanyVal').textContent = isPhone ? PROFILE.phoneCompany : PROFILE.emailCompany;

  $('optPersonal').onclick = function () {
    closeChooser();
    doAction(type, true);
  };
  $('optCompany').onclick = function () {
    closeChooser();
    doAction(type, false);
  };

  $('chooser').classList.add('show');
  $('optPersonal').focus();
}

function doAction(type, personal) {
  if (type === 'email') {
    location.href = 'mailto:' + (personal ? PROFILE.emailPersonal : PROFILE.emailCompany);
  } else if (type === 'copy') {
    copyText(personal ? PROFILE.emailPersonal : PROFILE.emailCompany).then(function () {
      toast(personal ? t('t_copied_p') : t('t_copied_c'));
    });
  } else if (type === 'call') {
    location.href = 'tel:' + (personal ? PROFILE.phonePersonalDial : PROFILE.phoneCompanyDial);
  } else if (type === 'whatsapp') {
    openExternal('https://wa.me/' + (personal ? PROFILE.phonePersonalWa : PROFILE.phoneCompanyWa));
  }
  track(type + '-' + (personal ? 'personal' : 'company'));
}

/* ---- Share ---- */
function shareCard() {
  track('share');
  if (navigator.share) {
    navigator
      .share({title: PROFILE.fullName, text: t('role'), url: PUBLIC_CARD_URL})
      .catch(function () {});
  } else {
    copyText(PUBLIC_CARD_URL).then(function () {
      toast(t('t_shared'));
    });
  }
}

/* ---- vCard (RFC 2426: escape text values, fold lines at 75 octets) ---- */
var photoB64 = null;
function preloadPhoto() {
  function load(src, fallback) {
    var img = new Image();
    img.onload = function () {
      try {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        photoB64 = c.toDataURL('image/jpeg', 0.85).split(',')[1] || null;
      } catch (e) {
        photoB64 = null;
      }
    };
    img.onerror = function () {
      if (fallback) load(fallback, null);
    };
    img.src = src;
  }
  // Prefer WebP (smaller, shared with the avatar); fall back to JPEG on old browsers.
  try {
    load(PHOTO_WEBP, PHOTO_JPG);
  } catch (e) {
    photoB64 = null;
  }
}

function vEsc(v) {
  return String(v)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

// Fold a single logical line to 75-octet physical lines (continuation = CRLF + SPACE).
function foldLine(line) {
  if (line.length <= 75) return line;
  var out = line.substring(0, 75);
  var rest = line.substring(75);
  while (rest.length > 74) {
    out += '\r\n ' + rest.substring(0, 74);
    rest = rest.substring(74);
  }
  out += '\r\n ' + rest;
  return out;
}

function buildVCard() {
  var rev = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  var lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:' + vEsc(PROFILE.lastName) + ';' + vEsc(PROFILE.firstName) + ';;;',
    'FN:' + vEsc(PROFILE.fullName),
    'TEL;TYPE=CELL:' + PROFILE.phonePersonalDial,
    'TEL;TYPE=WORK:' + PROFILE.phoneCompanyDial,
    'EMAIL;TYPE=HOME:' + PROFILE.emailPersonal,
    'EMAIL;TYPE=WORK:' + PROFILE.emailCompany,
    'URL:' + PUBLIC_CARD_URL,
    'X-SOCIALPROFILE;TYPE=linkedin:' + PROFILE.linkedin,
    'X-SOCIALPROFILE;TYPE=facebook:' + PROFILE.facebook,
    'REV:' + rev,
  ];
  if (photoB64) {
    lines.push('PHOTO;ENCODING=b;TYPE=JPEG:' + photoB64);
  }
  lines.push('END:VCARD');
  return lines.map(foldLine).join('\r\n');
}

function downloadVCard(vcard) {
  var blob = new Blob([vcard || buildVCard()], {type: 'text/vcard;charset=utf-8'});
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

function saveContact() {
  track('save-contact');
  if (inApp) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({type: 'saveContact', vcard: buildVCard()}),
    );
    return;
  }
  var vcard = buildVCard();
  // Best path on mobile — incl. iOS Safari and in-app browsers (WhatsApp/IG/FB)
  // where a blob <a download> silently fails: open the native share sheet with
  // the .vcf file so the user can "Save to Contacts/Files".
  try {
    if (navigator.canShare) {
      var file = new File([vcard], 'jakub-benjamin-jankovic.vcf', {type: 'text/vcard'});
      if (navigator.canShare({files: [file]})) {
        navigator
          .share({files: [file], title: PROFILE.fullName})
          .catch(function (err) {
            // User cancelled -> do nothing. Real failure -> fall back to download.
            if (err && err.name !== 'AbortError') {
              downloadVCard(vcard);
              toast(t('t_contact'));
            }
          });
        return;
      }
    }
  } catch (e) {}
  // Fallback: direct file download (desktop, Android Chrome).
  downloadVCard(vcard);
  toast(t('t_contact'));
}

/* ---- Accessibility: trap Tab focus inside the open modal ---- */
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  var modal = $('chooser');
  if (!modal.classList.contains('show')) return;
  var f = [$('optPersonal'), $('optCompany'), $('chooserClose')];
  var first = f[0];
  var last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (inApp) {
    document.body.classList.add('in-app');
  }

  // Make web fonts non-render-blocking: flip the print-media stylesheet to all.
  var gf = $('gfonts');
  if (gf) gf.media = 'all';

  preloadPhoto();

  // Language: saved choice or browser auto-detect (SK / DE / EN)
  translate(detectLang());

  $('linkedin').href = PROFILE.linkedin;
  $('facebook').href = PROFILE.facebook;
  $('booking').href = BOOKING_LINK;

  $('langToggle').addEventListener('click', function () {
    var next = NEXT_LANG[lang] || 'sk';
    translate(next);
    track('lang-' + next);
  });
  $('saveContact').addEventListener('click', saveContact);
  $('booking').addEventListener('click', function () {
    track('book');
  });
  $('email').addEventListener('click', function () {
    openChooser('email', this);
  });
  $('copyEmail').addEventListener('click', function () {
    openChooser('copy', this);
  });
  $('call').addEventListener('click', function () {
    openChooser('call', this);
  });
  $('whatsapp').addEventListener('click', function () {
    // Native <a href="wa.me…"> navigates on its own (robust in in-app browsers);
    // only the personal number has WhatsApp. Just record the event.
    track('whatsapp-personal');
  });
  $('share').addEventListener('click', shareCard);
  $('chooserClose').addEventListener('click', closeChooser);
  $('chooser').addEventListener('click', function (e) {
    if (e.target === this) {
      closeChooser();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeChooser();
    } else {
      trapFocus(e);
    }
  });

  // Deep links / app shortcuts: ?go=book → booking, ?go=save → save contact.
  try {
    var go = new URLSearchParams(location.search).get('go');
    if (go === 'book') {
      track('shortcut-book');
      location.href = BOOKING_LINK;
    } else if (go === 'save') {
      track('shortcut-save');
      // Give the photo a moment to decode so the vCard includes it.
      setTimeout(saveContact, 600);
    }
  } catch (e) {}

  // Anonymous stats for PUBLIC visitors only (never counts the owner's own app).
  if (!inApp && GOATCOUNTER) {
    var gc = document.createElement('script');
    gc.async = true;
    gc.setAttribute('data-goatcounter', GOATCOUNTER);
    gc.src = 'https://gc.zgo.at/count.js';
    document.body.appendChild(gc);
  }

  // Progressive enhancement: register service worker for instant repeat loads
  // and offline support (skipped inside the native app WebView).
  if (!inApp && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
});
