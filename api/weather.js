export default async function handler(req, res) {
  try {
    const API_KEY = process.env.API_KEY;
    const metaUrl = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/20052/?api_key=${API_KEY}`;

    const infoResp = await fetch(metaUrl);
    if (!infoResp.ok) throw new Error(`AEMET meta error: ${infoResp.status}`);
    const info = await infoResp.json();

    if (!info || !info.datos) throw new Error("AEMET response missing 'datos' URL");

    const datosResp = await fetch(info.datos);
    if (!datosResp.ok) throw new Error(`AEMET datos error: ${datosResp.status}`);
    const data = await datosResp.json();

    res.setHeader('Cache-Control', 's-maxage=3600, max-age=3600');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
