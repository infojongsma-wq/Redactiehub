// Galerij-API (Vercel serverless) — bewaart PNG's in Vercel Blob.
//
// Werkt op ELKE Vercel Blob-store (privé óf openbaar): grafieken worden
// opgeslagen en via deze functie zelf teruggegeven (proxy), zodat er geen
// bepaalde store-instelling nodig is.
//
// Vereist: een Blob store gekoppeld aan dit project (Storage → Blob) + één keer
// opnieuw deployen. De token wordt ook herkend als Vercel er een prefix voor
// gebruikt (bv. GRAFIEKEN_BLOB_READ_WRITE_TOKEN). Optioneel: env var GALERIJ_CODE
// beschermt bewaren/verwijderen met een redactiecode (bekijken kan altijd).
import { put, list, del, get } from "@vercel/blob";

const PREFIX = "grafieken/";

// vind de Blob-token, ook als Vercel er een prefix voor zet (meerdere stores)
function blobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const k = Object.keys(process.env).find(k => /BLOB_READ_WRITE_TOKEN$/.test(k) && process.env[k]);
  return k ? process.env[k] : undefined;
}
const isAccessFout = e => /private|public|access/i.test(String(e && e.message));

// probeer privé; valt terug op openbaar zodat het op elk store-type werkt
async function putAdaptief(pathname, buf, token) {
  const opt = { contentType: "image/png", addRandomSuffix: true, token };
  try { return await put(pathname, buf, { access: "private", ...opt }); }
  catch (e) { if (!isAccessFout(e)) throw e; return await put(pathname, buf, { access: "public", ...opt }); }
}
async function getAdaptief(pathname, token) {
  try { return await get(pathname, { access: "private", token }); }
  catch (e) { if (!isAccessFout(e)) throw e; return await get(pathname, { access: "public", token }); }
}

export default async function handler(req, res) {
  const token = blobToken();
  const code = process.env.GALERIJ_CODE;
  const authOk = !code || req.headers["x-galerij-code"] === code;

  if (!token) return res.status(500).json({
    fout: "Blob-opslag niet gekoppeld. Koppel in Vercel een Blob store aan dit project (Storage) en klik daarna op Redeploy (env-variabelen gaan alleen mee in een nieuwe deploy).",
  });

  try {
    // --- afbeelding tonen/downloaden (open: de hele galerij is zichtbaar) ---
    if (req.method === "GET" && req.query && req.query.img) {
      const pad = String(req.query.img);
      if (!pad.startsWith(PREFIX)) return res.status(400).json({ fout: "Ongeldige afbeelding." });
      const r = await getAdaptief(pad, token);
      if (!r || r.statusCode !== 200 || !r.stream) return res.status(404).json({ fout: "Niet gevonden." });
      const buf = Buffer.from(await new Response(r.stream).arrayBuffer());
      res.setHeader("Content-Type", (r.blob && r.blob.contentType) || "image/png");
      res.setHeader("Cache-Control", "private, max-age=86400");
      if (req.query.download) res.setHeader("Content-Disposition", `attachment; filename="${pad.split("/").pop()}"`);
      return res.status(200).end(buf);
    }

    // --- lijst van bewaarde grafieken ---
    if (req.method === "GET") {
      const { blobs } = await list({ prefix: PREFIX, token });
      const items = blobs
        .map(b => ({ pad: b.pathname, datum: b.uploadedAt, grootte: b.size,
          viewUrl: "/api/grafieken?img=" + encodeURIComponent(b.pathname) }))
        .sort((a, b) => new Date(b.datum) - new Date(a.datum));
      return res.status(200).json({ items, beveiligd: !!code });
    }

    // --- bewaren ---
    if (req.method === "POST") {
      if (!authOk) return res.status(401).json({ fout: "Onjuiste of ontbrekende redactiecode." });
      const { naam, png } = req.body || {};
      if (!naam || !png) return res.status(400).json({ fout: "naam en png zijn verplicht." });
      const veilig = String(naam).toLowerCase()
        .normalize("NFKD").replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "grafiek";
      const buf = Buffer.from(String(png).replace(/^data:image\/png;base64,/, ""), "base64");
      if (!buf.length) return res.status(400).json({ fout: "Lege afbeelding." });
      if (buf.length > 4_000_000) return res.status(413).json({ fout: "Afbeelding te groot (max ±4 MB)." });
      const stamp = new Date().toISOString().slice(0, 10);
      const blob = await putAdaptief(`${PREFIX}${stamp}-${veilig}.png`, buf, token);
      return res.status(200).json({ pad: blob.pathname });
    }

    // --- verwijderen ---
    if (req.method === "DELETE") {
      if (!authOk) return res.status(401).json({ fout: "Onjuiste of ontbrekende redactiecode." });
      const pad = (req.query && req.query.pad) || (req.body && req.body.pad);
      if (!pad || !String(pad).startsWith(PREFIX)) return res.status(400).json({ fout: "Ongeldig pad." });
      await del(String(pad), { token });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ fout: "Methode niet toegestaan." });
  } catch (err) {
    return res.status(500).json({ fout: "Serverfout: " + err.message });
  }
}
