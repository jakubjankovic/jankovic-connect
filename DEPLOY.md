# Nasadenie verejnej vizitky (landing-page)

Cieľ: dostať priečinok [`landing-page/`](./landing-page) na **trvalú verejnú URL**, na ktorú bude smerovať QR kód a NFC tag. Vyber si **jednu** z možností nižšie. **GitHub Pages je odporúčané** (zadarmo, stabilná URL, auto-deploy je už pripravený).

> Po nasadení mi pošli finálnu URL — nastavím `PUBLIC_CARD_URL` v `landing-page/script.js` aj v `src/constants/profile.ts` a pregenerujem `landing-page/qr.svg`, aby QR smeroval na tvoju trvalú adresu. (Alebo si to sprav sám podľa časti „Po nasadení" dole.)

---

## Možnosť A — GitHub Pages (odporúčané)

Workflow [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) je už v projekte a po pushnutí automaticky publikuje priečinok `landing-page/`.

**Tvoja výsledná URL bude:** `https://<TVOJE-GITHUB-MENO>.github.io/<NAZOV-REPA>/`
(napr. `https://jankovic.github.io/jankovic-connect/`)

Kroky (v normálnom PowerShelli, `git` už máš nainštalovaný):

```powershell
cd "C:\Users\Jakub Jankovič\Documents\Claude VibeCode Session"
git init
git add -A
git commit -m "Jankovic Connect — initial"
git branch -M main
# vytvor prázdny repo na github.com (napr. jankovic-connect), potom:
git remote add origin https://github.com/<TVOJE-MENO>/<NAZOV-REPA>.git
git push -u origin main
```

Potom na GitHube: **Settings → Pages → Build and deployment → Source = „GitHub Actions"**.
Po ~1 minúte beží stránka na URL vyššie (uvidíš ju aj v záložke **Actions** po dobehnutí jobu).

> Pozn.: `node_modules/`, `android/.gradle/`, `build/` sú v `.gitignore`, takže sa nepushnú — to je v poriadku, na web stránku nie sú potrebné.

---

## Možnosť B — Netlify (drag & drop, bez gitu)

1. Choď na <https://app.netlify.com/drop>.
2. Pretiahni tam **priečinok `landing-page`** (nie celý projekt).
3. Dostaneš URL typu `https://nazov-xyz.netlify.app`.
4. (Voliteľné) Site settings → Change site name → vlastný názov.

---

## Možnosť C — Vercel

1. <https://vercel.com> → **Add New → Project** → importuj repo (alebo nahraj).
2. **Root Directory = `landing-page`**, Framework preset = **Other**.
3. Deploy → dostaneš URL typu `https://nazov.vercel.app`.

---

## Po nasadení (nastavenie finálnej URL)

Ak chceš spraviť úpravy sám, nahraď `PUBLIC_CARD_URL` (terajšia hodnota je `PUBLIC_CARD_URL_PLACEHOLDER`) na 2 miestach:

1. [`landing-page/script.js`](./landing-page/script.js) — premenná `PUBLIC_CARD_URL`
2. [`src/constants/profile.ts`](./src/constants/profile.ts) — `export const PUBLIC_CARD_URL`

Potom pregeneruj QR kód (smeruje na `PUBLIC_CARD_URL`):

```powershell
cd "C:\Users\Jakub Jankovič\Documents\Claude VibeCode Session"
node scripts\make-qr.js "https://TVOJA-TRVALA-URL"
```

`Book a Meeting` ostáva vždy na: `https://calendar.app.google/hirwrfbkkEG6uXE16` (netreba meniť).

---

## Dôležité

- **QR a NFC musia smerovať na túto trvalú URL**, nie na dočasný `trycloudflare.com` tunel (ten slúžil len na rýchly mobilný test).
- Súkromný Google Contacts link sa **nepoužíva** — Save Contact sťahuje `.vcf` (landing page) resp. otvára natívny contact insert (Android appka).
