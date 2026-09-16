# Grafiekmaker · Redactiehub Oost

Een simpele **desktop-tool** waarmee een redacteur snel een grafiek in de
huisstijl van RTV Oost maakt op basis van data of een stukje tekst, en die als
**PNG** downloadt voor rtvoost.nl en social media.

Geen installatie, geen account, geen internet nodig. Alles gebeurt in de
browser; je data verlaat je computer niet.

---

## Hoe gebruik je het?

**Optie A — dubbelklikken.** Open `index.html` in Chrome, Edge of Firefox.
Klaar.

**Optie B — online zetten (aanrader voor de hele redactie).**
Zet dit bestand op **GitHub Pages** of een interne webserver, dan heeft iedereen
een vaste link zonder iets te downloaden. Zie *Online zetten* hieronder.

### In 3 stappen

1. **Data of tekst** — plak cijfers uit Excel (kopiëren/plakken werkt direct),
   uit een CSV, of typ ze zelf. Voorbeelden die werken:

   ```
   Twente        352        ← geplakt uit Excel (tab)
   IJsselland    561
   Vechtdal      284
   ```
   ```
   Twente: 35        ← zelf getypt
   Zwolle: 56
   ```
   Heb je alleen een lopende tekst met getallen? Klik op **"Cijfers uit tekst
   halen"** — de tool haalt er automatisch getallen + labels uit, die je daarna
   controleert.

2. **Teksten** — vul *Titel*, *Ondertitel* en *Bron* in.

3. **Kies een grafiek** en klik **Genereren**. Je ziet meteen een voorbeeld.

### Daarna

- **Data aanpassen** — de verwerkte cijfers staan in een tabel. Pas een waarde
  aan en klik **Grafiek bijwerken**. Je kunt rijen en reeksen toevoegen, en met
  de **↑/↓-knopjes** rijen verschuiven om de volgorde in de grafiek te bepalen
  (uitlicht- en labelkleuren verhuizen mee). Iets per ongeluk verwijderd of
  overschreven? **Ctrl+Z** (of de **↶ Ongedaan**-knop) haalt het terug;
  **Ctrl+Y** doet het opnieuw.
- **Voorbeeld-grootte** — het voorbeeld staat **standaard klein**, zodat de
  datatabel meteen in beeld staat. **Klik op het voorbeeld** (of op
  **⤢ Vergroten** ernaast) om het groot te maken; je keuze blijft bewaard.
  Fijnregelen kan met het **balkje onder het voorbeeld**; dubbelklik daarop om
  terug te gaan naar de gekozen klein/groot-stand.
- **Sneller invullen** — de tabel is compact en scrolt zelf, met een kopregel
  die blijft staan. **Tab** loopt van cel naar cel (de ↑/↓/✕-knopjes worden
  overgeslagen), **Enter** springt een rij omlaag in dezelfde kolom —
  onderaan maakt Enter meteen een nieuwe rij — en **Shift+Enter** gaat weer
  omhoog. De pijltjes omhoog/omlaag doen hetzelfde.
- **Kleuren (huisstijl)** — kies tekstkleur en de kleur per reeks/segment. Het
  palet is bewust klein gehouden: **Oost-blauw, geel, donkerblauw, lichtblauw en
  wit**. Zo blijft het altijd RTV Oost. **Uitzondering: taart en donut.** Daar
  staan bij *Kleur per partje* ook **oranje, rood en groen** — die grafieken
  hebben vaak meer partjes dan er kleuren in het basispalet zitten. Voor
  *Uitlichten* en *Labelkleur* geldt ook daar het kleine palet.
- **Uitlichten** — geef bij één reeks een losse staaf/kolom een eigen kleur
  (bijv. alleen Overijssel geel) via *Uitlichten* onder de kleuren.
- **Labelkleur** — geef ook de **tekst van een los label** een eigen kleur
  (via het uitklapbare *Labelkleur* onder de kleuren). Onleesbare combinaties
  (bijv. lichtblauw op wit) vallen automatisch terug op de gewone tekstkleur.
- **Tekstvak met duiding** — klik op **+ Tekstvak** (stap 6) voor een klein
  kader met een korte tekst en een **verbindingslijntje** naar een punt in de
  grafiek. **Sleep** het kader én het stipje in het voorbeeld naar de gewenste
  plek, of dubbelklik op een kader om de tekst te wijzigen. Het kadertje is een
  witte kaart met donkere tekst (leesbaar op elke achtergrond); het lijntje kleurt
  mee met de huisstijl. Het gaat automatisch mee in de PNG en in de bibliotheek.
