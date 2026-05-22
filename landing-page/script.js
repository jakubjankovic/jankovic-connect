/* Jakub Benjamin Jankovič — Digital Contact Hub
 * Real links, personal/company chooser, clipboard, contact save.
 * Inside the native app (WebView) "Save contact" opens the native Android
 * contact screen; in a browser it downloads a .vcf.
 */

var PROFILE = {
  fullName: 'Jakub Benjamin Jankovič',
  firstName: 'Jakub Benjamin',
  lastName: 'Jankovič',
  emailPersonal: 'jakubjankovic100@gmail.com',
  emailCompany: 'jankovic.jakub.benjamin@slsp.sk',
  phonePersonal: '+421 903 703 725',
  phonePersonalDial: '+421903703725',
  phoneCompany: '+421 910 683 917',
  phoneCompanyDial: '+421910683917',
  linkedin: 'https://www.linkedin.com/in/jakub-benjamin-jankovi%C4%8D-b7929320b/',
  facebook: 'https://www.facebook.com/profile.php?id=100022833794468',
  title: 'Bankovníctvo • Networking • Vzťahy s klientmi',
};

var PUBLIC_CARD_URL = 'https://jakubjankovic.github.io/jankovic-connect/';
var BOOKING_LINK = 'https://calendar.app.google/hirwrfbkkEG6uXE16';

function $(id) {
  return document.getElementById(id);
}

var inApp = !!window.ReactNativeWebView;

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

/* ---- Personal / company chooser ---- */
function openChooser(type) {
  var titleEl = $('chooserTitle');
  var pVal = $('optPersonalVal');
  var cVal = $('optCompanyVal');
  var pBtn = $('optPersonal');
  var cBtn = $('optCompany');

  function close() {
    $('chooser').classList.remove('show');
  }

  if (type === 'email' || type === 'copy') {
    titleEl.textContent = type === 'email' ? 'Napísať e-mail' : 'Kopírovať e-mail';
    pVal.textContent = PROFILE.emailPersonal;
    cVal.textContent = PROFILE.emailCompany;
    pBtn.onclick = function () {
      close();
      if (type === 'email') {
        location.href = 'mailto:' + PROFILE.emailPersonal;
      } else {
        copyText(PROFILE.emailPersonal).then(function () {
          toast('Osobný e-mail skopírovaný');
        });
      }
    };
    cBtn.onclick = function () {
      close();
      if (type === 'email') {
        location.href = 'mailto:' + PROFILE.emailCompany;
      } else {
        copyText(PROFILE.emailCompany).then(function () {
          toast('Firemný e-mail skopírovaný');
        });
      }
    };
  } else if (type === 'call') {
    titleEl.textContent = 'Zavolať';
    pVal.textContent = PROFILE.phonePersonal;
    cVal.textContent = PROFILE.phoneCompany;
    pBtn.onclick = function () {
      close();
      location.href = 'tel:' + PROFILE.phonePersonalDial;
    };
    cBtn.onclick = function () {
      close();
      location.href = 'tel:' + PROFILE.phoneCompanyDial;
    };
  }
  $('chooser').classList.add('show');
}

/* ---- Save contact ---- */
function buildVCard() {
  var lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:' + PROFILE.lastName + ';' + PROFILE.firstName + ';;;',
    'FN:' + PROFILE.fullName,
    'TITLE:' + PROFILE.title,
    'TEL;TYPE=CELL:' + PROFILE.phonePersonalDial,
    'TEL;TYPE=WORK:' + PROFILE.phoneCompanyDial,
    'EMAIL;TYPE=HOME:' + PROFILE.emailPersonal,
    'EMAIL;TYPE=WORK:' + PROFILE.emailCompany,
    'URL:' + PUBLIC_CARD_URL,
    'X-SOCIALPROFILE;TYPE=linkedin:' + PROFILE.linkedin,
    'X-SOCIALPROFILE;TYPE=facebook:' + PROFILE.facebook,
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

function saveContact() {
  if (inApp) {
    // Native app: ask it to open the Android "add contact" screen.
    window.ReactNativeWebView.postMessage(JSON.stringify({type: 'saveContact'}));
    return;
  }
  downloadVCard();
  toast('Kontakt stiahnutý');
}

document.addEventListener('DOMContentLoaded', function () {
  $('linkedin').href = PROFILE.linkedin;
  $('facebook').href = PROFILE.facebook;
  $('booking').href = BOOKING_LINK;

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
  $('chooserClose').addEventListener('click', function () {
    $('chooser').classList.remove('show');
  });
  $('chooser').addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.remove('show');
    }
  });
});
