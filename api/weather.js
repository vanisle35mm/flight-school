const AVIATION_WEATHER_API = 'https://aviationweather.gov/api/data';

const fetchLatest = async (product) => {
  const response = await fetch(`${AVIATION_WEATHER_API}/${product}?ids=CYYJ&format=json`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'FlightSchoolApp/1.0 (CYYJ training dashboard)'
    }
  });
  if (response.status === 204) return null;
  if (!response.ok) throw new Error(`${product.toUpperCase()} request failed (${response.status})`);
  const reports = await response.json();
  return Array.isArray(reports) ? reports[0] ?? null : null;
};

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ ok: false });
    return;
  }

  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  try {
    const [metarResult, tafResult] = await Promise.allSettled([
      fetchLatest('metar'),
      fetchLatest('taf')
    ]);
    const metar = metarResult.status === 'fulfilled' ? metarResult.value : null;
    const taf = tafResult.status === 'fulfilled' ? tafResult.value : null;
    if (!metar) throw metarResult.status === 'rejected' ? metarResult.reason : new Error('No CYYJ METAR is available.');
    response.status(200).json({ metar, taf });
  } catch (error) {
    console.error('CYYJ weather request failed.', error);
    response.status(502).json({ ok: false, reason: 'weather-unavailable' });
  }
}
