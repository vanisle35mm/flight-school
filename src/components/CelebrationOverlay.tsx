import { PlaneTakeoff, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FLIGHT_SCHOOL_CELEBRATION_EVENT, type FlightSchoolCelebration } from '../lib/celebrations';

const milestoneCelebrationLines = [
  'Nice work. Avionics check green.',
  'Good job, Captain. That one is logged.',
  'Checklist item complete. Smooth flying.',
  'Clean pass. The panel likes what it sees.',
  'Progress captured. Keep the prop turning.'
];
const phaseCelebrationLines = [
  'Stage complete. Flight path updated.',
  'Big checkpoint crossed. That deserves a proper radio call.',
  'Phase complete. You are building real momentum.',
  'Nice work, Captain. This stage is in the logbook.',
  'Milestone stack cleared. On to the next heading.'
];

const pickCelebrationLine = (type: FlightSchoolCelebration['type']) => {
  const lines = type === 'phase' ? phaseCelebrationLines : milestoneCelebrationLines;
  return lines[Math.floor(Math.random() * lines.length)];
};

export const CelebrationOverlay = () => {
  const [queue, setQueue] = useState<FlightSchoolCelebration[]>([]);
  const [celebration, setCelebration] = useState<FlightSchoolCelebration | null>(null);

  useEffect(() => {
    const onCelebrate = (event: Event) => {
      const detail = (event as CustomEvent<FlightSchoolCelebration>).detail;
      if (!detail?.title) return;
      setQueue((current) => [...current, detail]);
    };
    window.addEventListener(FLIGHT_SCHOOL_CELEBRATION_EVENT, onCelebrate);
    return () => window.removeEventListener(FLIGHT_SCHOOL_CELEBRATION_EVENT, onCelebrate);
  }, []);

  useEffect(() => {
    if (celebration || !queue.length) return;
    const [nextCelebration, ...remainingCelebrations] = queue;
    setCelebration(nextCelebration);
    setQueue(remainingCelebrations);
  }, [celebration, queue]);

  useEffect(() => {
    if (!celebration) return;
    const timeout = window.setTimeout(() => setCelebration(null), celebration.type === 'phase' ? 5200 : 3800);
    return () => window.clearTimeout(timeout);
  }, [celebration]);

  if (!celebration) return null;
  const message = celebration.message || pickCelebrationLine(celebration.type);

  return <div className={`roadmap-celebration ${celebration.type}`} role="status" aria-live="polite">
    <span className="celebration-confetti" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
    </span>
    <section className="celebration-card">
      <span className="celebration-sweep" aria-hidden="true" />
      <span className="celebration-icon" aria-hidden="true">
        {celebration.type === 'phase' ? <PlaneTakeoff size={42} /> : <Sparkles size={34} />}
      </span>
      <span className="celebration-copy">
        <small>{celebration.type === 'phase' ? 'Stage Cleared' : 'Good Job, Captain'}</small>
        <strong>{celebration.title}</strong>
        <em>{celebration.type === 'phase' ? 'Flight phase complete' : 'Logbook stamp earned'}</em>
        <span>{message}</span>
      </span>
    </section>
  </div>;
};
