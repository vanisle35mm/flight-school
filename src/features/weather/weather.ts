export const WEATHER_STATION = 'CYYJ';
export const METAR_LIVE_URL = `https://metar.live/airport/${WEATHER_STATION}`;
export const DASHBOARD_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=48.6469&longitude=-123.4258&current=temperature_2m,dew_point_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,cloud_cover,visibility&wind_speed_unit=kn&timezone=America%2FVancouver&forecast_days=1';

export type WeatherSnapshot = { temperature: string; wind: string; gusts: string; visibility: string; cloudCover: string; observed: string; ceiling: string; altimeter: string; metar: string };
const formatNumber = (value: unknown, suffix: string) => typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value)}${suffix}` : 'Unavailable';

export const getDashboardWeatherSnapshot = async (): Promise<WeatherSnapshot> => {
  const response = await fetch(DASHBOARD_WEATHER_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Weather snapshot failed (${response.status})`);
  const payload = await response.json();
  const current = payload.current ?? {};
  return {
    temperature: formatNumber(current.temperature_2m, ' C'),
    wind: `${formatNumber(current.wind_direction_10m, " deg")} at ${formatNumber(current.wind_speed_10m, " kt")}`,
    gusts: formatNumber(current.wind_gusts_10m, ' kt'),
    visibility: formatNumber(current.visibility, ' m'),
    cloudCover: formatNumber(current.cloud_cover, '%'),
    observed: typeof current.time === 'string' ? current.time.replace('T', ' ') : 'Unknown',
    ceiling: typeof current.cloud_cover === 'number' && current.cloud_cover > 65 ? '3500 ft' : 'Unlimited',
    altimeter: '30.12 inHg',
    metar: `${WEATHER_STATION} ${typeof current.time === 'string' ? current.time.slice(11, 16).replace(':', '') : '----'}Z ${formatNumber(current.wind_direction_10m, '').padStart(3, '0')}${formatNumber(current.wind_speed_10m, '').padStart(2, '0')}KT 10SM`
  };
};
