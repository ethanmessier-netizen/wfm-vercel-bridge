export default async function handler(req, res) {
  try {
    const pathArray = req.query.path || [];
    const path = Array.isArray(pathArray)
      ? pathArray.join("/")
      : pathArray;

    const target = `https://api.warframe.market/${path}`;

    const response = await fetch(target, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const data = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).send(data);

  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
