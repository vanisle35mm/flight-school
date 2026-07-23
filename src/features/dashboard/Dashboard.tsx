import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { BookOpen, CheckCircle2, CloudSun, FileCheck2, GraduationCap, Layers, Map as MapIcon, PlaneTakeoff, Plus, RadioTower, Save, ShieldCheck, Trash2, X } from 'lucide-react';
import { getStats } from '../../lib/stats';
import { emitFlightSchoolCelebration } from '../../lib/celebrations';
import { DEFAULT_DASHBOARD_TILE_ORDER } from '../../lib/storage';
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
const hasProgressStarted = (progress?: RoadmapMilestoneProgress) => Boolean(progress?.completed || progress?.completedDate || progress?.booked || progress?.bookedDate || progress?.category || progress?.instructorConfirmed || progress?.instructorName?.trim() || progress?.flightLogs?.length || progress?.kitItems?.length || progress?.notes?.trim() || (typeof progress?.hours === 'number' && progress.hours > 0));
const manualStatus = (progress?: RoadmapMilestoneProgress, fallback: MilestoneStatus = 'not-started'): MilestoneStatus => {
  if (progress?.completed) return 'complete';
  if (hasProgressStarted(progress)) return 'in-progress';
  return fallback;
};
const ROADMAP_STATE_KEY = 'flightschool_roadmap_state';
const loadRoadmapState = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ROADMAP_STATE_KEY) ?? '{}') as Partial<{ selectedMilestoneId: string; isDetailOpen: boolean }>;
    return {
      selectedMilestoneId: typeof parsed.selectedMilestoneId === 'string' ? parsed.selectedMilestoneId : 'ground-school-hours',
      isDetailOpen: typeof parsed.isDetailOpen === 'boolean' ? parsed.isDetailOpen : true
    };
  } catch {
    return { selectedMilestoneId: 'ground-school-hours', isDetailOpen: true };
  }
};
const isPhaseComplete = (phase: RoadmapPhase) => {
  const scoredMilestones = phase.milestones.filter((item) => item.countsTowardProgress !== false);
  return Boolean(scoredMilestones.length && scoredMilestones.every((item) => item.status === 'complete'));
};
const groundSchoolKitSections = [
  {
    title: 'Books',
    items: [
      'TP 14371 - Aeronautical Information Manual (AIM)',
      'Cessna 172S Information Manual',
      'From the Ground Up',
      'Flight Training Manual',
      'Pilot Logbook'
    ]
  },
  {
    title: 'Charts and navigation tools',
    items: [
      'AIR 1901 - Vancouver VFR Terminal Area Chart',
      'AIR 5004 - Vancouver VFR Navigation Chart',
      'E6-B Flight Computer',
      'Douglas Square Protractor',
      'ICAO Chart Ruler'
    ]
  },
  {
    title: 'VFC handouts',
    items: [
      'Airside Etiquette',
      'Welcome Letter',
      'Private Pilot Syllabus',
      'Cessna 172 Aircraft Checklist - Normal and Emergency',
      'Victoria Airport Diagram / Radio Procedures',
      'VFC Safety Precautions',
      'Private Pilot Licence Requirements',
      'VFC Member Rules and Regulations / Aircraft Booking Policy',
      'VFC Study Guide Handout'
    ]
  }
];
const groundSchoolKitItems = groundSchoolKitSections.flatMap((section) => section.items);

