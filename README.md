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
  aan en klik **Grafiek bijwerken**. Je kunt rijen en reeksen toevoegen.
- **Kleuren (huisstijl)** — kies tekstkleur en de kleur per reeks/segment.
  Alleen huisstijlkleuren zijn beschikbaar (incl. lichtblauw en wit), dus het
  blijft altijd RTV Oost.
- **Uitlichten** — geef bij één reeks een losse staaf/kolom een eigen kleur
  (bijv. alleen Overijssel oranje) via *Uitlichten* onder de kleuren.
- **Achtergrond** — een huisstijlkleur, **Transparant** (PNG met doorzichtige
  achtergrond, bijv. om zelf onder een tv-beeld te leggen) of een **foto**.
  Bij een foto kun je 'm **verslepen** in het voorbeeld, **inzoomen/bijsnijden**,
  het **contrast** aanpassen en met een schuif **transparant maken (vervagen)**
  zodat de grafiek er goed op leesbaar blijft. Een verloop bovenaan houdt de
  titel leesbaar.
- **Formaat** — liggend 16:9 (1920×1080, web/tv), vierkant (1080×1080, feed) of
  verticaal (1080×1920, stories/Reels).
- **Download PNG** of **Kopieer** naar het klembord.

---

## Grafiektypes

| Type | Wanneer gebruiken |
|------|-------------------|
| **Kolommen** (verticaal) | aantallen per categorie vergelijken |
| **Balken** (horizontaal) | zelfde, maar met lange labels of veel categorieën |
| **Gestapeld** | opbouw van een geheel (delen samen = totaal) |
| **Lijn** | ontwikkeling door de tijd |
| **Vlak** | ontwikkeling + volume |
| **Taart / Donut** | verdeling van één geheel (max ~6 delen) |
| **Rangschikking** (lollipop) | top-lijstjes, netter dan veel staven |
| **Groot getal** (KPI) | één cijfer dat het verhaal is |
| **Dashboard** (ring-meters) | rij ring-meters met % per categorie (bijv. per leeftijdsgroep) |

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
    { naam:"Oost-oranje",      hex:"#ff6813" },
    { naam:"Oost-groen",       hex:"#abbf3d" },
    { naam:"Oost-paars",       hex:"#8f00ff" },
    { naam:"Oost-rood",        hex:"#ff4242" },
    { naam:"Oost-geel",        hex:"#ffaf16" },
    { naam:"Oost-donkerblauw", hex:"#131720" },
  ],
  // CVD-geoptimaliseerde reeksvolgorde (rood en groen niet naast elkaar)
  reeksVolgorde: ["#1361ff","#ff6813","#abbf3d","#8f00ff","#ff4242","#ffaf16","#131720"],
  ...
};
```

Achtergronden: wit, Oost-lichtblauw `#e7eef9`, Oost-blauw `#1361ff` en
Oost-donkerblauw `#131720`. De reeksvolgorde is getoetst met de dataviz-validator
(kleurenblind-veilig, worst adjacent ΔE 14.4). Oost-geel is fel, daarom staan
waarde-labels en de datatabel standaard aan.

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

Alle grafiektypes, de data-parser (incl. Excel, puntkomma-CSV met quotes en
dataportaal-exports), tekst-extractie, PNG-export en de drie formaten zijn
geautomatiseerd getest met een headless browser (75 checks).
