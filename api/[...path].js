export default async function handler(req, res) {
  try {
    const path = (req.query.path || []).join("/");
    const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    const target = `https://api.warframe.market/${path}${qs}`;

    const r = await fetch(target, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "WFM-Sheets-Bridge"
      }
    });

    const text = await r.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
