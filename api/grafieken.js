// Galerij-API (Vercel serverless) — bewaart PNG's in Vercel Blob.
//
// Werkt met een PRIVÉ Blob-store (de standaard op Vercel): grafieken worden
// privé opgeslagen en via deze functie zelf teruggegeven (proxy), zodat er
// geen openbare store-instelling nodig is.
//
// Vereist in Vercel: een Blob store gekoppeld aan dit project (Storage → Blob),
// dat zet automatisch BLOB_READ_WRITE_TOKEN. Optioneel: env var GALERIJ_CODE
// om bewaren/verwijderen af te schermen met een redactiecode (bekijken kan altijd).
import { put, list, del, get } from "@vercel/blob";

const PREFIX = "grafieken/";

export default async function handler(req, res) {
  const code = process.env.GALERIJ_CODE;
  const authOk = !code || req.headers["x-galerij-code"] === code;
  try {
    // --- afbeelding tonen/downloaden (open: de hele galerij is zichtbaar) ---
    if (req.method === "GET" && req.query && req.query.img) {
      const pad = String(req.query.img);
      if (!pad.startsWith(PREFIX)) return res.status(400).json({ fout: "Ongeldige afbeelding." });
      const r = await get(pad, { access: "private" });
      if (!r || r.statusCode !== 200 || !r.stream) return res.status(404).json({ fout: "Niet gevonden." });
      const buf = Buffer.from(await new Response(r.stream).arrayBuffer());
      res.setHeader("Content-Type", (r.blob && r.blob.contentType) || "image/png");
      res.setHeader("Cache-Control", "private, max-age=86400");
      if (req.query.download) res.setHeader("Content-Disposition", `attachment; filename="${pad.split("/").pop()}"`);
      return res.status(200).end(buf);
    }

    // --- lijst van bewaarde grafieken ---
    if (req.method === "GET") {
      const { blobs } = await list({ prefix: PREFIX });
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
      const blob = await put(`${PREFIX}${stamp}-${veilig}.png`, buf,
        { access: "private", contentType: "image/png", addRandomSuffix: true });
      return res.status(200).json({ pad: blob.pathname });
    }

    // --- verwijderen ---
    if (req.method === "DELETE") {
      if (!authOk) return res.status(401).json({ fout: "Onjuiste of ontbrekende redactiecode." });
      const pad = (req.query && req.query.pad) || (req.body && req.body.pad);
      if (!pad || !String(pad).startsWith(PREFIX)) return res.status(400).json({ fout: "Ongeldig pad." });
      await del(String(pad));
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ fout: "Methode niet toegestaan." });
  } catch (err) {
    const geenStore = !process.env.BLOB_READ_WRITE_TOKEN;
    return res.status(500).json({
      fout: geenStore
        ? "Blob-opslag niet gekoppeld. Koppel in Vercel een Blob store aan dit project (Storage → Create Database → Blob) en deploy opnieuw."
        : "Serverfout: " + err.message,
    });
  }
}
