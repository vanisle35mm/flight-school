import { Check, LoaderCircle, MapPin } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { FlightSchoolLogo } from '../../components/FlightSchoolLogo';
import { getDashboardWeatherSnapshot, saveWeatherSummary } from '../weather/weather';
import type { GroundSchoolUser } from '../../types';

const COMMON_AIRPORTS = [
  ['CYYJ', 'Victoria International'],
  ['CYVR', 'Vancouver International'],
  ['CYCD', 'Nanaimo'],
  ['CYQQ', 'Comox Valley'],
  ['CYLW', 'Kelowna International'],
  ['CYYZ', 'Toronto Pearson'],
  ['KSEA', 'Seattle-Tacoma International']
];

type AirportOnboardingProps = {
  user: GroundSchoolUser;
  onComplete: (airport: string) => void;
};

export const AirportOnboarding = ({ user, onComplete }: AirportOnboardingProps) => {
  const [airport, setAirport] = useState('');
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);

  const submit = async () => {
    const code = airport.trim().toUpperCase();
    if (!/^[A-Z]{4}$/.test(code)) {
      setMessage('Enter a four-letter ICAO airport code, such as CYYJ.');
      return;
    }

    setChecking(true);
    setMessage('');
    try {
      const snapshot = await getDashboardWeatherSnapshot(code);
      saveWeatherSummary({ station: snapshot.station, temperature: snapshot.temperature });
      onComplete(snapshot.station);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Airport ${code} could not be found.`);
      setChecking(false);
    }
  };

  const submitOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') void submit();
  };

  return <main className="airport-setup-screen">
    <section className="airport-setup-panel">
      <div className="login-brand"><FlightSchoolLogo /></div>
      <div className="airport-setup-heading">
        <span className="eyebrow">Welcome aboard</span>
        <h1>Good to have you here, Captain {user.firstName}.</h1>
        <p>Choose your home airport and we will set up your live weather automatically.</p>
      </div>

      <label className="airport-setup-field" htmlFor="home-airport">
        <span>Home airport ICAO code</span>
        <div className="airport-setup-input">
          <MapPin size={20} aria-hidden="true" />
          <input
            id="home-airport"
            list="common-airports"
            value={airport}
            onChange={(event) => { setAirport(event.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)); setMessage(''); }}
            onKeyDown={submitOnEnter}
            placeholder="CYYJ"
            autoComplete="off"
            autoFocus
            maxLength={4}
          />
        </div>
      </label>
      <datalist id="common-airports">
        {COMMON_AIRPORTS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </datalist>

      {message && <div className="login-message" role="alert">{message}</div>}

      <button className="airport-setup-submit" onClick={() => void submit()} disabled={checking || airport.length !== 4}>
        {checking ? <LoaderCircle className="spin" size={19} /> : <Check size={19} />}
        {checking ? 'Checking airport' : 'Set home airport'}
      </button>
    </section>
  </main>;
};
