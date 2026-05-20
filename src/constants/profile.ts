/**
 * Central profile + configuration.
 *
 * Replace the two placeholders below with your real values:
 *   PUBLIC_CARD_URL  -> the public landing page URL (where the QR / NFC tag point)
 *   BOOKING_LINK     -> your Google Calendar Appointment Schedule booking link
 *
 * See README.md sections 9, 10 and 11 for how to obtain these.
 */

// === REPLACE THESE TWO VALUES ===
export const PUBLIC_CARD_URL = 'https://jakubjankovic.github.io/jankovic-connect/';
export const BOOKING_LINK = 'https://calendar.app.google/hirwrfbkkEG6uXE16';
// =================================

export const PROFILE = {
  fullName: 'Jakub Benjamin Jankovič',
  shortName: 'JBJ Connect',
  headline: 'Bankovníctvo • Networking • Vzťahy s klientmi',
  phone: '+421 903 703 725',
  phoneDial: '+421903703725',
  email: 'jakubjankovic100@gmail.com',
  linkedin:
    'https://www.linkedin.com/in/jakub-benjamin-jankovi%C4%8D-b7929320b/',
  facebook: 'https://www.facebook.com/profile.php?id=100022833794468',
  website: PUBLIC_CARD_URL,
  shortIntro:
    'Prepájam ľudí, budujem dôveru a vytváram priestor pre zmysluplné profesionálne rozhovory.',
  longIntro:
    'Rád prepájam ľudí, budujem profesionálne vzťahy a vediem zmysluplné rozhovory o kariére, financiách, príležitostiach a osobnom raste.',
};

export const TEXTS = {
  disclaimer:
    'Toto je osobná digitálna vizitka. Nejde o oficiálnu stránku banky ani o individuálne finančné poradenstvo.',
  shareHelper:
    'Naskenujte QR kód alebo použite NFC kartu/tag a otvorí sa vám moja digitálna vizitka.',
  scanOrTap: 'Naskenujte alebo priložte NFC',
  nfcExplain:
    'NFC funguje cez kartu, tag alebo nálepku, na ktorú je zapísaný verejný link tejto digitálnej vizitky. Po priložení mobilu sa otvorí kontaktová stránka.',
  nfcBackup: 'QR kód je vždy dostupný ako záloha.',
  bookingText: 'Vyberte si voľný termín priamo v mojom kalendári.',
  bookingHelper: 'Dostupnosť je synchronizovaná cez Google Calendar.',
  bookingCombined:
    'Vyberte si voľný termín priamo v mojom kalendári. Dostupnosť je synchronizovaná cez Google Calendar.',
  footer: 'Prajem Vám veľa úspechov',
};
