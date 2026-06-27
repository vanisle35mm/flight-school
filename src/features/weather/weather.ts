import { CYYJ_RUNWAYS, normalizeAirportRunways, type Runway } from './runways';

export const WEATHER_STATION = 'CYYJ';
export const METAR_REFERENCE_URL = `https://metar-taf.com/metar/${WEATHER_STATION}`;
export const WEATHER_SUMMARY_EVENT = 'flightschool-weather-summary';
export const WEATHER_SUMMARY_KEY = 'flightschool_weather_summary';
export const DASHBOARD_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=48.6469&longitude=-123.4258&current=temperature_2m,dew_point_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,cloud_cover,visibility&wind_speed_unit=kn&timezone=America%2FVancouver&forecast_days=1';

export type CloudLayer = {
  cover: string;
  label: string;
  baseFt: number | null;
};

export type TafPeriod = {
  change: string;
  from: string;
  to: string;
  wind: string;
  visibility: string;
  conditions: string;
  clouds: string;
};

export type WeatherSnapshot = {
  station: string;
  airportName: string;
  flightCategory: string;
  temperature: string;
  temperatureC: number | null;
  dewpoint: string;
  wind: string;
  windDirection: number | null;
  windSpeedKt: number | null;
  windGustKt: number | null;
  windSpeed: string;
  gusts: string;
  visibility: string;
  conditions: string;
  observed: string;
  ceiling: string;
  altimeter: string;
  metar: string;
  taf: string;
  tafValidity: string;
  clouds: CloudLayer[];
  forecast: TafPeriod[];
  runways: Runway[];
  isOfficial: boolean;
};

export type WeatherSummary = { station: string; temperature: string };

export const getStoredWeatherSummary = (): WeatherSummary => {
  if (typeof window === 'undefined') return { station: WEATHER_STATION, temperature: '--' };
  try {
    const value = JSON.parse(window.localStorage.getItem(WEATHER_SUMMARY_KEY) ?? '{}') as Partial<WeatherSummary>;
    return {
      station: typeof value.station === 'string' && /^[A-Z]{4}$/.test(value.station) ? value.station : WEATHER_STATION,
      temperature: typeof value.temperature === 'string' && value.temperature ? value.temperature : '--'
    };
  } catch {
    return { station: WEATHER_STATION, temperature: '--' };
  }
};

export const saveWeatherSummary = (summary: WeatherSummary) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WEATHER_SUMMARY_KEY, JSON.stringify(summary));
  window.dispatchEvent(new CustomEvent<WeatherSummary>(WEATHER_SUMMARY_EVENT, { detail: summary }));
};

type UnknownRecord = Record<string, unknown>;

const CLOUD_LABELS: Record<string, string> = {
  CLR: 'Clear',
  SKC: 'Clear',
  FEW: 'Few',
  SCT: 'Scattered',
  BKN: 'Broken',
  OVC: 'Overcast',
  VV: 'Vertical visibility'
};

const numberOrNull = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : null;
const recordOrEmpty = (value: unknown): UnknownRecord => value && typeof value === 'object' && !Array.isArray(value) ? value as UnknownRecord : {};
const formatTemperature = (value: number | null) => value === null ? 'Unavailable' : `${Math.round(value)} C`;
const formatSpeed = (value: number | null) => value === null ? 'Unavailable' : `${Math.round(value)} kt`;
const formatDirection = (value: number | null) => value === null ? 'Variable' : `${String(Math.round(value)).padStart(3, '0')} deg`;
const formatEpoch = (value: unknown) => {
  const seconds = numberOrNull(value);
  if (seconds === null) return 'Unknown';
  return new Date(seconds * 1000).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};