export const Dashboard = ({ data, onDataChange, onViewChange }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; onViewChange: (view: ViewId) => void }) => {
  const activeUser = data.users[data.activeUserId];
  const firstName = activeUser?.firstName || 'Pilot';
  const stats = getStats(data);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(() => loadRoadmapState().selectedMilestoneId);
  const [isDetailOpen, setIsDetailOpen] = useState(() => loadRoadmapState().isDetailOpen);
  const [flightLogDraft, setFlightLogDraft] = useState({ date: '', hours: '', notes: '' });
  const priorMilestoneStatuses = useRef<Record<string, MilestoneStatus> | null>(null);
  const priorPhaseCompletion = useRef<Record<string, boolean> | null>(null);
  const roadmapProgress = data.roadmapProgress ?? {};
  const touchedPhases = data.roadmapTouchedPhases ?? [];
  const pstarComplete = stats.hasAccuracy && stats.accuracy >= 90;
  const pstarStatus: MilestoneStatus = pstarComplete ? 'complete' : stats.latestPstarAttemptTotal ? 'in-progress' : 'not-started';
  const pstarLabel = pstarComplete ? `${stats.accuracy}% complete` : stats.latestPstarAttemptTotal ? `${stats.accuracy}% best score` : 'Study and write the 50-question test';
  const medicalProgress = roadmapProgress.medical ?? {};
  const medicalBooked = medicalProgress.booked === true && Boolean(medicalProgress.bookedDate);
  const medicalComplete = medicalProgress.completed === true && Boolean(medicalProgress.completedDate);
  const rocaComplete = roadmapProgress.roca?.completed === true;
  const sppComplete = roadmapProgress.spp?.completed === true;
  const sppReady = medicalComplete && pstarComplete;
  const completedClassCount = data.classes.filter((session) => session.completed).length;
  const groundSchoolHours = completedClassCount * 8;
  const flightInstructionProgress = roadmapProgress['begin-flight-instruction'] ?? {};
  const flightInstructionLogs = flightInstructionProgress.flightLogs ?? [];
  const loggedFlightHours = flightInstructionLogs.reduce((sum, log) => sum + log.hours, 0) || flightInstructionProgress.hours || 0;
  const instructorConfirmed = flightInstructionProgress.instructorConfirmed === true && Boolean(flightInstructionProgress.instructorName?.trim());
  const flightLessonsStarted = flightInstructionLogs.length > 0 || loggedFlightHours > 0;
  const flightInstructionStatus: MilestoneStatus = instructorConfirmed && flightLessonsStarted ? 'complete' : hasProgressStarted(flightInstructionProgress) ? 'in-progress' : 'not-started';
  const flightInstructionHelper = instructorConfirmed && flightLessonsStarted
    ? `Started with ${flightInstructionProgress.instructorName}`
    : flightInstructionProgress.instructorName?.trim()
      ? `${flightInstructionProgress.instructorName} confirmed`
      : 'Confirm instructor and start lessons';
  const groundSchoolKitProgress = roadmapProgress['ground-school-kit'] ?? {};
  const checkedKitItems = groundSchoolKitProgress.kitItems ?? [];
  const groundSchoolKitComplete = checkedKitItems.length >= groundSchoolKitItems.length;

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
        id: 'ground-school-kit',
        phaseId: 'foundation',
        title: 'Get ground school kit',
        status: groundSchoolKitComplete ? 'complete' : checkedKitItems.length ? 'in-progress' : 'not-started',
        helper: `${checkedKitItems.length} / ${groundSchoolKitItems.length} items`,
        description: 'Gather the VFC ground school books, charts, navigation tools, and handouts before or early in ground school.',
        requirements: groundSchoolKitItems,
        manual: true
      },
      {
        id: 'ground-school-hours',
        phaseId: 'foundation',
        title: 'Ground school hours',
        status: groundSchoolHours >= 40 ? 'complete' : groundSchoolHours > 0 ? 'in-progress' : 'not-started',
        helper: `${groundSchoolHours} / 40 hours`,
        description: 'Record each classroom lesson by title or subject. For now, each lesson record counts as 8 ground-school hours.',
        requirements: ['Record the lesson title or subject', 'Keep a short note for what was covered', 'Reach the ground-school hour target your school uses'],
        action: { label: 'Open Ground School', view: 'notes' }
      },
      {
        id: 'medical',
        phaseId: 'foundation',
        title: 'Medical certificate',
        status: medicalComplete ? 'complete' : medicalBooked ? 'in-progress' : 'not-started',
        helper: medicalComplete ? medicalProgress.category || medicalProgress.completedDate || 'Passed' : medicalBooked ? medicalProgress.bookedDate || 'Booked' : 'Book your medical',
        description: 'Your medical is one of the main blockers before permit/licence paperwork can move forward.',
        requirements: ['Book with a Transport Canada Civil Aviation Medical Examiner', 'Complete Category 1 or 3 medical for the PPL path', 'Record the completion date when received'],
        manual: true
      },
      {
        id: 'begin-flight-instruction',
        phaseId: 'foundation',
        title: 'Begin flight instruction',
        status: flightInstructionStatus,
        helper: flightInstructionHelper,
        description: 'Foundation only needs to confirm the instructor relationship and that lessons have started. The detailed hour minimums belong later in training.',
        requirements: ['Confirm your instructor', 'Log your first flight lesson', 'Use the log as a baseline, not a licensing total'],
        manual: true
      },
      {
        id: 'foundation-study-reminder',
        phaseId: 'foundation',
        title: 'Start Studying',
        status: manualStatus(roadmapProgress['foundation-study-reminder']),
        helper: roadmapProgress['foundation-study-reminder']?.completed ? 'Started studying' : 'Review ground school with flashcards and mock tests',
        description: 'Start studying the sections you are learning in ground school with flashcards and mock tests.',
        requirements: ['Review flashcards from ground school topics', 'Try mock tests when you are ready', 'Use missed questions to guide the next study session'],
        manual: true,
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
  }, [checkedKitItems.length, flightInstructionHelper, flightInstructionStatus, groundSchoolHours, groundSchoolKitComplete, medicalComplete, pstarComplete, pstarLabel, pstarStatus, roadmapProgress, rocaComplete, sppComplete, sppReady]);

  const selectedMilestone = phases.flatMap((phase) => phase.milestones).find((milestone) => milestone.id === selectedMilestoneId) ?? phases[0].milestones[1];
  const selectedProgress = roadmapProgress[selectedMilestone.id] ?? {};
  const selectedPhase = phases.find((phase) => phase.id === selectedMilestone.phaseId) ?? phases[0];
  const visiblePhases = isDetailOpen ? phases.filter((phase) => phase.id === selectedPhase.id) : phases;
  const groundSchoolSchedule = [...data.classes].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });
  const isGroundSchoolDetail = selectedMilestone.id === 'ground-school-hours';
  const isGroundSchoolKitDetail = selectedMilestone.id === 'ground-school-kit';
  const isMedicalDetail = selectedMilestone.id === 'medical';
  const isFlightInstructionDetail = selectedMilestone.id === 'begin-flight-instruction';
  const isStudyDetail = selectedMilestone.id === 'foundation-study-reminder';
  const selectedFlightLogs = selectedProgress.flightLogs ?? [];
  const selectedFlightHours = selectedFlightLogs.reduce((sum, log) => sum + log.hours, 0) || selectedProgress.hours || 0;
  const overallPct = clampPct(phases.reduce((sum, phase) => sum + phase.percent, 0) / phases.length);
  const nextActions = selectedMilestone.status === 'complete'
    ? ['Review the next milestone in this phase', 'Keep notes current for your instructor or school']
    : selectedMilestone.requirements;
  const relatedTools = Array.from(new Map([
    ...(selectedMilestone.action ? [selectedMilestone.action] : []),
    ...(selectedMilestone.id === 'foundation-study-reminder' || selectedMilestone.id === 'pstar' || selectedMilestone.id === 'roca' ? [{ label: 'Flashcards', view: 'flashcards' as ViewId }] : []),
    ...(selectedMilestone.phaseId === 'navigation' || selectedMilestone.id === 'first-solo' ? [{ label: 'Weather', view: 'weather' as ViewId }] : []),
    { label: 'Ground School', view: 'notes' as ViewId }
  ].map((tool) => [tool.label, tool])).values());

  const selectMilestone = (milestone: RoadmapMilestone) => {
    if (isDetailOpen && selectedMilestoneId === milestone.id) {
      setIsDetailOpen(false);
      touchPhase(milestone.phaseId);
      return;
    }
    setSelectedMilestoneId(milestone.id);
    setIsDetailOpen(true);
    touchPhase(milestone.phaseId);
  };

  const addFlightLog = () => {
    const hours = Number(flightLogDraft.hours);
    if (!flightLogDraft.date && !flightLogDraft.notes.trim() && (!Number.isFinite(hours) || hours <= 0)) return;
    const nextLog = {
      id: `flight-log-${Date.now()}`,
      date: flightLogDraft.date,
      hours: Number.isFinite(hours) ? Math.max(0, hours) : 0,
      notes: flightLogDraft.notes.trim()
    };
    updateRoadmap('begin-flight-instruction', { flightLogs: [...selectedFlightLogs, nextLog] }, 'foundation');
    setFlightLogDraft({ date: '', hours: '', notes: '' });
  };

  const deleteFlightLog = (logId: string) => {
    updateRoadmap('begin-flight-instruction', { flightLogs: selectedFlightLogs.filter((log) => log.id !== logId) }, 'foundation');
  };
  const toggleGroundSchoolKitItem = (item: string) => {
    const currentItems = selectedProgress.kitItems ?? [];
    const nextItems = currentItems.includes(item)
      ? currentItems.filter((kitItem) => kitItem !== item)
      : [...currentItems, item];
    updateRoadmap('ground-school-kit', {
      kitItems: nextItems,
      completed: nextItems.length >= groundSchoolKitItems.length,
      completedDate: nextItems.length >= groundSchoolKitItems.length ? selectedProgress.completedDate || new Date().toISOString().slice(0, 10) : ''
    }, 'foundation');
  };

  useEffect(() => {
    window.localStorage.setItem(ROADMAP_STATE_KEY, JSON.stringify({ selectedMilestoneId: selectedMilestone.id, isDetailOpen }));
  }, [isDetailOpen, selectedMilestone.id]);

  useEffect(() => {
    const milestoneStatuses = Object.fromEntries(
      phases.flatMap((phase) => phase.milestones.map((milestone) => [milestone.id, milestone.status]))
    ) as Record<string, MilestoneStatus>;
    const phaseCompletion = Object.fromEntries(phases.map((phase) => [phase.id, isPhaseComplete(phase)])) as Record<string, boolean>;
    const previousMilestones = priorMilestoneStatuses.current;
    const previousPhases = priorPhaseCompletion.current;

    priorMilestoneStatuses.current = milestoneStatuses;
    priorPhaseCompletion.current = phaseCompletion;

    if (!previousMilestones || !previousPhases) return;

    phases.flatMap((phase) => phase.milestones).forEach((milestone) => {
      if (milestone.status !== 'complete' || previousMilestones[milestone.id] === 'complete') return;
      emitFlightSchoolCelebration({
        type: 'milestone',
        title: milestone.title
      });
    });

    phases.forEach((phase) => {
      if (!phaseCompletion[phase.id] || previousPhases[phase.id]) return;
      emitFlightSchoolCelebration({
        type: 'phase',
        title: `${phase.title} Complete`
      });
    });
  }, [phases]);

  const topCards: Array<{ id: string; label: string; value: string; note: string; icon: ReactNode; onClick?: () => void }> = [
    { id: 'roadmap', label: 'Roadmap', value: `${overallPct}%`, note: 'overall journey', icon: <MapIcon size={22} />, onClick: () => setIsDetailOpen(false) },
    { id: 'foundation', label: 'Foundation', value: `${phases[0]?.percent ?? 0}%`, note: 'phase 1 progress', icon: <ShieldCheck size={22} />, onClick: () => selectMilestone(phases[0].milestones[0]) },
    { id: 'preSolo', label: 'Pre-Solo', value: `${phases[1]?.percent ?? 0}%`, note: 'PSTAR, ROC-A, SPP', icon: <PlaneTakeoff size={22} />, onClick: () => selectMilestone(phases[1].milestones[0]) },
    { id: 'advancedTraining', label: 'Advanced Training', value: `${phases[2]?.percent ?? 0}%`, note: 'XC and instrument basics', icon: <MapIcon size={22} />, onClick: () => selectMilestone(phases[2].milestones[0]) },
    { id: 'finalTesting', label: 'Final Testing', value: `${phases[3]?.percent ?? 0}%`, note: 'PPAER to licence', icon: <FileCheck2 size={22} />, onClick: () => selectMilestone(phases[3].milestones[0]) },
    { id: 'groundSchool', label: 'Ground School', value: `${groundSchoolHours}`, note: 'hours logged', icon: <BookOpen size={22} />, onClick: () => onViewChange('notes') },
    { id: 'pstar', label: 'PSTAR', value: pstarComplete ? 'Ready' : '--', note: pstarLabel, icon: <GraduationCap size={22} />, onClick: () => onViewChange('testing') },
    { id: 'roca', label: 'ROC-A', value: rocaComplete ? 'Done' : 'Testing', note: rocaComplete ? 'recorded complete' : 'available now', icon: <RadioTower size={22} />, onClick: () => onViewChange('testing') },
    { id: 'weather', label: 'Weather', value: data.users[data.activeUserId]?.homeAirport || 'METAR', note: 'pilot habit tool', icon: <CloudSun size={22} />, onClick: () => onViewChange('weather') }
  ];
  const dashboardTileOrder = [
    ...data.dashboardTileOrder.filter((tileId) => DEFAULT_DASHBOARD_TILE_ORDER.includes(tileId)),
    ...DEFAULT_DASHBOARD_TILE_ORDER.filter((tileId) => !data.dashboardTileOrder.includes(tileId))
  ];
  const visibleTopCards = dashboardTileOrder
    .filter((tileId) => !data.dashboardHiddenTiles.includes(tileId))
    .map((tileId) => topCards.find((card) => card.id === tileId))
    .filter((card): card is NonNullable<typeof card> => Boolean(card));
  const selectedMedicalBooked = selectedProgress.booked === true && Boolean(selectedProgress.bookedDate);
  const selectedMedicalPassed = selectedProgress.completed === true && Boolean(selectedProgress.completedDate);

  return <div className="pilot-roadmap">
    <section className="roadmap-hero">
      <div>
        <span className="eyebrow">Private Pilot Journey</span>
        <h2>Good {getDayPart()}, Captain {firstName}.</h2>
        <p>Your path from first ground lesson to Private Pilot Licence.</p>
      </div>
    </section>

    {visibleTopCards.length ? <section className="roadmap-summary" aria-label="Private pilot progress summary">
      {visibleTopCards.map((card) => <button className="roadmap-summary-card" key={card.id} onClick={card.onClick}>
        {card.icon}
        <span>{card.label}</span>
        <strong>{card.value}</strong>
        <small>{card.note}</small>
      </button>)}
    </section> : <section className="roadmap-summary-empty">
      <strong>No dashboard tiles visible</strong>
      <button onClick={() => onViewChange('dashboardEdit')}>Add Tiles</button>
    </section>}

    <section className={isDetailOpen ? 'roadmap-workspace' : 'roadmap-workspace detail-closed'}>
      <div className="roadmap-board" aria-label="Private pilot phases">
        {visiblePhases.map((phase) => {
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
              {phase.milestones.map((milestone) => <button className={isDetailOpen && selectedMilestone.id === milestone.id ? `roadmap-milestone ${milestone.status} active` : `roadmap-milestone ${milestone.status}`} key={milestone.id} onClick={() => selectMilestone(milestone)}>
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
        {isGroundSchoolKitDetail ? <div className="groundschool-kit-card">
          <div className="groundschool-kit-summary">
            <BookOpen size={24} />
            <div>
              <h4>VFC ground school kit</h4>
              <p>Check off the books, charts, tools, and handouts as you collect them.</p>
            </div>
            <strong>{(selectedProgress.kitItems ?? []).length}/{groundSchoolKitItems.length}</strong>
          </div>
          {groundSchoolKitSections.map((section) => <div className="groundschool-kit-section" key={section.title}>
            <h4>{section.title}</h4>
            <div className="groundschool-kit-list">
              {section.items.map((item) => {
                const checked = (selectedProgress.kitItems ?? []).includes(item);
                return <label className={checked ? 'groundschool-kit-item checked' : 'groundschool-kit-item'} key={item}>
                  <input type="checkbox" checked={checked} onChange={() => toggleGroundSchoolKitItem(item)} />
                  <span>{checked ? <CheckCircle2 size={16} /> : null}</span>
                  <strong>{item}</strong>
                </label>;
              })}
            </div>
          </div>)}
        </div> : isGroundSchoolDetail ? <div className="groundschool-detail-card">
          <div className="groundschool-detail-stats">
            <div><strong>{data.classes.length}</strong><span>scheduled</span></div>
            <div><strong>{completedClassCount}</strong><span>complete</span></div>
            <div><strong>{groundSchoolHours}</strong><span>hours</span></div>
          </div>
          <button className="groundschool-open-button" onClick={() => onViewChange('notes')}><BookOpen size={17} />Open Ground School</button>
          <div className="groundschool-schedule-preview">
            <h4>Class Schedule</h4>
            {groundSchoolSchedule.length ? groundSchoolSchedule.map((session, index) => <div className={session.completed ? 'groundschool-schedule-row complete' : 'groundschool-schedule-row'} key={`${session.date}-${session.topics}-${index}`}>
              <span className="groundschool-check">{session.completed ? <CheckCircle2 size={16} /> : index + 1}</span>
              <div>
                <strong>{session.topics || `Class ${index + 1}`}</strong>
                <small>{session.date || 'No date'}{session.instructor ? ` - ${session.instructor}` : ''}</small>
              </div>
            </div>) : <p className="empty-state">No class schedule yet. Open Ground School to add your club, dates, topics, and notes.</p>}
          </div>
        </div> : isMedicalDetail ? <div className="medical-detail-card">
          <div className={selectedMedicalBooked ? 'medical-step complete' : 'medical-step'}>
            <span className="medical-step-icon">{selectedMedicalBooked ? <CheckCircle2 size={17} /> : '1'}</span>
            <div className="medical-step-content">
              <h4>Book the medical</h4>
              <p>Book with a Transport Canada Civil Aviation Medical Examiner.</p>
              <label>
                Appointment date
                <input type="date" value={selectedProgress.bookedDate ?? ''} onChange={(event) => updateRoadmap('medical', { booked: event.target.value ? selectedProgress.booked : false, bookedDate: event.target.value }, 'foundation')} />
              </label>
              <button className={selectedMedicalBooked ? 'medical-action-button complete' : 'medical-action-button'} disabled={!selectedMedicalBooked && !selectedProgress.bookedDate} onClick={() => updateRoadmap('medical', selectedMedicalBooked ? { booked: false, bookedDate: '' } : { booked: true }, 'foundation')}>
                {selectedMedicalBooked ? 'Booked' : 'Mark Booked'}
              </button>
            </div>
          </div>

          <div className={selectedMedicalPassed ? 'medical-step complete' : 'medical-step'}>
            <span className="medical-step-icon">{selectedMedicalPassed ? <CheckCircle2 size={17} /> : '2'}</span>
            <div className="medical-step-content">
              <h4>Acknowledge pass</h4>
              <p>Record the pass and the medical category issued.</p>
              <label>
                Category
                <select value={selectedProgress.category ?? ''} onChange={(event) => updateRoadmap('medical', { category: event.target.value }, 'foundation')}>
                  <option value="">Select category</option>
                  <option value="Category 1">Category 1</option>
                  <option value="Category 3">Category 3</option>
                  <option value="Category 4">Category 4</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Pass date
                <input type="date" value={selectedProgress.completedDate ?? ''} onChange={(event) => updateRoadmap('medical', { completed: event.target.value ? selectedProgress.completed : false, completedDate: event.target.value }, 'foundation')} />
              </label>
              <button className={selectedMedicalPassed ? 'medical-action-button complete' : 'medical-action-button'} disabled={!selectedMedicalPassed && !selectedProgress.completedDate} onClick={() => updateRoadmap('medical', selectedMedicalPassed ? { completed: false } : { completed: true, category: selectedProgress.category || 'Category 3' }, 'foundation')}>
                {selectedMedicalPassed ? 'Undo Pass' : 'Mark Passed'}
              </button>
            </div>
          </div>
        </div> : isFlightInstructionDetail ? <div className="flight-instruction-detail-card">
          <div className={selectedProgress.instructorConfirmed && selectedProgress.instructorName?.trim() ? 'flight-step complete' : 'flight-step'}>
            <span className="flight-step-icon">{selectedProgress.instructorConfirmed && selectedProgress.instructorName?.trim() ? <CheckCircle2 size={17} /> : '1'}</span>
            <div className="flight-step-content">
              <h4>Confirm instructor</h4>
              <p>Add the instructor you are starting lessons with.</p>
              <label>
                Instructor name
                <input value={selectedProgress.instructorName ?? ''} onChange={(event) => updateRoadmap('begin-flight-instruction', { instructorName: event.target.value }, 'foundation')} placeholder="Instructor name" />
              </label>
              <button className={selectedProgress.instructorConfirmed ? 'flight-action-button complete' : 'flight-action-button'} onClick={() => updateRoadmap('begin-flight-instruction', { instructorConfirmed: !selectedProgress.instructorConfirmed }, 'foundation')}>
                {selectedProgress.instructorConfirmed ? 'Instructor Confirmed' : 'Confirm Instructor'}
              </button>
            </div>
          </div>

          <div className={selectedFlightLogs.length ? 'flight-step complete' : 'flight-step'}>
            <span className="flight-step-icon">{selectedFlightLogs.length ? <CheckCircle2 size={17} /> : '2'}</span>
            <div className="flight-step-content">
              <h4>Basic flight log</h4>
              <p>Record the first lessons here as a simple baseline.</p>
              <div className="flight-log-form">
                <label>
                  Day
                  <input type="date" value={flightLogDraft.date} onChange={(event) => setFlightLogDraft({ ...flightLogDraft, date: event.target.value })} />
                </label>
                <label>
                  Hours in the air
                  <input type="number" min="0" step="0.1" value={flightLogDraft.hours} onChange={(event) => setFlightLogDraft({ ...flightLogDraft, hours: event.target.value })} placeholder="0.0" />
                </label>
                <label className="flight-log-notes">
                  Lesson notes
                  <textarea value={flightLogDraft.notes} onChange={(event) => setFlightLogDraft({ ...flightLogDraft, notes: event.target.value })} placeholder="Turns, climbs, radio work, circuit intro..." />
                </label>
                <button className="flight-action-button" onClick={addFlightLog}><Plus size={16} />Add Lesson</button>
              </div>
              {selectedFlightLogs.length ? <div className="flight-log-list">
                <div className="flight-log-total"><strong>{selectedFlightHours.toFixed(1)}</strong><span>hours logged here</span></div>
                {selectedFlightLogs.map((log) => <div className="flight-log-row" key={log.id}>
                  <div>
                    <strong>{log.date || 'No date'} - {log.hours.toFixed(1)} hr</strong>
                    <small>{log.notes || 'No lesson notes yet'}</small>
                  </div>
                  <button className="icon-button" onClick={() => deleteFlightLog(log.id)} aria-label="Delete flight lesson"><Trash2 size={15} /></button>
                </div>)}
              </div> : null}
            </div>
          </div>

          <div className="flight-minimum-note">
            <span className="flight-step-icon">3</span>
            <div>
              <h4>Hour minimums come later</h4>
              <p>The PPL hour rules include dual, solo, cross-country, and instrument requirements. They depend on training progress, so Foundation only tracks getting an instructor and starting lessons.</p>
            </div>
          </div>
        </div> : isStudyDetail ? <div className="study-reminder-card">
          <div className="study-reminder-copy">
            <Layers size={24} />
            <div>
              <h4>Start studying from ground school</h4>
              <p>Use flashcards and mock tests to review the sections you are learning in class. Check this off once you have started studying.</p>
            </div>
          </div>
          <button className={selectedProgress.completed ? 'study-started-button complete' : 'study-started-button'} onClick={() => updateRoadmap('foundation-study-reminder', { completed: !selectedProgress.completed, completedDate: selectedProgress.completedDate || new Date().toISOString().slice(0, 10) }, 'foundation')}>
            <CheckCircle2 size={17} />{selectedProgress.completed ? 'Started Studying' : 'Mark Started Studying'}
          </button>
          <div className="study-reminder-actions">
            <button onClick={() => onViewChange('flashcards')}><Layers size={16} />Open Flashcards</button>
            <button onClick={() => onViewChange('testing')}><FileCheck2 size={16} />Open Mock Tests</button>
          </div>
        </div> : <>
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
        </>}
      </aside> : null}
    </section>
  </div>;
};
