import { CloudSun, Compass, Droplets, ExternalLink, Eye, Gauge, Layers3, MapPin, Maximize2, Navigation, PlaneLanding, RefreshCw, Search, Wind } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import { getRunwayWind } from './runways';
import { getDashboardWeatherSnapshot, getStoredWeatherSummary, saveWeatherSummary, WEATHER_STATION, type WeatherSnapshot } from './weather';

type WeatherPanelProps = {
  compact?: boolean;
  onOpenWeather?: () => void;
};

const getCategoryClass = (category: string) => `flight-category flight-category-${category.toLowerCase().replace(/[^a-z]/g, '') || 'na'}`;

export const WeatherPanel = ({ compact = false, onOpenWeather }: WeatherPanelProps) => {
  const initialStation = getStoredWeatherSummary().station;
  const [station, setStation] = useState(initialStation);
  const [stationInput, setStationInput] = useState(initialStation);
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const loadWeather = async (nextStation: string) => {
    setStatus('loading');
    setStatusMessage('');
    try {
      const nextSnapshot = await getDashboardWeatherSnapshot(nextStation);
      setSnapshot(nextSnapshot);
      setStation(nextSnapshot.station);
      setStationInput(nextSnapshot.station);
      saveWeatherSummary({ station: nextSnapshot.station, temperature: nextSnapshot.temperature });
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : `No current aviation weather was found for ${nextStation}.`);
    }
  };
  const refresh = () => void loadWeather(station);
  const changeAirport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextStation = stationInput.trim().toUpperCase();
    setStationInput(nextStation);
    if (!/^[A-Z]{4}$/.test(nextStation)) {
      setStatus('error');
      setStatusMessage('Enter a four-letter ICAO code, such as CYYJ or CYVR.');
      return;
    }
    void loadWeather(nextStation);
  };
  useEffect(() => { void loadWeather(initialStation); }, []);

  const controls = <div className="button-row weather-actions">
    {!compact && <form className="airport-picker" onSubmit={changeAirport}>
      <MapPin size={16} />
      <input aria-label="Airport ICAO code" list="weather-airports" maxLength={4} value={stationInput} onChange={(event) => setStationInput(event.target.value.toUpperCase())} placeholder="ICAO" />
      <datalist id="weather-airports"><option value="CYYJ">Victoria</option><option value="CYVR">Vancouver</option><option value="CYCD">Nanaimo</option><option value="CYQQ">Comox</option><option value="CYLW">Kelowna</option><option value="CYYZ">Toronto</option><option value="KSEA">Seattle</option></datalist>
      <button className="icon-button" type="submit" aria-label="Load airport" title="Load airport"><Search size={16} /></button>
    </form>}
    {compact && onOpenWeather && <button className="icon-button" onClick={onOpenWeather} aria-label="Open full weather page" title="Open full weather page"><Maximize2 size={17} /></button>}
    <button className={status === 'loading' ? 'icon-button refreshing' : 'icon-button'} onClick={refresh} aria-label="Refresh weather" title="Refresh weather"><RefreshCw size={17} /></button>
    {!compact && <a className="icon-button" href={`https://metar-taf.com/metar/${station}`} target="_blank" rel="noreferrer" aria-label={`Open ${station} on METAR-TAF.com`} title={`Open ${station} on METAR-TAF.com`}><ExternalLink size={17} /></a>}
  </div>;

  if (!snapshot) return <section className={compact ? 'panel weather-panel weather-panel-compact' : 'panel weather-panel weather-panel-full'}>
    <div className="panel-heading"><div><span className="eyebrow">{WEATHER_STATION}</span><h2>{compact ? 'Victoria Weather' : 'Victoria International'}</h2></div>{controls}</div>
    <p className={status === 'error' ? 'status warning' : 'status'}>{status === 'error' ? statusMessage || `${stationInput} weather is temporarily unavailable.` : `Loading ${stationInput} weather...`}</p>
  </section>;

  const windStyle = { '--wind-angle': `${snapshot.windDirection ?? 0}deg` } as CSSProperties;
  const runwayWinds = snapshot.runways.map((runway) => getRunwayWind(runway, snapshot.windDirection, snapshot.windSpeedKt));
  const bestRunway = runwayWinds
    .filter((runway) => runway.alignment !== null)
    .sort((left, right) => (left.alignment ?? 180) - (right.alignment ?? 180) || Number(Boolean(right.primary)) - Number(Boolean(left.primary)))[0];

  if (compact) return <section className="panel weather-panel weather-panel-compact">
    <div className="panel-heading">
      <div><span className="eyebrow">{snapshot.station} Weather</span><h2>{snapshot.airportName}</h2></div>
      {controls}
    </div>
    {status === 'error' && <p className="status warning">{statusMessage}</p>}
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
    {status === 'error' && <p className="status warning weather-station-error">{statusMessage}</p>}

    <div className="weather-briefing-layout weather-briefing-layout-simple">
      <section className="weather-now-card">
        <div className="weather-section-heading">
          <div><CloudSun size={20} /><h3>Flight conditions</h3></div>
          <span>{snapshot.isOfficial ? 'Official observation' : 'Nearby model'}</span>
        </div>
        <div className="weather-current-grid">
          <div className="weather-current-primary">
            <span className={getCategoryClass(snapshot.flightCategory)}>{snapshot.flightCategory}</span>
            <CloudSun size={50} aria-hidden="true" />
            <div><strong>{snapshot.temperature}</strong><span>{snapshot.conditions}</span><small>{snapshot.station}</small></div>
          </div>
          <div className="weather-current-wind">
            <div className="wind-mini-dial" style={windStyle}><Navigation size={20} /></div>
            <div><span>Surface wind</span><strong>{snapshot.wind}</strong></div>
          </div>
          <div className="weather-current-metrics">
            <div><Eye size={17} /><span>Visibility</span><strong>{snapshot.visibility}</strong></div>
            <div><Layers3 size={17} /><span>Ceiling</span><strong>{snapshot.ceiling}</strong></div>
            <div><Gauge size={17} /><span>Altimeter</span><strong>{snapshot.altimeter}</strong></div>
          </div>
        </div>
      </section>

      {runwayWinds.length > 0 && <section className="runway-weather-section weather-runway-focus">
        <div className="weather-section-heading">
          <div><PlaneLanding size={20} /><h3>Runway recommendation</h3></div>
          <span>{snapshot.windDirection === null ? 'Variable wind' : `${String(Math.round(snapshot.windDirection)).padStart(3, '0')} deg at ${snapshot.windSpeed}`}</span>
        </div>
        <div className="runway-selector-hero">
          <div>
            <span>Current wind</span>
            <strong>{snapshot.windDirection === null ? 'Variable' : `${String(Math.round(snapshot.windDirection)).padStart(3, '0')} deg`} <small>{snapshot.windSpeed}</small></strong>
            <p>{snapshot.gusts === 'Unavailable' ? 'No gusts reported' : `Gusting ${snapshot.gusts}`}</p>
          </div>
          <div>
            <span>Favoured end</span>
            <strong>{bestRunway?.preferredEnd ? `RWY ${bestRunway.preferredEnd}` : '--'}</strong>
            <p>{bestRunway ? `Best alignment on ${bestRunway.id}` : 'Runway estimate unavailable'}</p>
          </div>
        </div>
        {bestRunway && <article className="runway-selector-card best-runway runway-focus-card">
          <div className="runway-selector-name">
            <span>Recommended runway</span>
            <strong>{bestRunway.id}</strong>
            <small>{bestRunway.lengthFt.toLocaleString()} ft / {bestRunway.surface}</small>
          </div>
          <div className="runway-selector-preferred">
            <span>Use end</span>
            <strong>{bestRunway.preferredEnd ? `RWY ${bestRunway.preferredEnd}` : '--'}</strong>
          </div>
          <div className="runway-selector-metrics">
            <div><span>Headwind</span><strong>{bestRunway.headwindKt === null ? '--' : `${bestRunway.headwindKt} kt`}</strong></div>
            <div><span>Crosswind</span><strong>{bestRunway.crosswindKt === null ? '--' : `${bestRunway.crosswindKt} kt`}</strong></div>
            <div><span>Angle</span><strong>{bestRunway.alignment === null ? '--' : `${bestRunway.alignment} deg`}</strong></div>
          </div>
        </article>}
        <p className="runway-advisory">Wind-favoured estimate only. Confirm the assigned runway with ATIS or ATC.</p>
      </section>}
    </div>

    <div className="weather-accordion-stack">
      <details className="weather-disclosure" open>
        <summary><span><Compass size={18} />METAR</span><small>{snapshot.observed}</small></summary>
        <p className="raw-weather-report">{snapshot.metar}</p>
      </details>

      {snapshot.forecast.length > 0 && <details className="weather-disclosure">
        <summary><span><Wind size={18} />Terminal forecast</span><small>{snapshot.tafValidity || 'TAF unavailable'}</small></summary>
        <div className="taf-period-list">
          {snapshot.forecast.slice(0, 4).map((period, index) => <div className="taf-period" key={`${period.change}-${period.from}-${index}`}>
            <span className="taf-change">{period.change}</span>
            <div><strong>{period.from} to {period.to}</strong><span>{period.wind}</span></div>
            <div><strong>{period.visibility}</strong><span>{period.conditions} / {period.clouds}</span></div>
          </div>)}
        </div>
      </details>}

      {runwayWinds.length > 0 && <details className="weather-disclosure">
        <summary><span><PlaneLanding size={18} />Runway comparison</span><small>{runwayWinds.length} runway sets</small></summary>
        <div className="runway-selector-list">
          {runwayWinds.map((runway) => {
            const isBest = bestRunway?.id === runway.id;
            return <article className={isBest ? 'runway-selector-card best-runway' : 'runway-selector-card'} key={runway.id}>
              <div className="runway-selector-name">
                <span>Runway</span>
                <strong>{runway.id}</strong>
                <small>{runway.lengthFt.toLocaleString()} ft / {runway.surface}</small>
              </div>
              <div className="runway-selector-preferred">
                <span>Favoured end</span>
                <strong>{runway.preferredEnd ? `RWY ${runway.preferredEnd}` : '--'}</strong>
              </div>
              <div className="runway-selector-metrics">
                <div><span>Headwind</span><strong>{runway.headwindKt === null ? '--' : `${runway.headwindKt} kt`}</strong></div>
                <div><span>Crosswind</span><strong>{runway.crosswindKt === null ? '--' : `${runway.crosswindKt} kt`}</strong></div>
                <div><span>Angle</span><strong>{runway.alignment === null ? '--' : `${runway.alignment} deg`}</strong></div>
              </div>
            </article>;
          })}
        </div>
      </details>}

      <details className="weather-disclosure">
        <summary><span><Layers3 size={18} />Clouds and details</span><small>{snapshot.clouds.length ? `${snapshot.clouds.length} layers` : 'No reported layers'}</small></summary>
        <div className="weather-detail-foldout">
          <div className="wind-dial" style={windStyle} aria-label={`Wind from ${snapshot.windDirection ?? 'variable'} degrees`}>
            <span className="wind-north">N</span><span className="wind-east">E</span><span className="wind-south">S</span><span className="wind-west">W</span>
            <Navigation size={35} />
          </div>
          <div className="weather-metric-grid">
            <div><Eye size={19} /><span>Visibility</span><strong>{snapshot.visibility}</strong></div>
            <div><Layers3 size={19} /><span>Ceiling</span><strong>{snapshot.ceiling}</strong></div>
            <div><Droplets size={19} /><span>Dew point</span><strong>{snapshot.dewpoint}</strong></div>
            <div><Gauge size={19} /><span>Altimeter</span><strong>{snapshot.altimeter}</strong></div>
          </div>
          <div className="cloud-layer-list">
            {snapshot.clouds.length ? snapshot.clouds.map((cloud, index) => <div key={`${cloud.cover}-${cloud.baseFt ?? 'unlimited'}-${index}`}>
              <span>{cloud.cover}</span>
              <strong>{cloud.label}</strong>
              <small>{cloud.baseFt === null ? 'No base reported' : `${cloud.baseFt.toLocaleString()} ft`}</small>
            </div>) : <div><span>CLR</span><strong>No significant cloud</strong><small>Ceiling not reported</small></div>}
          </div>
        </div>
      </details>
    </div>
  </section>;
};
