// Galerij-API (Vercel serverless) — bewaart PNG's in Vercel Blob.
// Vereist in Vercel: een Blob store gekoppeld aan dit project (Storage → Blob),
// dat zet automatisch BLOB_READ_WRITE_TOKEN. Optioneel: env var GALERIJ_CODE
// om bewaren/verwijderen af te schermen met een redactiecode.
import { put, list, del } from "@vercel/blob";

export default async function handler(req, res) {
  const code = process.env.GALERIJ_CODE;
  const authOk = !code || req.headers["x-galerij-code"] === code;
  try {
    if (req.method === "GET") {
      const { blobs } = await list({ prefix: "grafieken/" });
      const items = blobs
        .map(b => ({ url: b.url, pad: b.pathname, datum: b.uploadedAt, grootte: b.size }))
        .sort((a, b) => new Date(b.datum) - new Date(a.datum));
      return res.status(200).json({ items, beveiligd: !!code });
    }

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
      const blob = await put(`grafieken/${stamp}-${veilig}.png`, buf,
        { access: "public", contentType: "image/png", addRandomSuffix: true });
      return res.status(200).json({ url: blob.url, pad: blob.pathname });
    }

    if (req.method === "DELETE") {
      if (!authOk) return res.status(401).json({ fout: "Onjuiste of ontbrekende redactiecode." });
      const url = (req.query && req.query.url) || (req.body && req.body.url);
      if (!url) return res.status(400).json({ fout: "url is verplicht." });
      await del(url);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ fout: "Methode niet toegestaan." });
  } catch (err) {
    const geenStore = !process.env.BLOB_READ_WRITE_TOKEN;
    return res.status(500).json({
      fout: geenStore
        ? "Blob-opslag niet gekoppeld. Maak in Vercel een Blob store aan (Storage → Create Database → Blob) en koppel die aan dit project."
        : "Serverfout: " + err.message,
    });
  }
}
