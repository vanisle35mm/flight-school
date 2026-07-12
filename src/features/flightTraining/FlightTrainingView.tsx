import { CalendarPlus, CheckCircle2, Circle, Compass, Eye, HelpCircle, RotateCcw, Save, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createDefaultFlightTrainingData } from '../../lib/storage';
import type { FlightChecklistItem, FlightScheduleEntry, GroundSchoolData } from '../../types';

type FlightPage = 'checklist' | 'panel' | 'outside' | 'schedule';
type WalkaroundMode = 'learn' | 'practice' | 'test';
type WalkaroundArea = {
  id: string;
  title: string;
  shortLabel: string;
  station: string;
  checks: string[];
};

const walkaroundAreas: WalkaroundArea[] = [
  {
    id: 'fuel-oil',
    title: 'Fuel and Oil Checks',
    shortLabel: 'Fuel / Oil',
    station: 'Start at the fuel and engine service points',
    checks: [
      'Visually check fuel levels in all tanks and confirm fuel caps are secure.',
      'Drain fuel sumps and look for water, debris, or incorrect fuel color.',
      'Check oil quantity against the aircraft POH/operator standard and scan cowling area for leaks.'
    ]
  },
  {
    id: 'cabin-docs',
    title: 'Cabin and Documentation',
    shortLabel: 'Cabin',
    station: 'Inside before the exterior circuit',
    checks: [
      'Confirm required documents are on board.',
      'Check fire extinguisher presence and serviceability.',
      'Verify avionics and electrical switches are off before continuing.'
    ]
  },
  {
    id: 'left-wing',
    title: 'Left Wing',
    shortLabel: 'Left Wing',
    station: 'Work from root to tip, then trailing edge back in',
    checks: [
      'Inspect leading edge, wing tip, underside, panels, and tiedown point for damage.',
      'Confirm fuel cap is secure and check the tank vent or drain points as applicable.',
      'Check flap and aileron condition, hinges, freedom of movement, and security.',
      'Confirm landing, navigation, and strobe lights are intact and serviceable.'
    ]
  },
  {
    id: 'right-wing',
    title: 'Right Wing',
    shortLabel: 'Right Wing',
    station: 'Repeat the wing inspection without rushing the duplicate side',
    checks: [
      'Inspect leading edge, wing tip, underside, panels, and tiedown point for damage.',
      'Confirm fuel cap is secure and check the tank vent or drain points as applicable.',
      'Check flap and aileron condition, hinges, freedom of movement, and security.',
      'Confirm landing, navigation, and strobe lights are intact and serviceable.'
    ]
  },
  {
    id: 'fuselage-tail',
    title: 'Fuselage and Tail',
    shortLabel: 'Tail',
    station: 'Move aft along the fuselage to the empennage',
    checks: [
      'Inspect upper and lower fuselage for damage.',
      'Check horizontal stabilizer and elevator movement, hinges, and attachment.',
      'Inspect vertical stabilizer, rudder, antennas, static wicks, and cable integrity.'
    ]
  },
  {
    id: 'landing-gear',
    title: 'Landing Gear',
    shortLabel: 'Gear',
    station: 'Inspect mains and nose gear from low angles',
    checks: [
      'Inspect tires for inflation, cuts, wear, and flat spots.',
      'Check struts, brakes, linkages, and surrounding area for leaks or damage.',
      'Confirm chocks and tie-downs are removed before flight.'
    ]
  },
  {
    id: 'prop-engine',
    title: 'Propeller and Engine Area',
    shortLabel: 'Prop / Engine',
    station: 'Finish around the nose and engine compartment',
    checks: [
      'Inspect propeller and spinner for nicks, cracks, and security.',
      'Check air inlets, air filter, and cowling security.',
      'Look at visible belt and engine-area condition appropriate to the aircraft checklist.'
    ]
  }
];

const today = () => new Date().toISOString().slice(0, 10);
const pctDone = (items: FlightChecklistItem[]) => items.length ? Math.round((items.filter((item) => item.checked).length / items.length) * 100) : 0;

