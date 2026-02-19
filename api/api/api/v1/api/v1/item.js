module.exports = async (req, res) => {
  try {
    // You pass ?path=items/<url_name>/orders or ?path=items/<url_name>
    const path = (req.query && req.query.path) ? String(req.query.path) : "";
    if (!path) {
      res.status(400).send('Missing query param "path"');
      return;
    }

    const target = `https://api.warframe.market/v1/${path}`;

    const upstream = await fetch(target, {
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
