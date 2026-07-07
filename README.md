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
- **Kleuren (huisstijl)** — kies achtergrond, tekstkleur en de kleur per
  reeks/segment. Alleen huisstijlkleuren zijn beschikbaar, dus het blijft altijd
  "Oost".
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

Meerdere kolommen/reeksen naast elkaar? Zet gewoon meer kolommen in je data —
de tool maakt er automatisch een **gegroepeerde** grafiek van.

---

## De huisstijl instellen (belangrijk)

De kleuren en het lettertype staan bovenaan in `index.html` in het blok
`HUISSTIJL`. **Vervang de hex-codes door de exacte RTV Oost-huisstijlkleuren**
(uit de `rtv-oost-huisstijl` / `rtv-oost-datavisual` skill). De nu ingevulde
waarden zijn een nette benadering met **Oost-blauw** als hoofdkleur; de overige
reekskleuren zijn kleurenblind-veilig getoetst.

```js
const HUISSTIJL = {
  fontFamily: "Roobert, Inter, 'Helvetica Neue', Arial, sans-serif",
  palet: [
    { naam:"Oost-blauw", hex:"#0b5fd6" },   // <-- vul hier de exacte huisstijl-hex in
    ...
  ],
  reeksVolgorde: ["#0b5fd6", "#1baf7a", ...],
  ...
};
```

- **Lettertype:** de tool gebruikt **Roobert** als dat op de computer is
  geïnstalleerd; anders valt hij netjes terug op een systeemletter. Wil je
  Roobert overal garanderen, installeer het lettertype op de redactie-computers
  (Roobert is een betaald lettertype, dus niet meegeleverd).
- **Logo:** rechtsonder staat nu een tekst-badge "Oost". Wil je het echte logo?
  Vervang `drawLogo()` door het tekenen van een ingesloten logo-afbeelding
  (als data-URL).

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

## Getest

Alle grafiektypes, de data-parser, tekst-extractie, PNG-export en de drie
formaten zijn geautomatiseerd getest met een headless browser (30 checks).