const formatForecastTime = (value: unknown) => {
  const seconds = numberOrNull(value);
  if (seconds === null) return '--';
  return new Date(seconds * 1000).toLocaleString(undefined, { weekday: 'short', hour: 'numeric' });
};
const formatVisibility = (value: unknown) => {
  if (typeof value === 'string' && value.trim()) return value === '6+' ? '6+ SM' : `${value} SM`;
  const miles = numberOrNull(value);
  return miles === null ? 'Unavailable' : `${miles} SM`;
};
const formatClouds = (clouds: CloudLayer[]) => clouds.length
  ? clouds.map((cloud) => cloud.baseFt === null ? cloud.cover : `${cloud.cover} ${cloud.baseFt.toLocaleString()} ft`).join(', ')
  : 'No significant cloud';

const normalizeClouds = (value: unknown): CloudLayer[] => Array.isArray(value) ? value.map((item) => {
  const cloud = recordOrEmpty(item);
  const cover = typeof cloud.cover === 'string' ? cloud.cover : '---';
  return { cover, label: CLOUD_LABELS[cover] ?? cover, baseFt: numberOrNull(cloud.base) };
}) : [];

const getCeiling = (clouds: CloudLayer[]) => {
  const ceiling = clouds.find((cloud) => ['BKN', 'OVC', 'VV'].includes(cloud.cover) && cloud.baseFt !== null);
  return ceiling?.baseFt === null || ceiling?.baseFt === undefined ? 'Unlimited' : `${ceiling.baseFt.toLocaleString()} ft`;
};

const normalizeForecast = (value: unknown): TafPeriod[] => Array.isArray(value) ? value.map((item) => {
  const forecast = recordOrEmpty(item);
  const direction = numberOrNull(forecast.wdir);
  const speed = numberOrNull(forecast.wspd);
  const gust = numberOrNull(forecast.wgst);
  const clouds = normalizeClouds(forecast.clouds);
  const change = typeof forecast.fcstChange === 'string' && forecast.fcstChange ? forecast.fcstChange : 'BASE';
  const weather = typeof forecast.wxString === 'string' && forecast.wxString ? forecast.wxString : 'No significant weather';
  return {
    change,
    from: formatForecastTime(forecast.timeFrom),
    to: formatForecastTime(forecast.timeTo),
    wind: speed === null ? 'No wind change' : `${formatDirection(direction)} at ${formatSpeed(speed)}${gust === null ? '' : ` gusting ${Math.round(gust)} kt`}`,
    visibility: formatVisibility(forecast.visib),
    conditions: weather,
    clouds: formatClouds(clouds)
  };
}) : [];

const normalizeAviationWeather = (payload: UnknownRecord): WeatherSnapshot => {
  const metar = recordOrEmpty(payload.metar);
  const taf = recordOrEmpty(payload.taf);
  const airport = recordOrEmpty(payload.airport);
  const temperature = numberOrNull(metar.temp);
  const dewpoint = numberOrNull(metar.dewp);
  const direction = numberOrNull(metar.wdir);
  const speed = numberOrNull(metar.wspd);
  const gusts = numberOrNull(metar.wgst);
  const altimeterHpa = numberOrNull(metar.altim);
  const clouds = normalizeClouds(metar.clouds);
  const cover = typeof metar.cover === 'string' ? metar.cover : clouds[0]?.cover;
  const weather = typeof metar.wxString === 'string' && metar.wxString ? metar.wxString : CLOUD_LABELS[cover ?? ''] ?? 'No significant weather';
  return {
    station: typeof metar.icaoId === 'string' ? metar.icaoId : WEATHER_STATION,
    airportName: typeof metar.name === 'string' ? metar.name.replace(/,\s*[A-Z]{2},\s*[A-Z]{2}$/, '') : typeof airport.name === 'string' ? airport.name.trim() : 'Airport weather',
    flightCategory: typeof metar.fltCat === 'string' ? metar.fltCat : 'N/A',
    temperature: formatTemperature(temperature),
    temperatureC: temperature,
    dewpoint: formatTemperature(dewpoint),
    wind: `${formatDirection(direction)} at ${formatSpeed(speed)}${gusts === null ? '' : `, gusting ${Math.round(gusts)} kt`}`,
    windDirection: direction,
    windSpeedKt: speed,
    windGustKt: gusts,
    windSpeed: formatSpeed(speed),
    gusts: formatSpeed(gusts),
    visibility: formatVisibility(metar.visib),
    conditions: weather,
    observed: formatEpoch(metar.obsTime),
    ceiling: getCeiling(clouds),
    altimeter: altimeterHpa === null ? 'Unavailable' : `${(altimeterHpa * 0.029529983).toFixed(2)} inHg`,
    metar: typeof metar.rawOb === 'string' ? metar.rawOb : 'METAR unavailable',
    taf: typeof taf.rawTAF === 'string' ? taf.rawTAF : '',
    tafValidity: taf.validTimeFrom && taf.validTimeTo ? `${formatForecastTime(taf.validTimeFrom)} to ${formatForecastTime(taf.validTimeTo)}` : '',
    clouds,
    forecast: normalizeForecast(taf.fcsts),
    runways: normalizeAirportRunways(airport.runways, typeof metar.icaoId === 'string' ? metar.icaoId : WEATHER_STATION, airport.magdec, airport.source),
    isOfficial: true
  };
};

