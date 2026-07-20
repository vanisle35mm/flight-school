import { PlaneTakeoff } from 'lucide-react';

export const FlightSchoolLogo = ({ compact = false }: { compact?: boolean }) => (
  <div className={compact ? 'flight-school-logo compact' : 'flight-school-logo'}>
    <span className="flight-school-emblem" aria-hidden="true">
      <span className="emblem-wing left" />
      <PlaneTakeoff size={compact ? 22 : 28} strokeWidth={2.4} />
      <span className="emblem-wing right" />
    </span>
    <span className="flight-school-wordmark">Flight School</span>
  </div>
);