- **Achtergrond** — **wit**, **Oost-lichtblauw**, **Oost-blauw** of
  **Transparant** (PNG met doorzichtige achtergrond, bijv. om zelf onder een
  tv-beeld te leggen). *(De foto-achtergrond staat uit; zet `FOTO_AAN` in
  `index.html` op `true` om 'm terug te halen.)*
- **Soort cijfers** — geef bij *Data aanpassen* aan of het om **absolute
  getallen** of om **percentages** gaat. Bij percentages loopt de as altijd van
  **0 tot 100**, zodat 60% ook echt 60% van de staaf/ring vult in plaats van
  een volle staaf.
- **Taart/donut: partjes van rijen of reeksen** — staan de categorieën als
  kolommen (reeksen) in je tabel in plaats van als rijen? Zet *Partjes van* dan
  op **Reeksen**. De legenda toont altijd **alle** partjes; regelhoogte en
  lettergrootte krimpen mee als het er veel zijn.
- **Dashboard-indeling** — kies bij het formaat hoeveel **ringen per rij** je
  wilt (automatisch of 1–4). Met **1** staan ze onder elkaar, handig in een
  verticaal formaat.
- **Formaat** — liggend 16:9 (1920×1080, web/tv), liggend 4:3 (1440×1080),
  vierkant (1080×1080, feed), staand 4:5 (1080×1350) of verticaal
  (1080×1920, stories/Reels).
- **Download PNG** of **Kopieer** naar het klembord.

---

## Grafiektypes

| Type | Wanneer gebruiken |
|------|-------------------|
| **Kolommen** (verticaal) | aantallen per categorie vergelijken |
| **Balken** (horizontaal) | zelfde, maar met lange labels of veel categorieën |
| **Gestapeld** | opbouw van een geheel (delen samen = totaal) |
| **Lijn** | ontwikkeling door de tijd |
| **100% horizontaal** | verhoudingen per categorie (elke balk = 100%) |
| **Taart / Donut** | verdeling van één geheel (partjes uit de rijen óf de reeksen) |
| **Dashboard** (ring-meters) | rij ring-meters met % per categorie (netjes gecentreerd) |

Meerdere kolommen/reeksen naast elkaar? Zet gewoon meer kolommen in je data —
de tool maakt er automatisch een **gegroepeerde** grafiek van.

---

## De huisstijl instellen (belangrijk)

De kleuren en het lettertype staan bovenaan in `index.html` in het blok
`HUISSTIJL`. Daar staan nu de **exacte RTV Oost-huisstijlkleuren**:

```js
const HUISSTIJL = {
  fontFamily: "Roobert, Inter, 'Helvetica Neue', Arial, sans-serif",
  palet: [
    { naam:"Oost-blauw",       hex:"#1361ff" },
    { naam:"Oost-geel",        hex:"#ffaf16" },
    { naam:"Oost-donkerblauw", hex:"#131720" },
  ],
  reeksVolgorde: ["#1361ff","#ffaf16","#131720","#e7eef9"],
  ...
};
```

Het palet is op verzoek van de redactie **klein gehouden**: Oost-blauw, geel,
donkerblauw, lichtblauw en wit (`waardePalet`). Alleen **taart en donut** krijgen
er bij *Kleur per partje* oranje, rood en groen bij (`taartExtra`). Wil je meer
kleuren overal beschikbaar maken? Zet ze in `waardePalet` (en eventueel in
`reeksVolgorde`) bovenaan `index.html`.

Achtergronden: wit, Oost-lichtblauw `#e7eef9` en Oost-blauw `#1361ff`.
Oost-geel is fel, daarom staan waarde-labels en de datatabel standaard aan.

- **Lettertype:** de tool gebruikt **Roobert** (staat op de redactie-computers);
  op een computer zonder Roobert valt hij netjes terug op een systeemletter.
- **Logo:** de grafieken bevatten bewust **geen** logo (naar keuze van de
  redactie), zodat je de PNG vrij kunt plaatsen.
- **Merknaam in tekst:** schrijf de naam in geschreven tekst voluit als
  **RTV Oost**.

---

## Online zetten (GitHub Pages)

1. Push dit project naar GitHub.
2. Repo → **Settings → Pages** → *Deploy from a branch* → kies de branch en map
   (root).
3. Na een minuut staat de tool op `https://<gebruiker>.github.io/<repo>/`.

## Galerij — gedeelde grafieken van de redactie

Op de **online versie** kan iedereen gemaakte grafieken **bewaren, terugzien en
opnieuw bewerken**: klik na het genereren op **☁ In bibliotheek**, en open de
bibliotheek via de knop **Bibliotheek** bovenin. Daar staan alle bewaarde
grafieken (nieuwste eerst) met **✎ Bewerken**, download- en verwijderknop.
Met *Bewerken* laad je een bewaarde grafiek terug in de app (inclusief de
cijfers en instellingen); bij het opslaan vraagt de app of je het **origineel
vervangt** of als **nieuwe** grafiek bewaart. *(De achtergrond-foto wordt niet
in de bibliotheek bewaard; de rest wel.)*

**Zo zet je de opslag aan (eenmalig, via Vercel — gratis):**

1. Ga naar [vercel.com](https://vercel.com) → **Add New → Project** →
   importeer deze GitHub-repo. Geen build-instellingen nodig → **Deploy**.
2. In het project: **Storage → Create Database → Blob** → koppel aan dit
   project. (Dit zet automatisch de omgevingsvariabele
   `BLOB_READ_WRITE_TOKEN`.)
3. *(Aanrader)* **Settings → Environment Variables** → voeg `GALERIJ_CODE`
   toe met een zelfgekozen redactiecode. Bewaren/verwijderen vraagt dan
   éénmalig die code (bekijken kan altijd). Zonder deze variabele kan
   iedereen met de link bewaren en verwijderen.
4. Redeploy. Klaar — de app draait op `https://<project>.vercel.app`.

De techniek zit in `api/grafieken.js` (een kleine serverless functie) en
gebruikt Vercel Blob als **privé** opslag: de grafieken worden privé bewaard
en door de functie zelf teruggegeven (proxy). Je hoeft dus **niets** aan de
store-instellingen te wijzigen — een standaard (privé) Blob-store koppelen is
genoeg. Op de offline dubbelklik-versie en op GitHub Pages (geen serverfuncties)
toont de galerij een nette uitleg; al het overige blijft daar gewoon werken.

## In een app zetten

`index.html` is volledig self-contained (geen dependencies, geen server) en
werkt overal waar een moderne browser-engine zit:

- **Webapp** — op GitHub Pages of een interne webserver (zie hierboven).
- **Desktop-app** — laad het bestand in **Electron** of **Tauri** als enige
  pagina; er is geen backend of build-stap nodig.
- **Ingebed** — in een `<iframe>` of WebView binnen een bestaand systeem
  (bijv. het redactie-CMS).

Enige vereiste voor de **Excel-import**: de browser-API `DecompressionStream`
(Chrome/Edge 80+, Safari 16.4+, Firefox 113+). Op oudere engines blijft al
het overige gewoon werken; alleen `.xlsx` lezen geeft dan een nette melding.
De opbouw van de code staat in het commentaarblok bovenaan `index.html`
(genummerde secties 1–8).

---

## Techniek

- Eén bestand, **geen dependencies**, geen build-stap. Puur HTML + CSS +
  vanilla JavaScript met de Canvas-API.
- Grafieken worden op volledige resolutie (bijv. 1920×1080) getekend en als
  PNG geëxporteerd, zodat ze scherp zijn voor druk en video.
- Nederlandse getalnotatie (`1.200`, `35,6`) wordt herkend; de PNG toont
  getallen ook in NL-notatie.
- **Slimme import** voor echte bestanden: Excel (`.xlsx`), CSV met **komma óf
  puntkomma** en `"aanhalingstekens"`, en brede exports uit dataportalen (bijv.
  Kindermonitor/Mosaic: veel metadata-kolommen + één `Waarde`-kolom). De tool
  kiest dan zelf de juiste label- en waardekolom, kort lange labels in
  (`… (0-3), 0 jaar` → `0 jaar`) en vult *Titel*/*Bron* alvast in. Excel-
  percentages (intern `0,42`) worden correct `42%`.

## Getest

Alle grafiektypes, de data-parser (incl. Excel, komma/puntkomma-CSV met quotes
en dataportaal-exports), tekst-extractie, kleuren (incl. uitlichten en
labelkleur), de sleepbare tekstvakken met verbindingslijn, undo, PNG-export, de
drie formaten en de layout (o.a. dat hoge staven niet meer door de titel lopen)
zijn geautomatiseerd getest met een headless browser.
