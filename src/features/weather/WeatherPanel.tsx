import { Cloud, ExternalLink, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDashboardWeatherSnapshot, METAR_LIVE_URL, WEATHER_STATION, type WeatherSnapshot } from './weather';

export const WeatherPanel = () => {
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const refresh = async () => {
    setStatus('loading');
    try { setSnapshot(await getDashboardWeatherSnapshot()); setStatus('idle'); } catch { setStatus('error'); }
  };
  useEffect(() => { void refresh(); }, []);
  return <section className="panel weather-panel">
    <div className="panel-heading"><div><span className="eyebrow">{WEATHER_STATION}</span><h2>Victoria Weather</h2></div><div className="button-row"><button className="icon-button" onClick={refresh} aria-label="Refresh weather"><RefreshCw size={17} /></button><a className="icon-button" href={METAR_LIVE_URL} target="_blank" rel="noreferrer" aria-label="Open METAR.Live"><ExternalLink size={17} /></a></div></div>
    {snapshot ? <div className="weather-cockpit">
      <div className="weather-now"><Cloud size={58} /><div><strong>{snapshot.temperature}</strong><span>{snapshot.cloudCover} cloud</span></div></div>
      <div className="weather-strip"><div><span>Wind</span><strong>{snapshot.wind}</strong></div><div><span>Visibility</span><strong>{snapshot.visibility}</strong></div><div><span>Ceiling</span><strong>{snapshot.ceiling}</strong></div><div><span>Altimeter</span><strong>{snapshot.altimeter}</strong></div></div>
      <div className="metar-row"><span>METAR</span><strong>{snapshot.metar}</strong><small>Updated {snapshot.observed}</small></div>
    </div> : <p className={status === 'error' ? 'status warning' : 'status'}>{status === 'error' ? 'Dashboard weather unavailable. Open METAR.Live for the live panel.' : 'Loading CYYJ weather...'}</p>}
  </section>;
};
