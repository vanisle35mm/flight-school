import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { BookOpen, CalendarCheck, CheckCircle2, ClipboardCheck, FileCheck2, GraduationCap, HeartPulse, Map, RadioTower, Save, ShieldCheck, X } from 'lucide-react';
import { getStats } from '../../lib/stats';
import type { GroundSchoolData, RoadmapMilestoneProgress, ViewId } from '../../types';

type MilestoneStatus = 'complete' | 'in-progress' | 'locked' | 'not-started';
type RoadmapMilestone = {
  id: string;
  phaseId: string;
  title: string;
  status: MilestoneStatus;
  helper: string;
  description: string;
  requirements: string[];
  manual?: boolean;
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
const hasProgressStarted = (progress?: RoadmapMilestoneProgress) => Boolean(progress?.completed || progress?.completedDate || progress?.notes?.trim());
const manualStatus = (progress?: RoadmapMilestoneProgress, fallback: MilestoneStatus = 'not-started'): MilestoneStatus => {
  if (progress?.completed) return 'complete';
  if (hasProgressStarted(progress)) return 'in-progress';
  return fallback;
};

export const Dashboard = ({ data, onDataChange, onViewChange }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; onViewChange: (view: ViewId) => void }) => {
  const activeUser = data.users[data.activeUserId];
  const firstName = activeUser?.firstName || 'Pilot';
  const stats = getStats(data);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('medical');
  const roadmapProgress = data.roadmapProgress ?? {};
  const touchedPhases = data.roadmapTouchedPhases ?? [];
  const pstarComplete = stats.hasAccuracy && stats.accuracy >= 90;
  const pstarStatus: MilestoneStatus = pstarComplete ? 'complete' : stats.latestPstarAttemptTotal ? 'in-progress' : 'not-started';
  const pstarLabel = pstarComplete ? `${stats.accuracy}% complete` : stats.latestPstarAttemptTotal ? `${stats.accuracy}% best score` : 'Study and write the 50-question test';
  const medicalComplete = roadmapProgress.medical?.completed === true;
  const rocaComplete = roadmapProgress.roca?.completed === true;
  const sppComplete = roadmapProgress.spp?.completed === true;
  const sppReady = medicalComplete && pstarComplete;

  const updateRoadmap = (milestoneId: string, patch: RoadmapMilestoneProgress, phaseId?: string) => {
    const nextProgress = {
      ...roadmapProgress,
      [milestoneId]: {
        ...roadmapProgress[milestoneId],
        ...patch
      }
    };
    const nextTouchedPhases = phaseId && !touchedPhases.includes(phaseId) ? [...touchedPhases, phaseId] : touchedPhases;
    onDataChange({ ...data, roadmapProgress: nextProgress, roadmapTouchedPhases: nextTouchedPhases });
  };

  const touchPhase = (phaseId: string) => {
    if (touchedPhases.includes(phaseId)) return;
    onDataChange({ ...data, roadmapTouchedPhases: [...touchedPhases, phaseId] });
  };

  const phases: RoadmapPhase[] = useMemo(() => {
    const foundationMilestones: RoadmapMilestone[] = [
      {
        id: 'ground-school-started',
        phaseId: 'foundation',
        title: 'Ground school started',
        status: stats.classes ? 'in-progress' : 'not-started',
        helper: `${stats.classes} lesson records`,
        description: 'Build your classroom foundation: air law, navigation, meteorology, aircraft systems, and human factors.',
        requirements: ['Attend ground school lessons', 'Record lesson notes', 'Build study tasks and flashcards'],
        action: { label: 'Open Notes', view: 'notes' }
      },
      {
        id: 'medical',
        phaseId: 'foundation',
        title: 'Medical certificate',
        status: manualStatus(roadmapProgress.medical),
        helper: medicalComplete ? roadmapProgress.medical?.completedDate || 'Complete' : 'Book Category 1 or 3 medical',
        description: 'Your medical is one of the main blockers before permit/licence paperwork can move forward.',
        requirements: ['Book with a Transport Canada Civil Aviation Medical Examiner', 'Complete Category 1 or 3 medical for the PPL path', 'Record the completion date when received'],
        manual: true
      },
      {
        id: 'basic-flight-handling',
        phaseId: 'foundation',
        title: 'Basic flight handling',
        status: manualStatus(roadmapProgress['basic-flight-handling']),
        helper: 'Turns, climbs, descents, stalls',
        description: 'Track the early flight-training basics that make the aircraft feel familiar.',
        requirements: ['Straight-and-level flight', 'Climbs and descents', 'Turns', 'Slow flight and stalls with instructor'],
        manual: true
      },
      {
        id: 'study-system-ready',
        phaseId: 'foundation',
        title: 'Study system ready',
        status: stats.cards ? 'in-progress' : 'not-started',
        helper: `${stats.cards} official flashcards`,
        description: 'Use the built-in official study cards to keep PSTAR and ROC-A material warm.',
        requirements: ['Review official flashcards', 'Mark unknown cards', 'Use missed questions after practice sessions'],
        action: { label: 'Flashcards', view: 'flashcards' }
      }
    ];

    const preSoloMilestones: RoadmapMilestone[] = [
      {
        id: 'pstar',
        phaseId: 'pre-solo',
        title: 'PSTAR',
        status: pstarStatus,
        helper: pstarLabel,
        description: 'PSTAR is the pre-solo air regulations exam. The pass mark is 90%.',
        requirements: ['Study the PSTAR question areas', 'Write a 50-question test', 'Record/pass at 90% or higher'],
        action: { label: 'Open Testing', view: 'testing' }
      },
      {
        id: 'roca',
        phaseId: 'pre-solo',
        title: 'ROC-A',
        status: manualStatus(roadmapProgress.roca),
        helper: rocaComplete ? roadmapProgress.roca?.completedDate || 'Complete' : 'Radio licence practice lives in Testing',
        description: 'ROC-A proves you can use aviation radio procedures and phraseology safely.',
        requirements: ['Study RIC-21 material', 'Practice radio calls', 'Record the pass date when complete'],
        manual: true,
        action: { label: 'Open Testing', view: 'testing' }
      },
      {
        id: 'spp',
        phaseId: 'pre-solo',
        title: 'Student Pilot Permit',
        status: sppComplete ? 'complete' : sppReady ? manualStatus(roadmapProgress.spp, 'in-progress') : 'locked',
        helper: sppComplete ? roadmapProgress.spp?.completedDate || 'Issued' : sppReady ? 'Ready to confirm with school' : 'Unlocks after medical and PSTAR',
        description: 'The SPP is issued through the school when the required pieces are ready.',
        requirements: ['Medical complete', 'PSTAR passed', 'School verifies permit paperwork', 'Record issue date'],
        manual: true
      },
      {
        id: 'first-solo',
        phaseId: 'pre-solo',
        title: 'First solo',
        status: sppComplete ? manualStatus(roadmapProgress['first-solo']) : 'locked',
        helper: sppComplete ? 'Instructor authorization and circuit readiness' : 'Locked until SPP is issued',
        description: 'The first solo is the big pre-solo milestone: instructor steps out, you fly the circuit yourself.',
        requirements: ['SPP issued', 'Circuit checks and emergencies ready', 'Instructor authorizes solo', 'Record first solo date'],
        manual: true
      }
    ];

    const navigationMilestones: RoadmapMilestone[] = [
      { id: 'cross-country-planning', phaseId: 'navigation', title: 'Cross-country planning', status: manualStatus(roadmapProgress['cross-country-planning'], 'locked'), helper: 'Charts, tracks, fuel, weather', description: 'Start planning and briefing longer flights away from the circuit.', requirements: ['Route planning', 'Fuel planning', 'Weather and NOTAM review'], manual: true },
      { id: 'instrument-basics', phaseId: 'navigation', title: 'Instrument flying basics', status: manualStatus(roadmapProgress['instrument-basics'], 'locked'), helper: 'Hood time and recovery skills', description: 'Track the required instrument basics and confidence under the hood.', requirements: ['Basic attitude instrument flying', 'Recovery skills', 'Navigation instrument support'], manual: true },
      { id: 'solo-150nm-xc', phaseId: 'navigation', title: '150 NM solo XC', status: manualStatus(roadmapProgress['solo-150nm-xc'], 'locked'), helper: 'Two full-stop landings away', description: 'Complete the required solo cross-country distance with landings away from departure.', requirements: ['Minimum 150 NM solo cross-country', 'Two full-stop landings at other aerodromes', 'Debrief and log the flight'], manual: true },
      { id: 'ground-school-recommendation', phaseId: 'navigation', title: 'Ground school recommendation', status: manualStatus(roadmapProgress['ground-school-recommendation'], 'locked'), helper: 'Written exam readiness', description: 'Record when your school/instructor recommends you for the written exam.', requirements: ['Ground school complete', 'Practice exam readiness', 'Recommendation received'], manual: true }
    ];

    const finalMilestones: RoadmapMilestone[] = [
      { id: 'ppaer', phaseId: 'final-licence', title: 'PPAER written exam', status: manualStatus(roadmapProgress.ppaer, 'locked'), helper: '100 questions, 60% pass standard', description: 'The Private Pilot Aeroplane written exam is the major Transport Canada written test.', requirements: ['Written recommendation', 'Book exam', 'Pass overall and required sections'], manual: true },
      { id: 'flight-test-recommendation', phaseId: 'final-licence', title: 'Flight test recommendation', status: manualStatus(roadmapProgress['flight-test-recommendation'], 'locked'), helper: 'Instructor sign-off', description: 'Your instructor signs off when you are ready for the practical test.', requirements: ['Flight test exercises ready', 'Mock test or prep complete', 'Recommendation signed'], manual: true },
      { id: 'flight-test', phaseId: 'final-licence', title: 'Flight test', status: manualStatus(roadmapProgress['flight-test'], 'locked'), helper: 'Transport Canada examiner', description: 'Record the practical flight test result and date.', requirements: ['Aircraft and examiner booked', 'Documents ready', 'Flight test completed'], manual: true },
      { id: 'licence-application', phaseId: 'final-licence', title: 'Licence application', status: manualStatus(roadmapProgress['licence-application'], 'locked'), helper: 'Submit package to Transport Canada', description: 'Final paperwork stage after the written and flight test are complete.', requirements: ['Logbook complete', 'Exam and flight test records ready', 'Application submitted'], manual: true }
    ];

    const nextPhases = [
      { id: 'foundation', number: 1, title: 'Foundation', subtitle: 'Ground school, medical, first lessons', accent: 'amber' as const, milestones: foundationMilestones },
      { id: 'pre-solo', number: 2, title: 'Pre-Solo', subtitle: 'PSTAR, ROC-A, SPP, first solo', accent: 'blue' as const, milestones: preSoloMilestones },
      { id: 'navigation', number: 3, title: 'Navigation', subtitle: 'Cross-country, instrument basics, solo XC', accent: 'blue' as const, milestones: navigationMilestones },
      { id: 'final-licence', number: 4, title: 'Final Licence', subtitle: 'PPAER, flight test, licence application', accent: 'green' as const, milestones: finalMilestones }
    ];

    return nextPhases.map((phase) => {
      const completeCount = phase.milestones.filter((item) => item.status === 'complete').length;
      const inProgressCount = phase.milestones.filter((item) => item.status === 'in-progress').length;
      return {
        ...phase,
        percent: clampPct(((completeCount + inProgressCount * 0.35) / phase.milestones.length) * 100)
      };
    });
  }, [medicalComplete, pstarComplete, pstarLabel, pstarStatus, roadmapProgress, rocaComplete, sppComplete, sppReady, stats.cards, stats.classes]);

  const selectedMilestone = phases.flatMap((phase) => phase.milestones).find((milestone) => milestone.id === selectedMilestoneId) ?? phases[0].milestones[1];
  const selectedProgress = roadmapProgress[selectedMilestone.id] ?? {};
  const selectedPhase = phases.find((phase) => phase.id === selectedMilestone.phaseId) ?? phases[0];
  const overallPct = clampPct(phases.reduce((sum, phase) => sum + phase.percent, 0) / phases.length);

  const selectMilestone = (milestone: RoadmapMilestone) => {
    setSelectedMilestoneId(milestone.id);
    touchPhase(milestone.phaseId);
  };

  const topCards: Array<{ label: string; value: string; note: string; icon: ReactNode; onClick?: () => void }> = [
    { label: 'Roadmap', value: `${overallPct}%`, note: 'weighted preview', icon: <Map size={22} /> },
    { label: 'Ground School', value: `${stats.classes}`, note: 'lesson records', icon: <BookOpen size={22} />, onClick: () => onViewChange('notes') },
    { label: 'PSTAR', value: pstarComplete ? 'Ready' : '--', note: pstarLabel, icon: <GraduationCap size={22} />, onClick: () => onViewChange('testing') },
    { label: 'ROC-A', value: rocaComplete ? 'Done' : 'Testing', note: rocaComplete ? 'recorded complete' : 'available now', icon: <RadioTower size={22} />, onClick: () => onViewChange('testing') },
    { label: 'Tasks', value: `${stats.tasksRemaining}`, note: 'open actions', icon: <ClipboardCheck size={22} />, onClick: () => onViewChange('tasks') }
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
        <button onClick={() => selectMilestone(phases[0].milestones[1])}><HeartPulse size={17} />Medical</button>
      </div>
    </section>

    <section className="roadmap-summary" aria-label="Private pilot progress summary">
      {topCards.map((card) => <button className="roadmap-summary-card" key={card.label} onClick={card.onClick}>
        {card.icon}
        <span>{card.label}</span>
        <strong>{card.value}</strong>
        <small>{card.note}</small>
      </button>)}
    </section>

    <section className="roadmap-workspace">
      <div className="roadmap-board" aria-label="Private pilot phases">
        {phases.map((phase) => {
          const isQuiet = phase.number > 1 && !touchedPhases.includes(phase.id);
          return <article className={`roadmap-phase ${phase.accent}${isQuiet ? ' quiet' : ''}`} key={phase.id}>
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
              {phase.milestones.map((milestone) => <button className={selectedMilestone.id === milestone.id ? `roadmap-milestone ${milestone.status} active` : `roadmap-milestone ${milestone.status}`} key={milestone.id} onClick={() => selectMilestone(milestone)}>
                <span className="milestone-icon">{milestoneIcon(milestone.status)}</span>
                <span className="milestone-copy"><strong>{milestone.title}</strong><small>{milestone.helper}</small></span>
                <span className={`status-chip ${milestone.status}`}>{statusLabels[milestone.status]}</span>
              </button>)}
            </div>
          </article>;
        })}
      </div>

      <aside className="roadmap-detail-drawer" aria-label="Milestone details">
        <div className="roadmap-detail-head">
          <div>
            <span className="eyebrow">{selectedPhase.title}</span>
            <h3>{selectedMilestone.title}</h3>
          </div>
          <button className="icon-button" onClick={() => setSelectedMilestoneId('medical')} aria-label="Reset selected milestone"><X size={17} /></button>
        </div>
        <span className={`status-chip ${selectedMilestone.status}`}>{statusLabels[selectedMilestone.status]}</span>
        <p>{selectedMilestone.description}</p>
        <div className="roadmap-requirements">
          <h4>Requirements</h4>
          {selectedMilestone.requirements.map((requirement) => <div key={requirement}><CheckCircle2 size={15} /><span>{requirement}</span></div>)}
        </div>

        {selectedMilestone.manual ? <div className="roadmap-evidence">
          <h4>Evidence</h4>
          <label>
            Date completed
            <input type="date" value={selectedProgress.completedDate ?? ''} onChange={(event) => updateRoadmap(selectedMilestone.id, { completedDate: event.target.value }, selectedMilestone.phaseId)} />
          </label>
          <label>
            Notes
            <textarea value={selectedProgress.notes ?? ''} onChange={(event) => updateRoadmap(selectedMilestone.id, { notes: event.target.value }, selectedMilestone.phaseId)} placeholder="Add instructor notes, exam details, or what still needs to happen..." />
          </label>
          <button className={selectedProgress.completed ? 'roadmap-complete-button complete' : 'roadmap-complete-button'} onClick={() => updateRoadmap(selectedMilestone.id, { completed: !selectedProgress.completed, completedDate: selectedProgress.completedDate || new Date().toISOString().slice(0, 10) }, selectedMilestone.phaseId)}>
            <Save size={17} />{selectedProgress.completed ? 'Undo Completion' : 'Mark Complete'}
          </button>
        </div> : <div className="roadmap-evidence read-only">
          <h4>Automatic Milestone</h4>
          <p>This milestone updates from existing app activity.</p>
        </div>}

        <div className="roadmap-next-actions">
          {selectedMilestone.action && <button onClick={() => onViewChange(selectedMilestone.action!.view)}><FileCheck2 size={17} />{selectedMilestone.action.label}</button>}
          <button onClick={() => onViewChange('tasks')}><CalendarCheck size={17} />Open Tasks</button>
          <button onClick={() => onViewChange('notes')}><ShieldCheck size={17} />Record Notes</button>
        </div>
      </aside>
    </section>
  </div>;
};
