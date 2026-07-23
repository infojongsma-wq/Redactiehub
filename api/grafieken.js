// Bibliotheek-API (Vercel serverless) — bewaart grafieken in Vercel Blob.
//
// Per grafiek worden TWEE blobs opgeslagen die dezelfde basisnaam delen:
//   grafieken/<slug>__<uid>.png    (miniatuur, getoond via proxy)
//   grafieken/<slug>__<uid>.json   (de bewerkbare data/instellingen)
// Zo kun je een bewaarde grafiek later terughalen en aanpassen.
//
// Werkt op ELKE Vercel Blob-store (privé óf openbaar): alles wordt door deze
// functie zelf teruggegeven (proxy), dus geen bepaalde store-instelling nodig.
// Vereist: een Blob store gekoppeld aan dit project + één keer opnieuw deployen.
// De token wordt ook herkend als Vercel er een prefix voor zet. Optioneel:
// env var GALERIJ_CODE beschermt bewaren/verwijderen (bekijken kan altijd).
import { put, list, del, get } from "@vercel/blob";

const PREFIX = "grafieken/";

function blobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const k = Object.keys(process.env).find(k => /BLOB_READ_WRITE_TOKEN$/.test(k) && process.env[k]);
  return k ? process.env[k] : undefined;
}
const isAccessFout = e => /private|public|access/i.test(String(e && e.message));

// probeer privé; valt terug op openbaar zodat het op elk store-type werkt
async function putAdaptief(pathname, buf, token, contentType) {
  const opt = { contentType: contentType || "application/octet-stream", addRandomSuffix: false, token };
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
    // --- afbeelding tonen/downloaden (open) ---
    if (req.method === "GET" && req.query && req.query.img) {
      const pad = String(req.query.img);
      if (!pad.startsWith(PREFIX) || !pad.endsWith(".png")) return res.status(400).json({ fout: "Ongeldige afbeelding." });
      const r = await getAdaptief(pad, token);
      if (!r || r.statusCode !== 200 || !r.stream) return res.status(404).json({ fout: "Niet gevonden." });
      const buf = Buffer.from(await new Response(r.stream).arrayBuffer());
      res.setHeader("Content-Type", (r.blob && r.blob.contentType) || "image/png");
      res.setHeader("Cache-Control", "private, max-age=86400");
      if (req.query.download) res.setHeader("Content-Disposition", `attachment; filename="${pad.split("/").pop()}"`);
      return res.status(200).end(buf);
    }

    // --- data van één grafiek ophalen (voor bewerken) ---
    if (req.method === "GET" && req.query && req.query.data) {
      const pad = String(req.query.data);
      if (!pad.startsWith(PREFIX) || !pad.endsWith(".json")) return res.status(400).json({ fout: "Ongeldig pad." });
      const r = await getAdaptief(pad, token);
      if (!r || r.statusCode !== 200 || !r.stream) return res.status(404).json({ fout: "Geen bewerkbare data bij deze grafiek." });
      const txt = await new Response(r.stream).text();
      res.setHeader("Content-Type", "application/json");
      return res.status(200).end(txt);
    }

    // --- lijst van bewaarde grafieken ---
    if (req.method === "GET") {
      const { blobs } = await list({ prefix: PREFIX, token });
      const items = blobs
        .filter(b => b.pathname.endsWith(".png"))
        .map(b => ({ pad: b.pathname, datum: b.uploadedAt, grootte: b.size,
          viewUrl: "/api/grafieken?img=" + encodeURIComponent(b.pathname),
          dataUrl: "/api/grafieken?data=" + encodeURIComponent(b.pathname.replace(/\.png$/, ".json")) }))
        .sort((a, b) => new Date(b.datum) - new Date(a.datum));
      return res.status(200).json({ items, beveiligd: !!code });
    }

    // --- bewaren (nieuw of vervangen) ---
    if (req.method === "POST") {
      if (!authOk) return res.status(401).json({ fout: "Onjuiste of ontbrekende redactiecode." });
      const { naam, png, data, vervang } = req.body || {};
      if (!naam || !png) return res.status(400).json({ fout: "naam en png zijn verplicht." });
      const buf = Buffer.from(String(png).replace(/^data:image\/png;base64,/, ""), "base64");
      if (!buf.length) return res.status(400).json({ fout: "Lege afbeelding." });
      if (buf.length > 4_000_000) return res.status(413).json({ fout: "Afbeelding te groot (max ±4 MB)." });
      const veilig = String(naam).toLowerCase()
        .normalize("NFKD").replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "grafiek";
      // vervang: verwijder het oude paar eerst
      if (vervang && String(vervang).startsWith(PREFIX) && String(vervang).endsWith(".png")) {
        try { await del(String(vervang), { token }); } catch (_) {}
        try { await del(String(vervang).replace(/\.png$/, ".json"), { token }); } catch (_) {}
      }
      const uid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const base = `${PREFIX}${veilig}__${uid}`;
      const blob = await putAdaptief(`${base}.png`, buf, token, "image/png");
      if (data) await putAdaptief(`${base}.json`, Buffer.from(JSON.stringify(data)), token, "application/json");
      return res.status(200).json({ pad: blob.pathname,
        dataUrl: "/api/grafieken?data=" + encodeURIComponent(`${base}.json`) });
    }

    // --- verwijderen (png + bijbehorende json) ---
    if (req.method === "DELETE") {
      if (!authOk) return res.status(401).json({ fout: "Onjuiste of ontbrekende redactiecode." });
      const pad = (req.query && req.query.pad) || (req.body && req.body.pad);
      if (!pad || !String(pad).startsWith(PREFIX) || !String(pad).endsWith(".png")) return res.status(400).json({ fout: "Ongeldig pad." });
      await del(String(pad), { token });
      try { await del(String(pad).replace(/\.png$/, ".json"), { token }); } catch (_) {}
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ fout: "Methode niet toegestaan." });
  } catch (err) {
    return res.status(500).json({ fout: "Serverfout: " + err.message });
  }
}
