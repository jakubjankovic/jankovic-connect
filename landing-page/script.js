/* Jakub Benjamin Jankovič — Digital Contact Hub
 * Links, personal/company chooser, WhatsApp, share, clipboard, vCard (with
 * photo, no title), SK/EN language toggle, accessibility.
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

var TR = {
  sk: {
    toggle: 'EN',
    role: 'Bankovníctvo • Networking • Vzťahy s klientmi',
    org: 'Digitálna vizitka',
    location: 'Bratislava, Slovensko',
    intro:
      'Rád prepájam ľudí, budujem profesionálne vzťahy a vediem zmysluplné rozhovory o kariére, financiách, príležitostiach a osobnom raste.',
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
    toggle: 'SK',
    role: 'Banking • Networking • Client Relationships',
    org: 'Digital business card',
    location: 'Bratislava, Slovakia',
    intro:
      'I love connecting people, building professional relationships and having meaningful conversations about careers, finance, opportunities and personal growth.',
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
};

var lang = 'sk';
var inApp = !!window.ReactNativeWebView;

function $(id) {
  return document.getElementById(id);
}
function t(key) {
  return (TR[lang] && TR[lang][key]) || key;
}

function translate(next) {
  lang = next;
  document.documentElement.lang = next;
  try {
    localStorage.setItem('jbj_lang', next);
  } catch (e) {}
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (TR[next][k] != null) {
      el.textContent = TR[next][k];
    }
  });
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

function flashSuccess(btn) {
  btn.classList.add('is-success');
  setTimeout(function () {
    btn.classList.remove('is-success');
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

/* ---- Personal / company chooser (email / copy / call / whatsapp) ---- */
function closeChooser() {
  $('chooser').classList.remove('show');
}

function openChooser(type) {
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
    window.open('https://wa.me/' + (personal ? PROFILE.phonePersonalWa : PROFILE.phoneCompanyWa), '_blank');
  }
}

/* ---- Share ---- */
function shareCard() {
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

/* ---- Save contact ---- */
var photoB64 = null;
function preloadPhoto() {
  try {
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
    img.src = 'portrait-600.jpg';
  } catch (e) {
    photoB64 = null;
  }
}

function buildVCard() {
  var lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:' + PROFILE.lastName + ';' + PROFILE.firstName + ';;;',
    'FN:' + PROFILE.fullName,
    'TEL;TYPE=CELL:' + PROFILE.phonePersonalDial,
    'TEL;TYPE=WORK:' + PROFILE.phoneCompanyDial,
    'EMAIL;TYPE=HOME:' + PROFILE.emailPersonal,
    'EMAIL;TYPE=WORK:' + PROFILE.emailCompany,
    'URL:' + PUBLIC_CARD_URL,
    'X-SOCIALPROFILE;TYPE=linkedin:' + PROFILE.linkedin,
    'X-SOCIALPROFILE;TYPE=facebook:' + PROFILE.facebook,
  ];
  if (photoB64) {
    lines.push('PHOTO;ENCODING=b;TYPE=JPEG:' + photoB64);
  }
  lines.push('END:VCARD');
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

function saveContact() {
  if (inApp) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({type: 'saveContact', vcard: buildVCard()}),
    );
    return;
  }
  downloadVCard();
  toast(t('t_contact'));
}

document.addEventListener('DOMContentLoaded', function () {
  if (inApp) {
    document.body.classList.add('in-app');
  }
  preloadPhoto();

  // Apply saved language
  var saved = 'sk';
  try {
    saved = localStorage.getItem('jbj_lang') || 'sk';
  } catch (e) {}
  translate(saved === 'en' ? 'en' : 'sk');

  $('linkedin').href = PROFILE.linkedin;
  $('facebook').href = PROFILE.facebook;
  $('booking').href = BOOKING_LINK;

  $('langToggle').addEventListener('click', function () {
    translate(lang === 'sk' ? 'en' : 'sk');
  });
  $('saveContact').addEventListener('click', saveContact);
  $('email').addEventListener('click', function () {
    openChooser('email');
  });
  $('copyEmail').addEventListener('click', function () {
    openChooser('copy');
  });
  $('call').addEventListener('click', function () {
    openChooser('call');
  });
  $('whatsapp').addEventListener('click', function () {
    // Only the personal number has WhatsApp -> open it directly (no chooser).
    window.open('https://wa.me/' + PROFILE.phonePersonalWa, '_blank');
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
    }
  });
});
