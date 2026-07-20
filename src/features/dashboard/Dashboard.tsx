import type { CSSProperties, ReactNode } from 'react';
import { BookOpen, CalendarCheck, CheckCircle2, ClipboardCheck, FileCheck2, GraduationCap, HeartPulse, Map, RadioTower, ShieldCheck } from 'lucide-react';
import { getStats } from '../../lib/stats';
import type { GroundSchoolData, ViewId } from '../../types';

type MilestoneStatus = 'complete' | 'in-progress' | 'locked' | 'not-started';
type RoadmapMilestone = {
  title: string;
  status: MilestoneStatus;
  helper: string;
  action?: { label: string; view: ViewId };
};
type RoadmapPhase = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  percent: number;
  accent: 'amber' | 'blue' | 'green';
  milestones: RoadmapMilestone[];
};

const statusLabels: Record<MilestoneStatus, string> = {
  complete: 'Complete',
  'in-progress': 'In Progress',
  locked: 'Locked',
  'not-started': 'Not Started'
};

const clampPct = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const getDayPart = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const milestoneIcon = (status: MilestoneStatus) => status === 'complete' ? <CheckCircle2 size={17} /> : <span className="roadmap-dot" aria-hidden="true" />;

export const Dashboard = ({ data, onViewChange }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; onViewChange: (view: ViewId) => void }) => {
  const activeUser = data.users[data.activeUserId];
  const firstName = activeUser?.firstName || 'Pilot';
  const stats = getStats(data);
  const pstarComplete = stats.hasAccuracy && stats.accuracy >= 90;
  const pstarStatus: MilestoneStatus = pstarComplete ? 'complete' : stats.latestPstarAttemptTotal ? 'in-progress' : 'not-started';
  const pstarLabel = pstarComplete ? `${stats.accuracy}% complete` : stats.latestPstarAttemptTotal ? `${stats.accuracy}% best score` : 'Not started';
  const overallPreviewPct = clampPct((stats.classes > 0 ? 8 : 0) + (stats.cards > 0 ? 5 : 0) + (pstarComplete ? 12 : pstarStatus === 'in-progress' ? 5 : 0));

  const phases: RoadmapPhase[] = [
    {
      id: 'foundation',
      number: 1,
      title: 'Foundation',
      subtitle: 'Ground school, medical, first lessons',
      percent: clampPct(18 + Math.min(stats.classes, 8) * 3),
      accent: 'amber',
      milestones: [
        { title: 'Ground school started', status: stats.classes ? 'in-progress' : 'not-started', helper: `${stats.classes} lesson records`, action: { label: 'Open Notes', view: 'notes' } },
        { title: 'Medical certificate', status: 'not-started', helper: 'Category 1 or 3 for PPL path' },
        { title: 'Basic flight handling', status: 'not-started', helper: 'Turns, climbs, descents, stalls' },
        { title: 'Study system ready', status: stats.cards ? 'in-progress' : 'not-started', helper: `${stats.cards} official flashcards`, action: { label: 'Flashcards', view: 'flashcards' } }
      ]
    },
    {
      id: 'pre-solo',
      number: 2,
      title: 'Pre-Solo',
      subtitle: 'PSTAR, ROC-A, SPP, first solo',
      percent: pstarComplete ? 35 : pstarStatus === 'in-progress' ? 18 : 8,
      accent: 'blue',
      milestones: [
        { title: 'PSTAR', status: pstarStatus, helper: pstarLabel, action: { label: 'Open Testing', view: 'testing' } },
        { title: 'ROC-A', status: 'not-started', helper: 'Radio licence practice lives in Testing', action: { label: 'Open Testing', view: 'testing' } },
        { title: 'Student Pilot Permit', status: 'locked', helper: 'Unlocks after medical and PSTAR' },
        { title: 'First solo', status: 'locked', helper: 'Instructor authorization and circuit readiness' }
      ]
    },
    {
      id: 'navigation',
      number: 3,
      title: 'Navigation',
      subtitle: 'Cross-country, instrument basics, solo XC',
      percent: 0,
      accent: 'blue',
      milestones: [
        { title: 'Cross-country planning', status: 'locked', helper: 'Charts, tracks, fuel, weather' },
        { title: 'Instrument flying basics', status: 'locked', helper: 'Hood time and recovery skills' },
        { title: '150 NM solo XC', status: 'locked', helper: 'Two full-stop landings away' },
        { title: 'Ground school recommendation', status: 'locked', helper: 'Written exam readiness' }
      ]
    },
    {
      id: 'final-licence',
      number: 4,
      title: 'Final Licence',
      subtitle: 'PPAER, flight test, licence application',
      percent: 0,
      accent: 'green',
      milestones: [
        { title: 'PPAER written exam', status: 'locked', helper: '100 questions, 60% pass standard' },
        { title: 'Flight test recommendation', status: 'locked', helper: 'Instructor sign-off' },
        { title: 'Flight test', status: 'locked', helper: 'Transport Canada examiner' },
        { title: 'Licence application', status: 'locked', helper: 'Submit package to Transport Canada' }
      ]
    }
  ];

  const topCards: Array<{ label: string; value: string; note: string; icon: ReactNode }> = [
    { label: 'Roadmap', value: `${overallPreviewPct}%`, note: 'Preview progress', icon: <Map size={22} /> },
    { label: 'Ground School', value: `${stats.classes}`, note: 'lesson records', icon: <BookOpen size={22} /> },
    { label: 'PSTAR', value: pstarComplete ? 'Ready' : '--', note: pstarLabel, icon: <GraduationCap size={22} /> },
    { label: 'ROC-A', value: 'Testing', note: 'available now', icon: <RadioTower size={22} /> },
    { label: 'Tasks', value: `${stats.tasksRemaining}`, note: 'open actions', icon: <ClipboardCheck size={22} /> }
  ];

  return <div className="pilot-roadmap">
    <section className="roadmap-hero">
      <div>
        <span className="eyebrow">Private Pilot Journey</span>
        <h2>Good {getDayPart()}, Captain {firstName}.</h2>
        <p>Your path from first ground lesson to Private Pilot Licence.</p>
      </div>
      <div className="roadmap-hero-actions">
        <button onClick={() => onViewChange('testing')}><GraduationCap size={17} />Testing</button>
        <button onClick={() => onViewChange('tasks')}><ClipboardCheck size={17} />Tasks</button>
      </div>
    </section>

    <section className="roadmap-summary" aria-label="Private pilot progress summary">
      {topCards.map((card) => <button className="roadmap-summary-card" key={card.label} onClick={() => card.label === 'PSTAR' || card.label === 'ROC-A' ? onViewChange('testing') : card.label === 'Tasks' ? onViewChange('tasks') : undefined}>
        {card.icon}
        <span>{card.label}</span>
        <strong>{card.value}</strong>
        <small>{card.note}</small>
      </button>)}
    </section>

    <section className="roadmap-board" aria-label="Private pilot phases">
      {phases.map((phase) => <article className={`roadmap-phase ${phase.accent}`} key={phase.id}>
        <div className="roadmap-phase-head">
          <span className="phase-number">{phase.number}</span>
          <div>
            <h3>{phase.title}</h3>
            <p>{phase.subtitle}</p>
          </div>
        </div>
        <div className="phase-progress">
          <div className="phase-ring" style={{ '--pct': phase.percent } as CSSProperties}><strong>{phase.percent}%</strong></div>
          <span>{phase.milestones.filter((item) => item.status === 'complete').length} / {phase.milestones.length} complete</span>
        </div>
        <div className="roadmap-milestones">
          {phase.milestones.map((milestone) => <button className={`roadmap-milestone ${milestone.status}`} key={milestone.title} onClick={() => milestone.action ? onViewChange(milestone.action.view) : undefined}>
            <span className="milestone-icon">{milestoneIcon(milestone.status)}</span>
            <span className="milestone-copy"><strong>{milestone.title}</strong><small>{milestone.helper}</small></span>
            <span className={`status-chip ${milestone.status}`}>{statusLabels[milestone.status]}</span>
          </button>)}
        </div>
      </article>)}
    </section>

    <section className="roadmap-next">
      <div>
        <span className="eyebrow">Next Required Action</span>
        <h3>{pstarComplete ? 'Record medical and SPP readiness' : 'Focus on PSTAR and medical'}</h3>
        <p>{pstarComplete ? 'The roadmap shell is ready for the next milestone layer: medical, ROC-A, and Student Pilot Permit tracking.' : 'PSTAR, medical, and ROC-A are the major blockers before the Student Pilot Permit and first solo path.'}</p>
      </div>
      <div className="roadmap-next-actions">
        <button onClick={() => onViewChange('testing')}><FileCheck2 size={17} />Open Testing</button>
        <button onClick={() => onViewChange('tasks')}><CalendarCheck size={17} />Add Planning Task</button>
        <button onClick={() => onViewChange('notes')}><ShieldCheck size={17} />Record Notes</button>
      </div>
      <div className="roadmap-dependency-note">
        <HeartPulse size={17} />
        <span>Dependency logic and manual completion will come in the next milestone. This pass is the visual shell only.</span>
      </div>
    </section>
  </div>;
};