export const FlightTrainingView = ({ data, onDataChange, page }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; page: FlightPage }) => {
  const [selectedWalkaroundAreaId, setSelectedWalkaroundAreaId] = useState(walkaroundAreas[0].id);
  const [walkaroundMode, setWalkaroundMode] = useState<WalkaroundMode>('practice');
  const [walkaroundAnswer, setWalkaroundAnswer] = useState('');
  const [walkaroundRevealed, setWalkaroundRevealed] = useState(false);
  const flightTraining = data.flightTraining ?? createDefaultFlightTrainingData();
  const nextFlight = useMemo(() => flightTraining.schedule
    .filter((entry) => !entry.completed)
    .sort((left, right) => (left.date || '9999').localeCompare(right.date || '9999'))[0], [flightTraining.schedule]);

  const updateFlightTraining = (patch: Partial<typeof flightTraining>) => {
    onDataChange({ ...data, flightTraining: { ...flightTraining, ...patch } });
  };

  const updateChecklist = (kind: 'checklist' | 'outsideChecks', itemId: string, checked: boolean) => {
    const existing = flightTraining[kind].some((item) => item.id === itemId);
    if (!existing) {
      const area = walkaroundAreas.find((item) => item.id === itemId);
      updateFlightTraining({
        [kind]: [...flightTraining[kind], { id: itemId, label: area?.title ?? itemId, checked }]
      });
      return;
    }
    updateFlightTraining({
      [kind]: flightTraining[kind].map((item) => item.id === itemId ? { ...item, checked } : item)
    });
  };

  const resetChecklist = (kind: 'checklist' | 'outsideChecks') => {
    updateFlightTraining({
      [kind]: flightTraining[kind].map((item) => ({ ...item, checked: false }))
    });
  };

  const updatePanel = (patch: Partial<typeof flightTraining.panelPractice>) => {
    updateFlightTraining({ panelPractice: { ...flightTraining.panelPractice, ...patch } });
  };

  const addFlight = () => {
    const entry: FlightScheduleEntry = {
      id: `flight-${Date.now()}`,
      date: today(),
      aircraft: 'C172',
      instructor: '',
      focus: 'Circuit practice',
      notes: '',
      completed: false
    };
    updateFlightTraining({ schedule: [entry, ...flightTraining.schedule] });
  };

  const updateFlight = (flightId: string, patch: Partial<FlightScheduleEntry>) => {
    updateFlightTraining({ schedule: flightTraining.schedule.map((entry) => entry.id === flightId ? { ...entry, ...patch } : entry) });
  };

  const deleteFlight = (flightId: string) => {
    updateFlightTraining({ schedule: flightTraining.schedule.filter((entry) => entry.id !== flightId) });
  };
  const selectWalkaroundArea = (areaId: string) => {
    setSelectedWalkaroundAreaId(areaId);
    setWalkaroundAnswer('');
    setWalkaroundRevealed(false);
  };
  const setMode = (mode: WalkaroundMode) => {
    setWalkaroundMode(mode);
    setWalkaroundAnswer('');
    setWalkaroundRevealed(mode === 'learn');
  };
  const selectedWalkaroundArea = walkaroundAreas.find((area) => area.id === selectedWalkaroundAreaId) ?? walkaroundAreas[0];
  const completedWalkaroundIds = new Set(flightTraining.outsideChecks.filter((item) => item.checked).map((item) => item.id));
  const walkaroundProgressItems = walkaroundAreas.map((area) => ({ id: area.id, label: area.title, checked: completedWalkaroundIds.has(area.id) }));
  const walkaroundProgress = pctDone(walkaroundProgressItems);
  const checksVisible = walkaroundMode === 'learn' || walkaroundRevealed;

  return <section className="flight-training-module">
    <div className="flight-training-hero">
      <div>
        <span className="eyebrow">Flight Training Module</span>
        <h2>{page === 'checklist' ? 'Checklist' : page === 'panel' ? 'C172 Panel' : page === 'outside' ? 'Outside Checks' : 'Flight Schedule'}</h2>
        <p>{nextFlight ? `Next flight: ${nextFlight.date} - ${nextFlight.focus || 'Training flight'}` : 'Build your next flight block.'}</p>
      </div>
      <button onClick={addFlight}><CalendarPlus size={17} />Add Flight</button>
    </div>

    {page === 'checklist' && <section className="panel flight-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">Training Checklist</span><h2>Lesson Readiness</h2></div>
        <button onClick={() => resetChecklist('checklist')}><RotateCcw size={17} />Reset</button>
      </div>
      <div className="flight-progress-row"><strong>{pctDone(flightTraining.checklist)}%</strong><div className="progress"><div className="bar" style={{ width: `${pctDone(flightTraining.checklist)}%` }} /></div></div>
      <div className="flight-checklist-grid">
        {flightTraining.checklist.map((item) => <label className={item.checked ? 'flight-check-item checked' : 'flight-check-item'} key={item.id}>
          <input type="checkbox" checked={item.checked} onChange={(event) => updateChecklist('checklist', item.id, event.target.checked)} />
          <CheckCircle2 size={18} />
          <span>{item.label}</span>
        </label>)}
      </div>
    </section>}

    {page === 'panel' && <section className="panel flight-panel">
      <div className="panel-heading"><div><span className="eyebrow">Cessna 172 Practice</span><h2>Panel Flow Trainer</h2></div><SlidersHorizontal size={22} /></div>
      <div className="c172-panel">
        <div className="instrument-row">
          <div className="round-instrument"><span>Airspeed</span><strong>{flightTraining.panelPractice.airspeed}</strong><small>kt</small></div>
          <div className="round-instrument attitude"><span>Attitude</span><div className="horizon"><b style={{ transform: `rotate(${(flightTraining.panelPractice.heading - 270) / 8}deg)` }} /></div></div>
          <div className="round-instrument"><span>Altimeter</span><strong>{flightTraining.panelPractice.altitude}</strong><small>ft</small></div>
          <div className="round-instrument"><span>Heading</span><strong>{flightTraining.panelPractice.heading}</strong><small>deg</small></div>
        </div>
        <div className="panel-switches">
          <button className={flightTraining.panelPractice.masterOn ? 'active' : ''} onClick={() => updatePanel({ masterOn: !flightTraining.panelPractice.masterOn })}>Master</button>
          <button className={flightTraining.panelPractice.avionicsOn ? 'active' : ''} onClick={() => updatePanel({ avionicsOn: !flightTraining.panelPractice.avionicsOn })}>Avionics</button>
          <button className={flightTraining.panelPractice.fuelPumpOn ? 'active' : ''} onClick={() => updatePanel({ fuelPumpOn: !flightTraining.panelPractice.fuelPumpOn })}>Fuel Pump</button>
        </div>
        <div className="panel-controls">
          <label>Throttle<input type="range" min="0" max="100" value={flightTraining.panelPractice.throttle} onChange={(event) => updatePanel({ throttle: Number(event.target.value), airspeed: Math.round(Number(event.target.value) * 1.1) })} /></label>
          <label>Mixture<input type="range" min="0" max="100" value={flightTraining.panelPractice.mixture} onChange={(event) => updatePanel({ mixture: Number(event.target.value) })} /></label>
          <label>Flaps<select value={flightTraining.panelPractice.flaps} onChange={(event) => updatePanel({ flaps: Number(event.target.value) })}><option value={0}>0 deg</option><option value={10}>10 deg</option><option value={20}>20 deg</option><option value={30}>30 deg</option></select></label>
          <label>Heading<input type="number" min="0" max="359" value={flightTraining.panelPractice.heading} onChange={(event) => updatePanel({ heading: Number(event.target.value) })} /></label>
          <label>Altitude<input type="number" step="100" value={flightTraining.panelPractice.altitude} onChange={(event) => updatePanel({ altitude: Number(event.target.value) })} /></label>
        </div>
      </div>
    </section>}

    {page === 'outside' && <section className="panel flight-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">Ramp Practice</span><h2>Outside Checks</h2><p>Practice the walkaround without the airplane.</p></div>
        <button onClick={() => resetChecklist('outsideChecks')}><RotateCcw size={17} />Reset</button>
      </div>
      <div className="walkaround-mode-tabs" role="tablist" aria-label="Outside checks mode">
        {(['learn', 'practice', 'test'] as WalkaroundMode[]).map((mode) => <button
          className={walkaroundMode === mode ? 'active' : ''}
          key={mode}
          onClick={() => setMode(mode)}
          type="button"
        >
          {mode}
        </button>)}
      </div>
      <div className="walkaround-practice-layout">
        <div className="walkaround-map-panel">
          <div className="walkaround-aircraft" aria-label="Cessna 172 walkaround practice zones">
            <span className="aircraft-shadow" />
            <span className="aircraft-part fuselage" />
            <span className="aircraft-part cabin" />
            <span className="aircraft-part nose" />
            <span className="aircraft-part tail" />
            <span className="aircraft-part left-wing" />
            <span className="aircraft-part right-wing" />
            <span className="aircraft-part left-gear" />
            <span className="aircraft-part right-gear" />
            <span className="aircraft-part nose-gear" />
            {walkaroundAreas.map((area) => <button className={selectedWalkaroundArea.id === area.id ? `walkaround-hotspot ${area.id} active` : `walkaround-hotspot ${area.id}`} key={area.id} onClick={() => selectWalkaroundArea(area.id)} aria-pressed={selectedWalkaroundArea.id === area.id}>
              <span>{area.shortLabel}</span>
              {completedWalkaroundIds.has(area.id) && <CheckCircle2 size={15} />}
            </button>)}
          </div>
          <div className="walkaround-progress">
            <strong>{walkaroundProgress}%</strong>
            <div className="progress"><div className="bar" style={{ width: `${walkaroundProgress}%` }} /></div>
          </div>
        </div>
        <div className="walkaround-detail-card">
          <div className="walkaround-detail-heading">
            <div><span className="eyebrow">{selectedWalkaroundArea.station}</span><h3>{selectedWalkaroundArea.title}</h3></div>
            <label className="walkaround-complete-toggle">
              <input type="checkbox" checked={completedWalkaroundIds.has(selectedWalkaroundArea.id)} onChange={(event) => updateChecklist('outsideChecks', selectedWalkaroundArea.id, event.target.checked)} />
              Complete
            </label>
          </div>
          <div className="walkaround-practice-card">
            <div className="walkaround-question"><HelpCircle size={24} /><strong>What are you checking here?</strong></div>
            {walkaroundMode !== 'learn' && <textarea value={walkaroundAnswer} onChange={(event) => setWalkaroundAnswer(event.target.value)} placeholder="Type your answer before revealing the checks..." />}
            {walkaroundMode !== 'learn' && <button className="walkaround-reveal-button" onClick={() => setWalkaroundRevealed((revealed) => !revealed)} type="button"><Eye size={17} />{walkaroundRevealed ? 'Hide Checks' : 'Reveal Checks'}</button>}
            <div className={checksVisible ? 'walkaround-check-list' : 'walkaround-check-list hidden'}>
              {selectedWalkaroundArea.checks.map((check, index) => <div className="walkaround-check-row" key={check}>
                {checksVisible ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                <p>{checksVisible ? check : `Hidden check ${index + 1}`}</p>
              </div>)}
            </div>
          </div>
          <div className="walkaround-area-strip">
            <div className="walkaround-progress-summary"><span>Walkaround Progress</span><strong>{flightTraining.outsideChecks.filter((item) => walkaroundAreas.some((area) => area.id === item.id) && item.checked).length}/{walkaroundAreas.length}</strong></div>
            {walkaroundAreas.map((area) => <button className={selectedWalkaroundArea.id === area.id ? 'active' : ''} key={area.id} onClick={() => selectWalkaroundArea(area.id)}>{completedWalkaroundIds.has(area.id) ? <CheckCircle2 size={14} /> : <Circle size={14} />}{area.shortLabel}</button>)}
          </div>
        </div>
      </div>
    </section>}

    {page === 'schedule' && <section className="panel flight-panel">
      <div className="panel-heading"><div><span className="eyebrow">Flight Schedule</span><h2>Flight Notes</h2></div><button onClick={addFlight}><CalendarPlus size={17} />Add</button></div>
      <div className="flight-schedule-list">
        {flightTraining.schedule.length ? flightTraining.schedule.map((entry) => <article className={entry.completed ? 'flight-schedule-card completed' : 'flight-schedule-card'} key={entry.id}>
          <div className="flight-schedule-grid">
            <label>Date<input type="date" value={entry.date} onChange={(event) => updateFlight(entry.id, { date: event.target.value })} /></label>
            <label>Aircraft<input value={entry.aircraft} onChange={(event) => updateFlight(entry.id, { aircraft: event.target.value })} placeholder="C172" /></label>
            <label>Instructor<input value={entry.instructor} onChange={(event) => updateFlight(entry.id, { instructor: event.target.value })} placeholder="Instructor" /></label>
            <label>Focus<input value={entry.focus} onChange={(event) => updateFlight(entry.id, { focus: event.target.value })} placeholder="Circuits, steep turns..." /></label>
          </div>
          <label>Notes<textarea value={entry.notes} onChange={(event) => updateFlight(entry.id, { notes: event.target.value })} placeholder="What to brief, what to review, post-flight notes..." /></label>
          <div className="button-row">
            <button onClick={() => updateFlight(entry.id, { completed: !entry.completed })}><Save size={16} />{entry.completed ? 'Reopen' : 'Complete'}</button>
            <button className="danger-button" onClick={() => deleteFlight(entry.id)}>Delete</button>
          </div>
        </article>) : <div className="empty-workspace"><Compass size={28} /><p className="empty-state">No flight notes yet.</p><button onClick={addFlight}><CalendarPlus size={17} />Add Flight</button></div>}
      </div>
    </section>}
  </section>;
};
