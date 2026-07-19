import { CalendarPlus, CheckCircle2, Circle, Compass, Eye, HelpCircle, RotateCcw, Save, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState, type CSSProperties } from 'react';
import c172sPanelImage from '../../assets/c172s-navii-panel.png';
import walkaroundAircraft from '../../assets/walkaround-aircraft-topdown.png';
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
type PanelHotspot = {
  id: string;
  label: string;
  title: string;
  zone: string;
  style: CSSProperties;
  notes: string[];
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

const panelHotspots: PanelHotspot[] = [
  {
    id: 'six-pack',
    label: 'Six Pack',
    title: 'Primary Flight Instruments',
    zone: 'Scan from left to right, then support with engine and navigation instruments.',
    style: { left: '20%', top: '20%', width: '25%', height: '37%' },
    notes: [
      'Airspeed, attitude, altimeter, turn coordinator, heading indicator, and VSI form the main instrument scan.',
      'Use this area for attitude, altitude, heading, airspeed, and trend cross-checks.',
      'During flows, confirm the required instruments are set before taxi, takeoff, and approach.'
    ]
  },
  {
    id: 'engine-gauges',
    label: 'Engine',
    title: 'Engine Gauges',
    zone: 'Monitor powerplant health before takeoff, in climb, cruise, and before landing.',
    style: { left: '5%', top: '22%', width: '14%', height: '35%' },
    notes: [
      'Check RPM, oil pressure, oil temperature, fuel quantity, and electrical indications.',
      'During run-up, confirm oil pressure and temperature are in the green and the ammeter is sensible.',
      'Use abnormal indications to trigger the aircraft checklist and instructor briefing.'
    ]
  },
  {
    id: 'avionics-stack',
    label: 'NAV/COM',
    title: 'Radio and GPS Stack',
    zone: 'Set communication, navigation, transponder, and GPS before taxi or while workload is low.',
    style: { left: '55%', top: '17%', width: '16%', height: '42%' },
    notes: [
      'Set COM frequencies, NAV aids, GPS route or direct-to, and transponder mode/code.',
      'Keep one radio ready for tower or mandatory frequency and one for monitoring or backup.',
      'Practice saying what each box is doing before pressing buttons.'
    ]
  },
  {
    id: 'mfd',
    label: 'MFD',
    title: 'Multifunction Display',
    zone: 'Use as a situational-awareness aid, not a replacement for outside scan and basic navigation.',
    style: { left: '57%', top: '27%', width: '12%', height: '14%' },
    notes: [
      'Review map, traffic or weather displays when equipped and appropriate.',
      'Cross-check MFD information against the chart, radios, heading, and visual references.',
      'Keep eyes outside during VFR manoeuvring and circuit work.'
    ]
  },
  {
    id: 'switch-row',
    label: 'Switches',
    title: 'Electrical and Light Switch Row',
    zone: 'Work left to right during pre-start, taxi, takeoff, landing, and shutdown flows.',
    style: { left: '2%', top: '71%', width: '42%', height: '16%' },
    notes: [
      'Master, avionics master, fuel pump, pitot heat, beacon, landing, taxi, nav, and strobe lights live here.',
      'Use the aircraft checklist to decide what should be on for each phase.',
      'Verbalize switch changes so the flow is deliberate rather than random.'
    ]
  },
  {
    id: 'throttle-mixture',
    label: 'Power',
    title: 'Throttle and Mixture',
    zone: 'Power controls sit along the lower center panel.',
    style: { left: '45%', top: '72%', width: '19%', height: '16%' },
    notes: [
      'Throttle controls engine power; mixture controls fuel-air ratio.',
      'Practice smooth throttle movements and mixture rich/lean calls by phase of flight.',
      'Confirm mixture rich for run-up, takeoff, and landing unless your instructor/operator procedure says otherwise.'
    ]
  },
  {
    id: 'flaps-trim-fuel',
    label: 'Config',
    title: 'Flaps, Trim, Fuel Selector',
    zone: 'Lower panel: configuration and fuel management controls.',
    style: { left: '63%', top: '70%', width: '20%', height: '18%' },
    notes: [
      'Flap selector, trim wheel, fuel selector, and fuel pump controls are grouped here.',
      'Before takeoff: trim set, flaps set and checked, fuel selector both, fuel shutoff in.',
      'Before landing: fuel selector both, mixture rich, flaps as required, trim as needed.'
    ]
  }
];

export const FlightTrainingView = ({ data, onDataChange, page }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; page: FlightPage }) => {
  const [selectedPanelHotspotId, setSelectedPanelHotspotId] = useState(panelHotspots[0].id);
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
  const completedWalkaroundCount = flightTraining.outsideChecks.filter((item) => walkaroundAreas.some((area) => area.id === item.id) && item.checked).length;
  const checksVisible = walkaroundMode === 'learn' || walkaroundRevealed;
  const selectedPanelHotspot = panelHotspots.find((hotspot) => hotspot.id === selectedPanelHotspotId) ?? panelHotspots[0];

  return <section className="flight-training-module">
    {page !== 'outside' && <div className="flight-training-hero">
      <div>
        <span className="eyebrow">Flight Training Module</span>
        <h2>{page === 'checklist' ? 'Checklist' : page === 'panel' ? 'C172 Panel' : 'Flight Schedule'}</h2>
        <p>{nextFlight ? `Next flight: ${nextFlight.date} - ${nextFlight.focus || 'Training flight'}` : 'Build your next flight block.'}</p>
      </div>
      <button onClick={addFlight}><CalendarPlus size={17} />Add Flight</button>
    </div>}

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
      <div className="panel-heading"><div><span className="eyebrow">Cessna 172S Nav II + MFD</span><h2>Panel Flow Trainer</h2></div><SlidersHorizontal size={22} /></div>
      <div className="c172-panel-real">
        <div className="panel-practice-stage">
          <div className="panel-image-wrap" aria-label="Cessna 172S Nav II cockpit panel practice image">
            <img className="panel-reference-image" src={c172sPanelImage} alt="Cessna 172S-style Nav II cockpit panel practice reference" />
            {panelHotspots.map((hotspot) => <button
              aria-pressed={selectedPanelHotspot.id === hotspot.id}
              className={selectedPanelHotspot.id === hotspot.id ? 'panel-hotspot active' : 'panel-hotspot'}
              key={hotspot.id}
              onClick={() => setSelectedPanelHotspotId(hotspot.id)}
              style={hotspot.style}
              type="button"
            >
              <span>{hotspot.label}</span>
            </button>)}
          </div>
          <aside className="panel-practice-card">
            <span className="eyebrow">{selectedPanelHotspot.zone}</span>
            <h3>{selectedPanelHotspot.title}</h3>
            <div className="panel-practice-notes">
              {selectedPanelHotspot.notes.map((note) => <p key={note}>{note}</p>)}
            </div>
            <div className="panel-flow-controls">
              <button className={flightTraining.panelPractice.masterOn ? 'active' : ''} onClick={() => updatePanel({ masterOn: !flightTraining.panelPractice.masterOn })}>Master</button>
              <button className={flightTraining.panelPractice.avionicsOn ? 'active' : ''} onClick={() => updatePanel({ avionicsOn: !flightTraining.panelPractice.avionicsOn })}>Avionics</button>
              <button className={flightTraining.panelPractice.fuelPumpOn ? 'active' : ''} onClick={() => updatePanel({ fuelPumpOn: !flightTraining.panelPractice.fuelPumpOn })}>Fuel Pump</button>
            </div>
            <div className="panel-flow-readout">
              <span>Throttle {flightTraining.panelPractice.throttle}%</span>
              <span>Mixture {flightTraining.panelPractice.mixture}%</span>
              <span>Flaps {flightTraining.panelPractice.flaps} deg</span>
            </div>
          </aside>
        </div>
      </div>
    </section>}

    {page === 'outside' && <section className="walkaround-page">
      <div className="walkaround-page-heading">
        <div><h2>Outside Checks</h2><p>Practice the walkaround without the airplane.</p></div>
        <button className="walkaround-reset-button" onClick={() => resetChecklist('outsideChecks')}><RotateCcw size={15} />Reset</button>
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
      <div className="walkaround-trainer">
        <div className="walkaround-practice-layout">
          <div className="walkaround-map-panel">
            <div className="walkaround-aircraft" aria-label="Cessna 172 walkaround practice zones">
              <img className="walkaround-aircraft-image" src={walkaroundAircraft} alt="" aria-hidden="true" />
              {walkaroundAreas.map((area) => <button className={selectedWalkaroundArea.id === area.id ? `walkaround-hotspot ${area.id} active` : `walkaround-hotspot ${area.id}`} key={area.id} onClick={() => selectWalkaroundArea(area.id)} aria-pressed={selectedWalkaroundArea.id === area.id}>
                <span>{walkaroundMode === 'test' && selectedWalkaroundArea.id !== area.id ? 'Identify' : area.shortLabel}</span>
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
              <div><span className="eyebrow">{selectedWalkaroundArea.station}</span><h3>{walkaroundMode === 'test' ? 'Identify this inspection point' : selectedWalkaroundArea.title}</h3></div>
            </div>
            <div className="walkaround-practice-card">
              <div className="walkaround-question"><HelpCircle size={24} /><strong>{walkaroundMode === 'test' ? 'Which zone is this, and what do you check?' : 'What are you checking here?'}</strong></div>
              {walkaroundMode !== 'learn' && <textarea value={walkaroundAnswer} onChange={(event) => setWalkaroundAnswer(event.target.value)} placeholder="Type your answer before revealing the checks..." />}
              {walkaroundMode !== 'learn' && <button className="walkaround-reveal-button" onClick={() => setWalkaroundRevealed((revealed) => !revealed)} type="button"><Eye size={17} />{walkaroundRevealed ? 'Hide Checks' : 'Reveal Checks'}</button>}
              <span className="walkaround-preview-label">Checklist preview</span>
              <div className={checksVisible ? 'walkaround-check-list' : 'walkaround-check-list hidden'}>
                {selectedWalkaroundArea.checks.map((check, index) => <div className="walkaround-check-row" key={check}>
                  {checksVisible ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  <p>{checksVisible ? check : `Hidden check ${index + 1}`}</p>
                </div>)}
              </div>
              <label className={completedWalkaroundIds.has(selectedWalkaroundArea.id) ? 'walkaround-complete-toggle complete' : 'walkaround-complete-toggle'}>
                <input type="checkbox" checked={completedWalkaroundIds.has(selectedWalkaroundArea.id)} onChange={(event) => updateChecklist('outsideChecks', selectedWalkaroundArea.id, event.target.checked)} />
                {completedWalkaroundIds.has(selectedWalkaroundArea.id) ? 'Completed' : 'Mark zone complete'}
              </label>
            </div>
          </div>
        </div>
        <div className="walkaround-route">
          <div className="walkaround-progress-summary"><span>Walkaround Progress</span><div className="walkaround-progress-dial" style={{ '--walkaround-progress': `${walkaroundProgress}%` } as CSSProperties}><strong>{completedWalkaroundCount}/{walkaroundAreas.length}</strong></div></div>
          {walkaroundAreas.map((area, index) => <button
            className={completedWalkaroundIds.has(area.id) ? 'done' : selectedWalkaroundArea.id === area.id ? 'active' : ''}
            key={area.id}
            onClick={() => selectWalkaroundArea(area.id)}
          >
            <span>{completedWalkaroundIds.has(area.id) ? <CheckCircle2 size={18} /> : null}</span>
            <b>{area.shortLabel}</b>
          </button>)}
          <div className="walkaround-route-legend">
            <span><i className="complete" />Complete</span>
            <span><i className="current" />Current</span>
            <span><i className="review" />Review</span>
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
