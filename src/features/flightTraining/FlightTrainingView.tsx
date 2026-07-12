import { CalendarPlus, CheckCircle2, ClipboardCheck, Compass, Gauge, PlaneTakeoff, RotateCcw, Save, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createDefaultFlightTrainingData } from '../../lib/storage';
import type { FlightChecklistItem, FlightScheduleEntry, GroundSchoolData } from '../../types';

type FlightTab = 'checklist' | 'panel' | 'outside' | 'schedule';

const tabs: Array<{ id: FlightTab; label: string; icon: ReactNode }> = [
  { id: 'checklist', label: 'Checklist', icon: <ClipboardCheck size={17} /> },
  { id: 'panel', label: 'C172 Panel', icon: <Gauge size={17} /> },
  { id: 'outside', label: 'Outside Checks', icon: <PlaneTakeoff size={17} /> },
  { id: 'schedule', label: 'Flight Schedule', icon: <CalendarPlus size={17} /> }
];

const today = () => new Date().toISOString().slice(0, 10);
const pctDone = (items: FlightChecklistItem[]) => items.length ? Math.round((items.filter((item) => item.checked).length / items.length) * 100) : 0;

export const FlightTrainingView = ({ data, onDataChange }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void }) => {
  const [tab, setTab] = useState<FlightTab>('checklist');
  const flightTraining = data.flightTraining ?? createDefaultFlightTrainingData();
  const nextFlight = useMemo(() => flightTraining.schedule
    .filter((entry) => !entry.completed)
    .sort((left, right) => (left.date || '9999').localeCompare(right.date || '9999'))[0], [flightTraining.schedule]);

  const updateFlightTraining = (patch: Partial<typeof flightTraining>) => {
    onDataChange({ ...data, flightTraining: { ...flightTraining, ...patch } });
  };

  const updateChecklist = (kind: 'checklist' | 'outsideChecks', itemId: string, checked: boolean) => {
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
    setTab('schedule');
  };

  const updateFlight = (flightId: string, patch: Partial<FlightScheduleEntry>) => {
    updateFlightTraining({ schedule: flightTraining.schedule.map((entry) => entry.id === flightId ? { ...entry, ...patch } : entry) });
  };

  const deleteFlight = (flightId: string) => {
    updateFlightTraining({ schedule: flightTraining.schedule.filter((entry) => entry.id !== flightId) });
  };

  return <section className="flight-training-module">
    <div className="flight-training-hero">
      <div>
        <span className="eyebrow">Flight Training Module</span>
        <h2>Training cockpit</h2>
        <p>{nextFlight ? `Next flight: ${nextFlight.date} - ${nextFlight.focus || 'Training flight'}` : 'Build your next flight block.'}</p>
      </div>
      <button onClick={addFlight}><CalendarPlus size={17} />Add Flight</button>
    </div>

    <div className="flight-tabs" role="tablist" aria-label="Flight training areas">
      {tabs.map((item) => <button className={tab === item.id ? 'active' : ''} key={item.id} onClick={() => setTab(item.id)}>{item.icon}<span>{item.label}</span></button>)}
    </div>

    {tab === 'checklist' && <section className="panel flight-panel">
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

    {tab === 'panel' && <section className="panel flight-panel">
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

    {tab === 'outside' && <section className="panel flight-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">Ramp Practice</span><h2>Outside Checks</h2></div>
        <button onClick={() => resetChecklist('outsideChecks')}><RotateCcw size={17} />Reset</button>
      </div>
      <div className="outside-check-layout">
        <div className="aircraft-walkaround" aria-hidden="true"><span className="wing left" /><span className="fuselage" /><span className="wing right" /><span className="tail" /></div>
        <div className="flight-checklist-grid">
          {flightTraining.outsideChecks.map((item) => <label className={item.checked ? 'flight-check-item checked' : 'flight-check-item'} key={item.id}>
            <input type="checkbox" checked={item.checked} onChange={(event) => updateChecklist('outsideChecks', item.id, event.target.checked)} />
            <CheckCircle2 size={18} />
            <span>{item.label}</span>
          </label>)}
        </div>
      </div>
    </section>}

    {tab === 'schedule' && <section className="panel flight-panel">
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
