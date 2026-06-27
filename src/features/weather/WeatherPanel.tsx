import { CloudSun, Compass, Droplets, ExternalLink, Eye, Gauge, Layers3, Maximize2, Navigation, RefreshCw, Wind } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { getDashboardWeatherSnapshot, METAR_REFERENCE_URL, WEATHER_STATION, type WeatherSnapshot } from './weather';

type WeatherPanelProps = {
  compact?: boolean;
  onOpenWeather?: () => void;
};

const getCategoryClass = (category: string) => `flight-category flight-category-${category.toLowerCase().replace(/[^a-z]/g, '') || 'na'}`;

export const WeatherPanel = ({ compact = false, onOpenWeather }: WeatherPanelProps) => {
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const refresh = async () => {
    setStatus('loading');
    try {
      setSnapshot(await getDashboardWeatherSnapshot());
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };
  useEffect(() => { void refresh(); }, []);

  const controls = <div className="button-row weather-actions">
    {compact && onOpenWeather && <button className="icon-button" onClick={onOpenWeather} aria-label="Open full weather page" title="Open full weather page"><Maximize2 size={17} /></button>}
    <button className={status === 'loading' ? 'icon-button refreshing' : 'icon-button'} onClick={refresh} aria-label="Refresh weather" title="Refresh weather"><RefreshCw size={17} /></button>
    {!compact && <a className="icon-button" href={METAR_REFERENCE_URL} target="_blank" rel="noreferrer" aria-label="Open CYYJ on METAR-TAF.com" title="Open CYYJ on METAR-TAF.com"><ExternalLink size={17} /></a>}
  </div>;

  if (!snapshot) return <section className={compact ? 'panel weather-panel weather-panel-compact' : 'panel weather-panel weather-panel-full'}>
    <div className="panel-heading"><div><span className="eyebrow">{WEATHER_STATION}</span><h2>{compact ? 'Victoria Weather' : 'Victoria International'}</h2></div>{controls}</div>
    <p className={status === 'error' ? 'status warning' : 'status'}>{status === 'error' ? 'CYYJ weather is temporarily unavailable.' : 'Loading CYYJ weather...'}</p>
  </section>;

  const windStyle = { '--wind-angle': `${snapshot.windDirection ?? 0}deg` } as CSSProperties;

  if (compact) return <section className="panel weather-panel weather-panel-compact">
    <div className="panel-heading">
      <div><span className="eyebrow">{snapshot.station} Weather</span><h2>{snapshot.airportName}</h2></div>
      {controls}
    </div>
    <div className="compact-weather-layout">
      <div className="compact-weather-primary">
        <span className={getCategoryClass(snapshot.flightCategory)}>{snapshot.flightCategory}</span>
        <CloudSun size={44} aria-hidden="true" />
        <div><strong>{snapshot.temperature}</strong><span>{snapshot.conditions}</span></div>
      </div>
      <div className="compact-wind">
        <div className="wind-mini-dial" style={windStyle}><Navigation size={20} /></div>
        <div><span>Wind</span><strong>{snapshot.wind}</strong></div>
      </div>
      <div className="compact-weather-metrics">
        <div><Eye size={16} /><span>Visibility</span><strong>{snapshot.visibility}</strong></div>
        <div><Layers3 size={16} /><span>Ceiling</span><strong>{snapshot.ceiling}</strong></div>
        <div><Gauge size={16} /><span>Altimeter</span><strong>{snapshot.altimeter}</strong></div>
      </div>
      <div className="compact-metar"><span>METAR</span><strong>{snapshot.metar}</strong><small>{snapshot.observed}</small></div>
    </div>
  </section>;

  return <section className="panel weather-panel weather-panel-full">
    <div className="panel-heading weather-page-heading">
      <div><span className="eyebrow">Current Airport Conditions</span><h2>{snapshot.station} / {snapshot.airportName}</h2><p>Observed {snapshot.observed}</p></div>
      {controls}
    </div>

    <div className="weather-overview">
      <div className="weather-condition-block">
        <span className={getCategoryClass(snapshot.flightCategory)}>{snapshot.flightCategory}</span>
        <CloudSun size={60} aria-hidden="true" />
        <div><strong>{snapshot.temperature}</strong><span>{snapshot.conditions}</span><small>{snapshot.isOfficial ? 'Official airport observation' : 'Nearby model conditions'}</small></div>
      </div>
      <div className="wind-instrument">
        <div className="wind-dial" style={windStyle} aria-label={`Wind from ${snapshot.windDirection ?? 'variable'} degrees`}>
          <span className="wind-north">N</span><span className="wind-east">E</span><span className="wind-south">S</span><span className="wind-west">W</span>
          <Navigation size={35} />
        </div>
        <div><span>Surface wind</span><strong>{snapshot.windSpeed}</strong><small>{snapshot.windDirection === null ? 'Variable direction' : `From ${String(Math.round(snapshot.windDirection)).padStart(3, '0')} deg`}{snapshot.gusts === 'Unavailable' ? '' : ` / Gusts ${snapshot.gusts}`}</small></div>
      </div>
    </div>

    <div className="weather-metric-grid">
      <div><Eye size={21} /><span>Visibility</span><strong>{snapshot.visibility}</strong></div>
      <div><Layers3 size={21} /><span>Ceiling</span><strong>{snapshot.ceiling}</strong></div>
      <div><Droplets size={21} /><span>Dew point</span><strong>{snapshot.dewpoint}</strong></div>
      <div><Gauge size={21} /><span>Altimeter</span><strong>{snapshot.altimeter}</strong></div>
    </div>

    <section className="aviation-report-band">
      <div className="weather-section-heading"><div><Compass size={20} /><h3>Latest METAR</h3></div><span>{snapshot.isOfficial ? 'Aviation Weather Center' : 'Fallback conditions'}</span></div>
      <p className="raw-weather-report">{snapshot.metar}</p>
    </section>

    <div className="weather-detail-grid">
      <section className="weather-detail-section">
        <div className="weather-section-heading"><div><Layers3 size={20} /><h3>Cloud layers</h3></div><span>{snapshot.clouds.length || 0} reported</span></div>
        <div className="cloud-layer-list">
          {snapshot.clouds.length ? snapshot.clouds.map((cloud, index) => <div key={`${cloud.cover}-${cloud.baseFt}-${index}`}><span>{cloud.cover}</span><strong>{cloud.label}</strong><small>{cloud.baseFt === null ? 'Base unavailable' : `${cloud.baseFt.toLocaleString()} ft AGL`}</small></div>) : <p className="empty-state">No official cloud layers are available.</p>}
        </div>
      </section>
      <section className="weather-detail-section">
        <div className="weather-section-heading"><div><Wind size={20} /><h3>Terminal forecast</h3></div><span>{snapshot.tafValidity || 'TAF unavailable'}</span></div>
        <div className="taf-period-list">
          {snapshot.forecast.length ? snapshot.forecast.map((period, index) => <div className="taf-period" key={`${period.change}-${period.from}-${index}`}>
            <span className="taf-change">{period.change}</span>
            <div><strong>{period.from} to {period.to}</strong><span>{period.wind}</span></div>
            <div><strong>{period.visibility}</strong><span>{period.conditions} / {period.clouds}</span></div>
          </div>) : <p className="empty-state">No terminal forecast is available.</p>}
        </div>
      </section>
    </div>

    {snapshot.taf && <section className="aviation-report-band taf-raw-band">
      <div className="weather-section-heading"><div><Wind size={20} /><h3>Raw TAF</h3></div></div>
      <p className="raw-weather-report">{snapshot.taf}</p>
    </section>}
  </section>;
};
