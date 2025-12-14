# 💱 Currency Converter

Webapp elegante per la conversione di valute in tempo reale. Tassi di cambio aggiornati automaticamente.

## Valute Supportate

| Valuta | Codice | Bandiera |
|--------|--------|----------|
| Euro | EUR | 🇪🇺 |
| Dollaro USA | USD | 🇺🇸 |
| Dollaro Hong Kong | HKD | 🇭🇰 |
| Dirham Emirati | AED | 🇦🇪 |
| Dong Vietnam | VND | 🇻🇳 |
| Baht Thailandese | THB | 🇹🇭 |
| Rublo Russo | RUB | 🇷🇺 |
| Dollaro Australiano | AUD | 🇦🇺 |

## Funzionalità

- ✅ Conversione istantanea in 8 valute
- ✅ Tassi via [fawazahmed0/currency-api](https://github.com/fawazahmed0/exchange-api) (gratuita, 200+ valute)
- ✅ Aggiornamento automatico ogni 4 ore
- ✅ Cache locale per funzionamento offline
- ✅ PWA installabile su iOS/macOS/Android
- ✅ Design responsive e moderno
- ✅ Nessuna API key richiesta

---

## 🚀 Deploy su GitHub Pages

### Passo 1: Crea un nuovo repository

1. Vai su [github.com/new](https://github.com/new)
2. Nome repository: `currency-converter` (o come preferisci)
3. Seleziona **Public**
4. **NON** selezionare "Add a README file"
5. Clicca **Create repository**

### Passo 2: Carica i file

#### Opzione A: Via interfaccia web (più semplice)

1. Nel repository appena creato, clicca **"uploading an existing file"**
2. Trascina tutti i file della cartella `currency-converter`:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - `.nojekyll`
3. Scrivi un commit message (es. "Initial commit")
4. Clicca **Commit changes**

#### Opzione B: Via terminale (per utenti esperti)

```bash
# Clona il repository vuoto
git clone https://github.com/TUO-USERNAME/currency-converter.git
cd currency-converter

# Copia tutti i file nella cartella
# (copia i file index.html, styles.css, app.js, ecc.)

# Commit e push
git add .
git commit -m "Initial commit"
git push origin main
```

### Passo 3: Attiva GitHub Pages

1. Nel repository, vai su **Settings** (icona ingranaggio)
2. Nel menu laterale, clicca **Pages**
3. In "Source", seleziona:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Clicca **Save**
5. Attendi 1-2 minuti

### Passo 4: Accedi alla tua app

La tua app sarà disponibile su:
```
https://TUO-USERNAME.github.io/currency-converter/
```

---

## 📱 Installazione come App

### Su iPhone/iPad (Safari)

1. Apri l'URL della webapp in Safari
2. Tocca l'icona **Condividi** (quadrato con freccia)
3. Scorri e tocca **"Aggiungi a Home"**
4. Conferma con **"Aggiungi"**

### Su Mac (Safari/Chrome)

**Safari:**
1. Apri l'URL della webapp
2. Menu **File** → **Aggiungi al Dock**

**Chrome:**
1. Apri l'URL della webapp
2. Clicca i tre puntini (⋮) in alto a destra
3. Seleziona **"Installa Currency Converter..."**

### Su Android (Chrome)

1. Apri l'URL della webapp in Chrome
2. Tocca i tre puntini (⋮)
3. Seleziona **"Aggiungi a schermata Home"**

---

## 🔧 Personalizzazione

### Aggiungere altre valute

Modifica l'array `CURRENCIES` in `app.js`:

```javascript
const CURRENCIES = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'USD', name: 'Dollaro USA', flag: '🇺🇸' },
    // Aggiungi qui altre valute...
    { code: 'GBP', name: 'Sterlina', flag: '🇬🇧' },
    { code: 'JPY', name: 'Yen', flag: '🇯🇵' },
    { code: 'CNY', name: 'Yuan Cinese', flag: '🇨🇳' },
];
```

L'API supporta **200+ valute** tra cui:
AED, AFN, ALL, AMD, ANG, AOA, ARS, AUD, AWG, AZN, BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND, BOB, BRL, BSD, BTN, BWP, BYN, BZD, CAD, CDF, CHF, CLP, CNY, COP, CRC, CUP, CVE, CZK, DJF, DKK, DOP, DZD, EGP, ERN, ETB, EUR, FJD, GBP, GEL, GHS, GIP, GMD, GNF, GTQ, GYD, HKD, HNL, HRK, HTG, HUF, IDR, ILS, INR, IQD, IRR, ISK, JMD, JOD, JPY, KES, KGS, KHR, KMF, KPW, KRW, KWD, KYD, KZT, LAK, LBP, LKR, LRD, LSL, LYD, MAD, MDL, MGA, MKD, MMK, MNT, MOP, MRU, MUR, MVR, MWK, MXN, MYR, MZN, NAD, NGN, NIO, NOK, NPR, NZD, OMR, PAB, PEN, PGK, PHP, PKR, PLN, PYG, QAR, RON, RSD, RUB, RWF, SAR, SBD, SCR, SDG, SEK, SGD, SHP, SLL, SOS, SRD, SSP, STN, SYP, SZL, THB, TJS, TMT, TND, TOP, TRY, TTD, TWD, TZS, UAH, UGX, USD, UYU, UZS, VES, VND, VUV, WST, XAF, XCD, XOF, XPF, YER, ZAR, ZMW

### Cambiare valuta di default

In `app.js`, modifica lo stato iniziale:

```javascript
let state = {
    baseCurrency: 'USD',  // Cambia qui
    amount: 1000,
    // ...
};
```

### Cambiare frequenza aggiornamento

In `app.js`, modifica `CACHE_DURATION`:

```javascript
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 ora
```

---

## 📝 Note Tecniche

- **API**: [fawazahmed0/currency-api](https://github.com/fawazahmed0/exchange-api) - gratuita, 200+ valute
- **CDN**: jsDelivr + Cloudflare Pages (fallback automatico)
- **Limiti**: Nessun limite, nessuna API key
- **Aggiornamento tassi**: Ogni giorno
- **Offline**: Funziona con Service Worker e cache locale

### Struttura file

```
currency-converter/
├── index.html      # Struttura HTML
├── styles.css      # Stili CSS
├── app.js          # Logica JavaScript
├── manifest.json   # Config PWA
├── sw.js           # Service Worker (offline)
├── icon-192.png    # Icona app piccola
├── icon-512.png    # Icona app grande
├── .nojekyll       # Disabilita Jekyll
└── README.md       # Questo file
```

---

## 🐛 Risoluzione problemi

**La app non si carica:**
- Verifica che GitHub Pages sia attivo (Settings → Pages)
- Attendi 2-3 minuti dopo l'attivazione
- Controlla che il branch sia `main` e non `master`

**Tassi non si aggiornano:**
- Clicca il pulsante refresh (↻) in basso
- Verifica connessione internet

**App non installabile su iOS:**
- Usa Safari (Chrome iOS non supporta PWA)
- Assicurati di usare HTTPS (GitHub Pages lo fa automaticamente)

**Vedo valori "—" invece dei numeri:**
- L'API potrebbe essere temporaneamente non raggiungibile
- Prova a ricaricare la pagina o attendere qualche minuto

---

## 📄 Licenza

MIT License - Usa liberamente per progetti personali e commerciali.

---

Made with ☕ for quick currency conversions
