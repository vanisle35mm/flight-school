const AVIATION_WEATHER_API = 'https://aviationweather.gov/api/data';

const fetchReports = async (product, station) => {
  const response = await fetch(`${AVIATION_WEATHER_API}/${product}?ids=${station}&format=json`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'FlightSchoolApp/1.0 (aviation training dashboard)'
    }
  });
  if (response.status === 204) return null;
  if (!response.ok) throw new Error(`${product.toUpperCase()} request failed (${response.status})`);
  const reports = await response.json();
  return Array.isArray(reports) ? reports : [];
};

const firstReport = (reports) => reports[0] ?? null;
const airportReport = (reports, station) => reports.find((report) => report?.icaoId === station && report?.source === 'Intl')
  ?? reports.find((report) => report?.icaoId === station)
  ?? reports[0]
  ?? null;

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ ok: false });
    return;
  }

  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  const requestedStation = Array.isArray(request.query?.station) ? request.query.station[0] : request.query?.station;
  const station = typeof requestedStation === 'string' ? requestedStation.trim().toUpperCase() : 'CYYJ';
  if (!/^[A-Z]{4}$/.test(station)) {
    response.status(400).json({ ok: false, reason: 'invalid-station' });
    return;
  }
  try {
    const [metarResult, tafResult, airportResult] = await Promise.allSettled([
      fetchReports('metar', station),
      fetchReports('taf', station),
      fetchReports('airport', station)
    ]);
    const metar = metarResult.status === 'fulfilled' ? firstReport(metarResult.value) : null;
    const taf = tafResult.status === 'fulfilled' ? firstReport(tafResult.value) : null;
    const airport = airportResult.status === 'fulfilled' ? airportReport(airportResult.value, station) : null;
    if (!metar) {
      response.status(404).json({ ok: false, reason: 'station-weather-unavailable', station });
      return;
    }
    response.status(200).json({ metar, taf, airport });
  } catch (error) {
    console.error(`${station} weather request failed.`, error);
    response.status(502).json({ ok: false, reason: 'weather-unavailable' });
  }
}