const OPEN_METEO_CONDITIONS: Record<number, string> = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Freezing fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers', 95: 'Thunderstorm'
};

const getOpenMeteoFallback = async (): Promise<WeatherSnapshot> => {
  const response = await fetch(DASHBOARD_WEATHER_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Weather snapshot failed (${response.status})`);
  const payload = await response.json();
  const current = recordOrEmpty(payload.current);
  const temperature = numberOrNull(current.temperature_2m);
  const dewpoint = numberOrNull(current.dew_point_2m);
  const direction = numberOrNull(current.wind_direction_10m);
  const speed = numberOrNull(current.wind_speed_10m);
  const gusts = numberOrNull(current.wind_gusts_10m);
  const visibilityMetres = numberOrNull(current.visibility);
  const weatherCode = numberOrNull(current.weather_code);
  const cloudCover = numberOrNull(current.cloud_cover);
  const observed = typeof current.time === 'string'
    ? new Date(current.time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Unknown';
  return {
    station: WEATHER_STATION,
    airportName: 'Victoria International Airport',
    flightCategory: 'WX',
    temperature: formatTemperature(temperature),
    temperatureC: temperature,
    dewpoint: formatTemperature(dewpoint),
    wind: `${formatDirection(direction)} at ${formatSpeed(speed)}${gusts === null ? '' : `, gusting ${Math.round(gusts)} kt`}`,
    windDirection: direction,
    windSpeedKt: speed,
    windGustKt: gusts,
    windSpeed: formatSpeed(speed),
    gusts: formatSpeed(gusts),
    visibility: visibilityMetres === null ? 'Unavailable' : `${(visibilityMetres / 1609.344).toFixed(1)} SM`,
    conditions: weatherCode === null ? 'Current conditions' : OPEN_METEO_CONDITIONS[weatherCode] ?? 'Current conditions',
    observed,
    ceiling: 'Unavailable',
    altimeter: 'Unavailable',
    metar: `Official METAR unavailable. Showing nearby model conditions with ${cloudCover === null ? 'unknown' : `${Math.round(cloudCover)}%`} cloud cover.`,
    taf: '',
    tafValidity: '',
    clouds: [],
    forecast: [],
    runways: CYYJ_RUNWAYS,
    isOfficial: false
  };
};

export const getDashboardWeatherSnapshot = async (station = WEATHER_STATION): Promise<WeatherSnapshot> => {
  const safeStation = station.trim().toUpperCase();
  if (!/^[A-Z]{4}$/.test(safeStation)) throw new Error('Enter a valid four-letter ICAO airport code.');
  try {
    const response = await fetch(`/api/weather?station=${encodeURIComponent(safeStation)}`, { cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Aviation weather proxy unavailable.');
    return normalizeAviationWeather(await response.json());
  } catch {
    if (safeStation === WEATHER_STATION) return getOpenMeteoFallback();
    throw new Error(`No current aviation weather was found for ${safeStation}.`);
  }
};
