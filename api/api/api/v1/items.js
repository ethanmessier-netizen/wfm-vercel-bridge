module.exports = async (req, res) => {
  try {
    const upstream = await fetch("https://api.warframe.market/v1/items", {
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
