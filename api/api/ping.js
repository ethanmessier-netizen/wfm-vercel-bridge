module.exports = async (req, res) => {
  try {
    // If no path is provided, behave like a health check.
    const path = (req.query && req.query.path) ? String(req.query.path) : "";
    if (!path) {
      res.status(200).send("pong");
      return;
    }

    // Build target URL like: https://api.warframe.market/v1/items
    const target = `https://api.warframe.market/${path}`;

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
    res.status(500).send(String(err));
  }
};
