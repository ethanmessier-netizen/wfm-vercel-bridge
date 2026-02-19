exexport default async function handler(req, res) {
  try {
    // Vercel catch-all: /api/<...> becomes req.query.path = ["...","..."]
    const parts = req.query.path || [];
    const path = Array.isArray(parts) ? parts.join("/") : String(parts || "");

    // Simple health check
    if (path === "" || path === "ping") {
      res.status(200).send("pong");
      return;
    }

    // Keep query string
    const qIndex = req.url.indexOf("?");
    const qs = qIndex >= 0 ? req.url.slice(qIndex) : "";

    // Proxy to Warframe.Market API (NOTE: no "/api" here)
    const target = `https://api.warframe.market/${path}${qs}`;

    const upstream = await fetch(target, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; WFM-Vercel-Bridge/1.0)"
      }
    });

    const body = await upstream.text();

    res.setHeader("Access-Control-Allow-Origin", "*");

    const ct = upstream.headers.get("content-type");
    if (ct) res.setHeader("content-type", ct);

    res.status(upstream.status).send(body);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
