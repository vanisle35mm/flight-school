import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { BookOpen, CheckCircle2, CloudSun, FileCheck2, GraduationCap, HeartPulse, Layers, Map as MapIcon, RadioTower, Save, ShieldCheck, X } from 'lucide-react';
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
  countsTowardProgress?: boolean;
  hoursField?: {
    label: string;
    helper: string;
  };
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
const hasProgressStarted = (progress?: RoadmapMilestoneProgress) => Boolean(progress?.completed || progress?.completedDate || progress?.notes?.trim() || (typeof progress?.hours === 'number' && progress.hours > 0));
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
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const roadmapProgress = data.roadmapProgress ?? {};
  const touchedPhases = data.roadmapTouchedPhases ?? [];
  const pstarComplete = stats.hasAccuracy && stats.accuracy >= 90;
  const pstarStatus: MilestoneStatus = pstarComplete ? 'complete' : stats.latestPstarAttemptTotal ? 'in-progress' : 'not-started';
  const pstarLabel = pstarComplete ? `${stats.accuracy}% complete` : stats.latestPstarAttemptTotal ? `${stats.accuracy}% best score` : 'Study and write the 50-question test';
  const medicalComplete = roadmapProgress.medical?.completed === true;
  const rocaComplete = roadmapProgress.roca?.completed === true;
  const sppComplete = roadmapProgress.spp?.completed === true;
  const sppReady = medicalComplete && pstarComplete;
  const groundSchoolHours = data.classes.length * 8;
  const dualFlightHours = roadmapProgress['begin-flight-instruction']?.hours ?? 0;

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
        id: 'ground-school-hours',
        phaseId: 'foundation',
        title: 'Ground school hours',
        status: groundSchoolHours >= 40 ? 'complete' : groundSchoolHours > 0 ? 'in-progress' : 'not-started',
        helper: `${groundSchoolHours} / 40 hours`,
        description: 'Record each classroom lesson by title or subject. For now, each lesson record counts as 8 ground-school hours.',
        requirements: ['Record the lesson title or subject', 'Keep a short note for what was covered', 'Reach the ground-school hour target your school uses'],
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
        id: 'begin-flight-instruction',
        phaseId: 'foundation',
        title: 'Begin flight instruction',
        status: manualStatus(roadmapProgress['begin-flight-instruction']),
        helper: `${dualFlightHours} dual hours logged`,
        description: 'Track the start of dual flight instruction. Many students solo around 10-20 dual hours, but instructor readiness matters more than the number.',
        requirements: ['Begin dual flight lessons with an instructor', 'Record dual flight hours as a baseline', 'Use instructor guidance before treating solo as a target'],
        manual: true,
        hoursField: { label: 'Dual flight training hours', helper: 'Use this as a baseline, not a solo countdown.' }
      },
      {
        id: 'foundation-study-reminder',
        phaseId: 'foundation',
        title: 'Study reminders',
        status: 'not-started',
        helper: 'Flashcards and Testing stay available',
        description: 'Use study tools to stay warm, but do not treat studying alone as a completed milestone. Exam milestones complete when the real exam is passed.',
        requirements: ['Use flashcards to keep weak areas visible', 'Use Testing when preparing for PSTAR or ROC-A', 'Mark exam milestones complete only when they are actually passed'],
        countsTowardProgress: false,
        action: { label: 'Flashcards', view: 'flashcards' }
      },
      {
        id: 'foundation-phase-signoff',
        phaseId: 'foundation',
        title: 'Phase 2 sign-off',
        status: manualStatus(roadmapProgress['foundation-phase-signoff']),
        helper: roadmapProgress['foundation-phase-signoff']?.completedDate || 'Instructor/school sign-off',
        description: 'Record when your instructor or school agrees you are ready to move from Foundation into Pre-Solo work.',
        requirements: ['Ground school foundation underway', 'Medical plan understood', 'Dual flight instruction started', 'Instructor or school confirms you can focus on Pre-Solo milestones'],
        manual: true
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
      { id: 'navigation', number: 3, title: 'Advanced Flight Training', subtitle: 'Cross-country, instrument basics, solo XC', accent: 'blue' as const, milestones: navigationMilestones },
      { id: 'final-licence', number: 4, title: 'Final Testing and Licensing', subtitle: 'PPAER, flight test, licence application', accent: 'green' as const, milestones: finalMilestones }
    ];

    return nextPhases.map((phase) => {
      const progressMilestones = phase.milestones.filter((item) => item.countsTowardProgress !== false);
      const completeCount = progressMilestones.filter((item) => item.status === 'complete').length;
      const inProgressCount = progressMilestones.filter((item) => item.status === 'in-progress').length;
      return {
        ...phase,
        percent: progressMilestones.length ? clampPct(((completeCount + inProgressCount * 0.35) / progressMilestones.length) * 100) : 0
      };
    });
  }, [dualFlightHours, groundSchoolHours, medicalComplete, pstarComplete, pstarLabel, pstarStatus, roadmapProgress, rocaComplete, sppComplete, sppReady]);

  const selectedMilestone = phases.flatMap((phase) => phase.milestones).find((milestone) => milestone.id === selectedMilestoneId) ?? phases[0].milestones[1];
  const selectedProgress = roadmapProgress[selectedMilestone.id] ?? {};
  const selectedPhase = phases.find((phase) => phase.id === selectedMilestone.phaseId) ?? phases[0];
  const overallPct = clampPct(phases.reduce((sum, phase) => sum + phase.percent, 0) / phases.length);
  const nextActions = selectedMilestone.status === 'complete'
    ? ['Review the next milestone in this phase', 'Keep notes current for your instructor or school']
    : selectedMilestone.requirements;
  const relatedTools = Array.from(new Map([
    ...(selectedMilestone.action ? [selectedMilestone.action] : []),
    ...(selectedMilestone.id === 'foundation-study-reminder' || selectedMilestone.id === 'pstar' || selectedMilestone.id === 'roca' ? [{ label: 'Flashcards', view: 'flashcards' as ViewId }] : []),
    ...(selectedMilestone.phaseId === 'navigation' || selectedMilestone.id === 'first-solo' ? [{ label: 'Weather', view: 'weather' as ViewId }] : []),
    { label: 'Notes', view: 'notes' as ViewId }
  ].map((tool) => [tool.label, tool])).values());

  const selectMilestone = (milestone: RoadmapMilestone) => {
    setSelectedMilestoneId(milestone.id);
    setIsDetailOpen(true);
    touchPhase(milestone.phaseId);
  };

  const topCards: Array<{ label: string; value: string; note: string; icon: ReactNode; onClick?: () => void }> = [
    { label: 'Roadmap', value: `${overallPct}%`, note: 'weighted preview', icon: <MapIcon size={22} /> },
    { label: 'Ground School', value: `${groundSchoolHours}`, note: 'hours logged', icon: <BookOpen size={22} />, onClick: () => onViewChange('notes') },
    { label: 'PSTAR', value: pstarComplete ? 'Ready' : '--', note: pstarLabel, icon: <GraduationCap size={22} />, onClick: () => onViewChange('testing') },
    { label: 'ROC-A', value: rocaComplete ? 'Done' : 'Testing', note: rocaComplete ? 'recorded complete' : 'available now', icon: <RadioTower size={22} />, onClick: () => onViewChange('testing') },
    { label: 'Weather', value: data.users[data.activeUserId]?.homeAirport || 'METAR', note: 'pilot habit tool', icon: <CloudSun size={22} />, onClick: () => onViewChange('weather') }
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

    <section className={isDetailOpen ? 'roadmap-workspace' : 'roadmap-workspace detail-closed'}>
      <div className="roadmap-board" aria-label="Private pilot phases">
        {phases.map((phase) => {
          const isQuiet = phase.number > 1 && !touchedPhases.includes(phase.id);
          const progressMilestones = phase.milestones.filter((item) => item.countsTowardProgress !== false);
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
              <span>{progressMilestones.filter((item) => item.status === 'complete').length} / {progressMilestones.length} complete</span>
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

      {isDetailOpen ? <aside className="roadmap-detail-drawer" aria-label="Milestone details">
        <div className="roadmap-detail-head">
          <div>
            <span className="eyebrow">{selectedPhase.title}</span>
            <h3>{selectedMilestone.title}</h3>
          </div>
          <button className="icon-button" onClick={() => setIsDetailOpen(false)} aria-label="Close milestone details"><X size={17} /></button>
        </div>
        <span className={`status-chip ${selectedMilestone.status}`}>{statusLabels[selectedMilestone.status]}</span>
        <p>{selectedMilestone.description}</p>
        <div className="roadmap-requirements">
          <h4>Requirements</h4>
          {selectedMilestone.requirements.map((requirement) => <div key={requirement}><CheckCircle2 size={15} /><span>{requirement}</span></div>)}
        </div>

        <div className="roadmap-next-steps">
          <h4>Next Actions</h4>
          {nextActions.map((action) => <div key={action}><span className="roadmap-action-number" /> <span>{action}</span></div>)}
        </div>

        <div className="roadmap-related-tools">
          <h4>Related Tools</h4>
          <div>
            {relatedTools.map((tool) => <button key={`${selectedMilestone.id}-${tool.label}`} onClick={() => onViewChange(tool.view)}>
              {tool.label === 'Open Testing' ? <FileCheck2 size={16} /> : tool.label === 'Flashcards' ? <Layers size={16} /> : tool.label === 'Weather' ? <CloudSun size={16} /> : <ShieldCheck size={16} />}
              {tool.label}
            </button>)}
          </div>
        </div>

        {selectedMilestone.manual ? <div className="roadmap-evidence">
          <h4>Notes</h4>
          {selectedMilestone.hoursField ? <label>
            {selectedMilestone.hoursField.label}
            <input
              type="number"
              min="0"
              step="0.1"
              value={selectedProgress.hours ?? ''}
              onChange={(event) => {
                const parsed = Number(event.target.value);
                updateRoadmap(selectedMilestone.id, { hours: event.target.value === '' || Number.isNaN(parsed) ? undefined : Math.max(0, parsed) }, selectedMilestone.phaseId);
              }}
              placeholder="0"
            />
            <small>{selectedMilestone.hoursField.helper}</small>
          </label> : null}
          <label>
            Notes
            <textarea value={selectedProgress.notes ?? ''} onChange={(event) => updateRoadmap(selectedMilestone.id, { notes: event.target.value }, selectedMilestone.phaseId)} placeholder="Add instructor notes, exam details, or what still needs to happen..." />
          </label>
          <div className="roadmap-completion-block">
            <h4>Completion</h4>
            <label>
              Date completed
              <input type="date" value={selectedProgress.completedDate ?? ''} onChange={(event) => updateRoadmap(selectedMilestone.id, { completedDate: event.target.value }, selectedMilestone.phaseId)} />
            </label>
            <button className={selectedProgress.completed ? 'roadmap-complete-button complete' : 'roadmap-complete-button'} onClick={() => updateRoadmap(selectedMilestone.id, { completed: !selectedProgress.completed, completedDate: selectedProgress.completedDate || new Date().toISOString().slice(0, 10) }, selectedMilestone.phaseId)}>
              <Save size={17} />{selectedProgress.completed ? 'Undo Completion' : 'Mark Complete'}
            </button>
          </div>
        </div> : <div className="roadmap-evidence read-only">
          <h4>Automatic Milestone</h4>
          <p>This milestone updates from existing app activity.</p>
        </div>}
      </aside> : null}
    </section>
  </div>;
};
