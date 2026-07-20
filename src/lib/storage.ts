import { c172sChecklistLibrary } from '../data/c172sChecklists';
import type { ClassSession, FlashcardReviewStatus, FlightChecklistItem, FlightChecklistTemplate, FlightChecklistTemplateItem, FlightChecklistTemplateSection, FlightScheduleEntry, FlightTrainingData, GroundSchoolData, GroundSchoolUser, RoadmapMilestoneProgress, TcHistoryEntry, Todo } from '../types';

export const STORAGE_KEY = 'groundschool_v496';
export const LEGACY_STORAGE_KEY = 'groundschool_v47';
export const THEME_KEY = 'flightschool_theme';
export const RESTORE_KEY = 'groundschool_restore_payload';
export const DEFAULT_USER_ID = 'user_default';
export const DEFAULT_DASHBOARD_STAT_ORDER = ['classes', 'cards', 'accuracy', 'tasks'];
export const DEFAULT_DASHBOARD_TILE_ORDER = ['classes', 'cards', 'accuracy', 'tasks', 'taskList', 'weather', 'progress', 'quickActions'];

const cloneChecklistLibrary = (library: FlightChecklistTemplate[]): FlightChecklistTemplate[] =>
  library.map((template) => ({
    ...template,
    sections: template.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({ ...item }))
    }))
  }));

export const createDefaultFlightTrainingData = (): FlightTrainingData => ({
  checklist: [
    { id: 'preflight-docs', label: 'Documents, weather, weight and balance reviewed', checked: false },
    { id: 'briefing', label: 'Lesson objective and emergency plan briefed', checked: false },
    { id: 'before-start', label: 'Before-start flow practiced', checked: false },
    { id: 'runup', label: 'Run-up flow practiced', checked: false },
    { id: 'before-takeoff', label: 'Before-takeoff briefing complete', checked: false },
    { id: 'post-flight', label: 'Post-flight notes and defects recorded', checked: false }
  ],
  outsideChecks: [
    { id: 'fuel-oil', label: 'Fuel and oil checks reviewed', checked: false },
    { id: 'cabin-docs', label: 'Cabin and documentation reviewed', checked: false },
    { id: 'left-wing', label: 'Left wing reviewed', checked: false },
    { id: 'right-wing', label: 'Right wing reviewed', checked: false },
    { id: 'fuselage-tail', label: 'Fuselage and tail reviewed', checked: false },
    { id: 'landing-gear', label: 'Landing gear reviewed', checked: false },
    { id: 'prop-engine', label: 'Propeller and engine area reviewed', checked: false }
  ],
  checklistLibrary: cloneChecklistLibrary(c172sChecklistLibrary),
  schedule: [],
  panelPractice: {
    throttle: 35,
    mixture: 100,
    flaps: 0,
    heading: 270,
    altitude: 1200,
    airspeed: 0,
    masterOn: false,
    avionicsOn: false,
    fuelPumpOn: false
  }
});

const normalizeFlashcardProgress = (value: unknown): Record<string, FlashcardReviewStatus> => {
  const progress: Record<string, FlashcardReviewStatus> = {};
  if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([key, status]) => {
      if (typeof key === 'string' && (status === 'known' || status === 'unknown')) progress[key] = status;
    });
  }
  return progress;
};

const normalizeRoadmapProgress = (value: unknown): Record<string, RoadmapMilestoneProgress> => {
  const progress: Record<string, RoadmapMilestoneProgress> = {};
  if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
      if (typeof key !== 'string' || !entry || typeof entry !== 'object') return;
      const item = entry as Record<string, unknown>;
      progress[key] = {
        ...(typeof item.booked === 'boolean' ? { booked: item.booked } : {}),
        ...(typeof item.bookedDate === 'string' ? { bookedDate: item.bookedDate } : {}),
        ...(typeof item.category === 'string' ? { category: item.category } : {}),
        ...(typeof item.completed === 'boolean' ? { completed: item.completed } : {}),
        ...(typeof item.completedDate === 'string' ? { completedDate: item.completedDate } : {}),
        ...(typeof item.hours === 'number' && Number.isFinite(item.hours) ? { hours: Math.max(0, item.hours) } : {}),
        ...(typeof item.notes === 'string' ? { notes: item.notes } : {})
      };
    });
  }
  return progress;
};

const normalizeRoadmapTouchedPhases = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((phaseId): phaseId is string => typeof phaseId === 'string') : [];

const normalizeClasses = (value: unknown): ClassSession[] => Array.isArray(value) ? value
  .map((session) => {
    const item = session && typeof session === 'object' ? session as Record<string, unknown> : {};
    const flashcards = Array.isArray(item.flashcards) ? item.flashcards
      .map((card) => {
        const parsed = card && typeof card === 'object' ? card as Record<string, unknown> : {};
        return { question: typeof parsed.question === 'string' ? parsed.question : '', answer: typeof parsed.answer === 'string' ? parsed.answer : '' };
      })
      .filter((card) => card.question.trim() || card.answer.trim()) : [];
    return {
      date: typeof item.date === 'string' ? item.date : '',
      topics: typeof item.topics === 'string' ? item.topics : '',
      instructor: typeof item.instructor === 'string' ? item.instructor : '',
      club: typeof item.club === 'string' ? item.club : '',
      completed: typeof item.completed === 'boolean' ? item.completed : Boolean(typeof item.notes === 'string' && item.notes.trim()),
      notes: typeof item.notes === 'string' ? item.notes : '',
      flashcards
    };
  })
  .filter((session) => session.date.trim() || session.topics.trim() || session.notes.trim() || session.flashcards.length) : [];

const normalizeTodos = (value: unknown): Todo[] => Array.isArray(value) ? value.map((todo) => {
  const item = todo && typeof todo === 'object' ? todo as Record<string, unknown> : {};
  return { text: typeof item.text === 'string' ? item.text : '', done: typeof item.done === 'boolean' ? item.done : false, dueDate: typeof item.dueDate === 'string' ? item.dueDate : '' };
}) : [];

const normalizeChecklist = (value: unknown, fallback: FlightChecklistItem[]): FlightChecklistItem[] => Array.isArray(value) ? value.map((entry, index) => {
  const item = entry && typeof entry === 'object' ? entry as Record<string, unknown> : {};
  return {
    id: typeof item.id === 'string' && item.id ? item.id : `item-${index}`,
    label: typeof item.label === 'string' ? item.label : '',
    checked: typeof item.checked === 'boolean' ? item.checked : false
  };
}).filter((item) => item.label.trim()) : fallback;

const normalizeFlightSchedule = (value: unknown): FlightScheduleEntry[] => Array.isArray(value) ? value.map((entry, index) => {
  const item = entry && typeof entry === 'object' ? entry as Record<string, unknown> : {};
  return {
    id: typeof item.id === 'string' && item.id ? item.id : `flight-${index}`,
    date: typeof item.date === 'string' ? item.date : '',
    aircraft: typeof item.aircraft === 'string' ? item.aircraft : '',
    instructor: typeof item.instructor === 'string' ? item.instructor : '',
    focus: typeof item.focus === 'string' ? item.focus : '',
    notes: typeof item.notes === 'string' ? item.notes : '',
    completed: typeof item.completed === 'boolean' ? item.completed : false
  };
}) : [];

const normalizeChecklistTemplateItem = (value: unknown, fallbackId: string): FlightChecklistTemplateItem | null => {
  const item = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const text = typeof item.text === 'string' ? item.text.trim() : '';
  if (!text) return null;
  return {
    id: typeof item.id === 'string' && item.id.trim() ? item.id : fallbackId,
    text
  };
};

const normalizeChecklistTemplateSection = (value: unknown, fallbackId: string): FlightChecklistTemplateSection | null => {
  const item = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const title = typeof item.title === 'string' ? item.title.trim() : '';
  const id = typeof item.id === 'string' && item.id.trim() ? item.id : fallbackId;
  const items = Array.isArray(item.items)
    ? item.items
      .map((entry, index) => normalizeChecklistTemplateItem(entry, `${id}-${index + 1}`))
      .filter((entry): entry is FlightChecklistTemplateItem => Boolean(entry))
    : [];
  if (!title || !items.length) return null;
  return { id, title, items };
};

const normalizeChecklistTemplate = (value: unknown, fallbackId: string): FlightChecklistTemplate | null => {
  const item = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const id = typeof item.id === 'string' && item.id.trim() ? item.id : fallbackId;
  const aircraft = typeof item.aircraft === 'string' && item.aircraft.trim() ? item.aircraft.trim() : 'C-172S';
  const title = typeof item.title === 'string' ? item.title.trim() : '';
  const category = item.category === 'emergency' ? 'emergency' : 'normal';
  const source = typeof item.source === 'string' && item.source.trim() ? item.source.trim() : 'Flight School checklist';
  const revisionDate = typeof item.revisionDate === 'string' && item.revisionDate.trim() ? item.revisionDate.trim() : '';
  const sections = Array.isArray(item.sections)
    ? item.sections
      .map((entry, index) => normalizeChecklistTemplateSection(entry, `${id}-section-${index + 1}`))
      .filter((entry): entry is FlightChecklistTemplateSection => Boolean(entry))
    : [];
  if (!title || !sections.length) return null;
  return { id, aircraft, title, category, source, revisionDate, sections };
};

const normalizeChecklistLibrary = (value: unknown, fallback: FlightChecklistTemplate[]): FlightChecklistTemplate[] => {
  const parsed = Array.isArray(value)
    ? value
      .map((entry, index) => normalizeChecklistTemplate(entry, `checklist-template-${index + 1}`))
      .filter((entry): entry is FlightChecklistTemplate => Boolean(entry))
    : [];
  const templatesById = new Map(parsed.map((template) => [template.id, template]));
  cloneChecklistLibrary(fallback).forEach((template) => {
    if (!templatesById.has(template.id)) templatesById.set(template.id, template);
  });
  return Array.from(templatesById.values());
};

const normalizeFlightTraining = (value: unknown): FlightTrainingData => {
  const fallback = createDefaultFlightTrainingData();
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const panel = source.panelPractice && typeof source.panelPractice === 'object' ? source.panelPractice as Record<string, unknown> : {};
  return {
    checklist: normalizeChecklist(source.checklist, fallback.checklist),
    outsideChecks: normalizeChecklist(source.outsideChecks, fallback.outsideChecks),
    checklistLibrary: normalizeChecklistLibrary(source.checklistLibrary, fallback.checklistLibrary),
    schedule: normalizeFlightSchedule(source.schedule),
    panelPractice: {
      throttle: typeof panel.throttle === 'number' ? panel.throttle : fallback.panelPractice.throttle,
      mixture: typeof panel.mixture === 'number' ? panel.mixture : fallback.panelPractice.mixture,
      flaps: typeof panel.flaps === 'number' ? panel.flaps : fallback.panelPractice.flaps,
      heading: typeof panel.heading === 'number' ? panel.heading : fallback.panelPractice.heading,
      altitude: typeof panel.altitude === 'number' ? panel.altitude : fallback.panelPractice.altitude,
      airspeed: typeof panel.airspeed === 'number' ? panel.airspeed : fallback.panelPractice.airspeed,
      masterOn: typeof panel.masterOn === 'boolean' ? panel.masterOn : fallback.panelPractice.masterOn,
      avionicsOn: typeof panel.avionicsOn === 'boolean' ? panel.avionicsOn : fallback.panelPractice.avionicsOn,
      fuelPumpOn: typeof panel.fuelPumpOn === 'boolean' ? panel.fuelPumpOn : fallback.panelPractice.fuelPumpOn
    }
  };
};

const normalizeTcHistory = (value: unknown): TcHistoryEntry[] => Array.isArray(value) ? value.map((entry) => {
  const item = entry && typeof entry === 'object' ? entry as Record<string, unknown> : {};
  return {
    title: typeof item.title === 'string' ? item.title : 'TC PSTAR Practice',
    source: typeof item.source === 'string' ? item.source : undefined,
    score: typeof item.score === 'number' ? item.score : undefined,
    total: typeof item.total === 'number' ? item.total : undefined,
    percent: typeof item.percent === 'number' ? item.percent : 0,
    date: typeof item.date === 'string' ? item.date : undefined,
    completedAt: typeof item.completedAt === 'string' ? item.completedAt : undefined,
    missed: Array.isArray(item.missed) ? item.missed.filter((id): id is string => typeof id === 'string') : undefined
  };
}) : [];

const normalizeTcMissedIds = (value: unknown): string[] => Array.isArray(value)
  ? value.filter((id): id is string => typeof id === 'string')
  : [];

export const createGroundSchoolUser = (id = DEFAULT_USER_ID, firstName = 'Pilot', role: GroundSchoolUser['role'] = 'student', passwordHash?: string): GroundSchoolUser => ({
  id,
  firstName,
  role,
  ...(passwordHash ? { passwordHash } : {}),
  classes: [],
  todos: [],
  flashcardProgress: {},
  roadmapProgress: {},
  roadmapTouchedPhases: [],
  tcHistory: [],
  tcMissedIds: [],
  rocaHistory: [],
  rocaMissedIds: [],
  rocaFlashcardSection: 'all',
  flightTraining: createDefaultFlightTrainingData()
});

export const createEmptyGroundSchoolData = (): GroundSchoolData => {
  const user = createGroundSchoolUser(DEFAULT_USER_ID, 'Pilot', 'admin');
  return {
    activeUserId: user.id,
    users: { [user.id]: user },
    classes: [],
    todos: [],
    tcHistory: [],
    tcMissedIds: [],
    tcFlashcardSection: 'all',
    rocaHistory: [],
    rocaMissedIds: [],
    rocaFlashcardSection: 'all',
    dashboardStatOrder: [...DEFAULT_DASHBOARD_STAT_ORDER],
    dashboardTileOrder: [...DEFAULT_DASHBOARD_TILE_ORDER],
    dashboardHiddenTiles: [],
    roadmapProgress: {},
    roadmapTouchedPhases: [],
    flashcardProgress: {},
    flightTraining: createDefaultFlightTrainingData()
  };
};

const safeParse = (value: string | null): unknown => {
  if (!value) return null;
  try { return JSON.parse(value); } catch (error) {
    console.warn('Stored Flight School data could not be read.', error);
    return null;
  }
};

export const syncActiveUserData = (data: GroundSchoolData): GroundSchoolData => {
  const activeId = data.activeUserId || DEFAULT_USER_ID;
  const currentUser = data.users[activeId] ?? createGroundSchoolUser(activeId);
  return {
    ...data,
    activeUserId: activeId,
    users: {
      ...data.users,
      [activeId]: {
        ...currentUser,
        classes: data.classes,
        todos: data.todos,
        flashcardProgress: data.flashcardProgress,
        tcHistory: data.tcHistory,
        tcMissedIds: data.tcMissedIds,
        rocaHistory: data.rocaHistory,
        rocaMissedIds: data.rocaMissedIds,
        rocaFlashcardSection: data.rocaFlashcardSection,
        flightTraining: data.flightTraining,
        dashboardStatOrder: [...data.dashboardStatOrder],
        dashboardTileOrder: [...data.dashboardTileOrder],
        dashboardHiddenTiles: [...data.dashboardHiddenTiles],
        roadmapProgress: data.roadmapProgress,
        roadmapTouchedPhases: [...data.roadmapTouchedPhases]
      }
    }
  };
};

export const activateUserData = (data: GroundSchoolData, userId: string): GroundSchoolData => {
  const synced = syncActiveUserData(data);
  const nextUser = synced.users[userId] ?? createGroundSchoolUser(userId);
  return {
    ...synced,
    activeUserId: nextUser.id,
    users: { ...synced.users, [nextUser.id]: nextUser },
    classes: nextUser.classes,
    todos: nextUser.todos,
    flashcardProgress: nextUser.flashcardProgress,
    tcHistory: nextUser.tcHistory,
    tcMissedIds: nextUser.tcMissedIds,
    rocaHistory: nextUser.rocaHistory ?? [],
    rocaMissedIds: nextUser.rocaMissedIds ?? [],
    rocaFlashcardSection: nextUser.rocaFlashcardSection ?? 'all',
    flightTraining: nextUser.flightTraining ?? createDefaultFlightTrainingData(),
    dashboardStatOrder: nextUser.dashboardStatOrder?.length ? [...nextUser.dashboardStatOrder] : [...DEFAULT_DASHBOARD_STAT_ORDER],
    dashboardTileOrder: nextUser.dashboardTileOrder?.length ? [...nextUser.dashboardTileOrder] : [...DEFAULT_DASHBOARD_TILE_ORDER],
    dashboardHiddenTiles: nextUser.dashboardHiddenTiles ? [...nextUser.dashboardHiddenTiles] : [],
    roadmapProgress: normalizeRoadmapProgress(nextUser.roadmapProgress),
    roadmapTouchedPhases: normalizeRoadmapTouchedPhases(nextUser.roadmapTouchedPhases)
  };
};

export const addGroundSchoolUser = (data: GroundSchoolData, firstName: string, role: GroundSchoolUser['role'] = 'student', makeActive = true, passwordHash?: string): GroundSchoolData => {
  const synced = syncActiveUserData(data);
  const id = `user_${Date.now()}`;
  const nextUser = createGroundSchoolUser(id, firstName.trim() || 'Pilot', role, passwordHash);
  const nextData = { ...synced, users: { ...synced.users, [id]: nextUser } };
  return makeActive ? activateUserData(nextData, id) : nextData;
};

export const setGroundSchoolUserPasswordHash = (data: GroundSchoolData, userId: string, passwordHash: string): GroundSchoolData => {
  const synced = syncActiveUserData(data);
  const user = synced.users[userId];
  if (!user || user.role !== 'student') return synced;
  return {
    ...synced,
    users: {
      ...synced.users,
      [userId]: { ...user, passwordHash }
    }
  };
};

export const renameGroundSchoolUser = (data: GroundSchoolData, userId: string, firstName: string): GroundSchoolData => {
  const synced = syncActiveUserData(data);
  const user = synced.users[userId];
  if (!user) return synced;
  return {
    ...synced,
    users: {
      ...synced.users,
      [userId]: { ...user, firstName: firstName.trim() || 'Pilot' }
    }
  };
};

export const deleteGroundSchoolUser = (data: GroundSchoolData, userId: string): GroundSchoolData => {
  const synced = syncActiveUserData(data);
  const users = { ...synced.users };
  const target = users[userId];
  if (!target) return synced;

  const remainingUsers = Object.values(users).filter((user) => user.id !== userId);
  const adminCount = Object.values(users).filter((user) => user.role === 'admin').length;
  if (!remainingUsers.length || (target.role === 'admin' && adminCount <= 1)) return synced;

  delete users[userId];
  const nextActiveId = synced.activeUserId === userId
    ? (remainingUsers.find((user) => user.role === 'admin') ?? remainingUsers[0]).id
    : synced.activeUserId;
  const nextActiveUser = users[nextActiveId] ?? remainingUsers[0];

  return {
    ...synced,
    activeUserId: nextActiveUser.id,
    users,
    classes: nextActiveUser.classes,
    todos: nextActiveUser.todos,
    flashcardProgress: nextActiveUser.flashcardProgress,
    tcHistory: nextActiveUser.tcHistory,
    tcMissedIds: nextActiveUser.tcMissedIds,
    rocaHistory: nextActiveUser.rocaHistory ?? [],
    rocaMissedIds: nextActiveUser.rocaMissedIds ?? [],
    rocaFlashcardSection: nextActiveUser.rocaFlashcardSection ?? 'all',
    flightTraining: nextActiveUser.flightTraining ?? createDefaultFlightTrainingData(),
    dashboardStatOrder: nextActiveUser.dashboardStatOrder?.length ? [...nextActiveUser.dashboardStatOrder] : [...DEFAULT_DASHBOARD_STAT_ORDER],
    dashboardTileOrder: nextActiveUser.dashboardTileOrder?.length ? [...nextActiveUser.dashboardTileOrder] : [...DEFAULT_DASHBOARD_TILE_ORDER],
    dashboardHiddenTiles: nextActiveUser.dashboardHiddenTiles ? [...nextActiveUser.dashboardHiddenTiles] : [],
    roadmapProgress: normalizeRoadmapProgress(nextActiveUser.roadmapProgress),
    roadmapTouchedPhases: normalizeRoadmapTouchedPhases(nextActiveUser.roadmapTouchedPhases)
  };
};

export const parseGroundSchoolJson = (value: string): GroundSchoolData | null => {
  const parsed = safeParse(value);
  if (!parsed) return null;
  const importValue = parsed && typeof parsed === 'object' && 'data' in parsed
    ? (parsed as { data: unknown }).data
    : parsed;
  return normalizeGroundSchoolData(importValue);
};

export const normalizeGroundSchoolData = (value: unknown): GroundSchoolData => {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const data = createEmptyGroundSchoolData();
  const sourceUsers = source.users && typeof source.users === 'object' ? source.users as Record<string, unknown> : {};
  const users: Record<string, GroundSchoolUser> = {};
  const legacyTcHistory = normalizeTcHistory(source.tcHistory);
  const legacyTcMissedIds = normalizeTcMissedIds(source.tcMissedIds);
  const legacyRocaHistory = normalizeTcHistory(source.rocaHistory);
  const legacyRocaMissedIds = normalizeTcMissedIds(source.rocaMissedIds);
  const hasPerUserPstarData = Object.values(sourceUsers).some((value) => {
    const item = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    return 'tcHistory' in item || 'tcMissedIds' in item;
  });
  const hasPerUserRocaData = Object.values(sourceUsers).some((value) => {
    const item = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    return 'rocaHistory' in item || 'rocaMissedIds' in item;
  });

  Object.entries(sourceUsers).forEach(([id, value]) => {
    const item = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    const safeId = typeof item.id === 'string' ? item.id : id;
    const fallbackRole = Object.keys(users).length ? 'student' : 'admin';
    users[safeId] = {
      id: safeId,
      firstName: typeof item.firstName === 'string' && item.firstName.trim() ? item.firstName : 'Pilot',
      role: item.role === 'admin' || item.role === 'student' ? item.role : fallbackRole,
      ...(typeof item.passwordHash === 'string' && item.passwordHash ? { passwordHash: item.passwordHash } : {}),
      ...(typeof item.requiresPasswordReset === 'boolean' ? { requiresPasswordReset: item.requiresPasswordReset } : {}),
      ...(typeof item.homeAirport === 'string' && /^[A-Z]{4}$/.test(item.homeAirport.trim().toUpperCase()) ? { homeAirport: item.homeAirport.trim().toUpperCase() } : {}),
      ...(item.airportSetupRequired === true ? { airportSetupRequired: true } : {}),
      ...(Array.isArray(item.dashboardStatOrder) ? { dashboardStatOrder: item.dashboardStatOrder.filter((tileId): tileId is string => typeof tileId === 'string' && DEFAULT_DASHBOARD_STAT_ORDER.includes(tileId)) } : {}),
      ...(Array.isArray(item.dashboardTileOrder) ? { dashboardTileOrder: item.dashboardTileOrder.filter((tileId): tileId is string => typeof tileId === 'string' && DEFAULT_DASHBOARD_TILE_ORDER.includes(tileId)) } : {}),
      ...(Array.isArray(item.dashboardHiddenTiles) ? { dashboardHiddenTiles: item.dashboardHiddenTiles.filter((tileId): tileId is string => typeof tileId === 'string' && DEFAULT_DASHBOARD_TILE_ORDER.includes(tileId)) } : {}),
      roadmapProgress: normalizeRoadmapProgress(item.roadmapProgress),
      roadmapTouchedPhases: normalizeRoadmapTouchedPhases(item.roadmapTouchedPhases),
      classes: normalizeClasses(item.classes),
      todos: normalizeTodos(item.todos),
      flashcardProgress: normalizeFlashcardProgress(item.flashcardProgress),
      tcHistory: normalizeTcHistory(item.tcHistory),
      tcMissedIds: normalizeTcMissedIds(item.tcMissedIds),
      rocaHistory: normalizeTcHistory(item.rocaHistory),
      rocaMissedIds: normalizeTcMissedIds(item.rocaMissedIds),
      rocaFlashcardSection: typeof item.rocaFlashcardSection === 'string' ? item.rocaFlashcardSection : 'all',
      flightTraining: normalizeFlightTraining(item.flightTraining)
    };
  });

  if (!Object.keys(users).length) {
    users[DEFAULT_USER_ID] = {
      id: DEFAULT_USER_ID,
      firstName: typeof source.firstName === 'string' && source.firstName.trim() ? source.firstName : 'Pilot',
      role: 'admin',
      classes: normalizeClasses(source.classes),
      todos: normalizeTodos(source.todos),
      flashcardProgress: normalizeFlashcardProgress(source.flashcardProgress),
      roadmapProgress: normalizeRoadmapProgress(source.roadmapProgress),
      roadmapTouchedPhases: normalizeRoadmapTouchedPhases(source.roadmapTouchedPhases),
      tcHistory: [],
      tcMissedIds: [],
      rocaHistory: [],
      rocaMissedIds: [],
      rocaFlashcardSection: 'all',
      flightTraining: normalizeFlightTraining(source.flightTraining)
    };
  }

  const requestedUserId = typeof source.activeUserId === 'string' && users[source.activeUserId] ? source.activeUserId : Object.keys(users)[0];
  if (!hasPerUserPstarData) {
    const legacyOwner = Object.values(users).find((user) => user.role === 'admin') ?? users[requestedUserId];
    users[legacyOwner.id] = { ...legacyOwner, tcHistory: legacyTcHistory, tcMissedIds: legacyTcMissedIds };
  }
  if (!hasPerUserRocaData) {
    const legacyOwner = Object.values(users).find((user) => user.role === 'admin') ?? users[requestedUserId];
    users[legacyOwner.id] = { ...legacyOwner, rocaHistory: legacyRocaHistory, rocaMissedIds: legacyRocaMissedIds };
  }
  const activeUser = users[requestedUserId];
  data.activeUserId = requestedUserId;
  data.users = users;
  data.classes = activeUser.classes;
  data.todos = activeUser.todos;
  data.flashcardProgress = activeUser.flashcardProgress;
  data.tcHistory = activeUser.tcHistory;
  data.tcMissedIds = activeUser.tcMissedIds;
  data.tcFlashcardSection = typeof source.tcFlashcardSection === 'string' ? source.tcFlashcardSection : 'all';
  data.rocaHistory = activeUser.rocaHistory ?? [];
  data.rocaMissedIds = activeUser.rocaMissedIds ?? [];
  data.rocaFlashcardSection = activeUser.rocaFlashcardSection ?? (typeof source.rocaFlashcardSection === 'string' ? source.rocaFlashcardSection : 'all');
  data.flightTraining = activeUser.flightTraining ?? createDefaultFlightTrainingData();
  data.dashboardStatOrder = Array.isArray(source.dashboardStatOrder) ? source.dashboardStatOrder.filter((id): id is string => DEFAULT_DASHBOARD_STAT_ORDER.includes(String(id))) : [...DEFAULT_DASHBOARD_STAT_ORDER];
  DEFAULT_DASHBOARD_STAT_ORDER.forEach((id) => { if (!data.dashboardStatOrder.includes(id)) data.dashboardStatOrder.push(id); });
  const legacyTileOrder = [...data.dashboardStatOrder, 'weather', 'progress', 'quickActions'];
  data.dashboardTileOrder = Array.isArray(source.dashboardTileOrder) ? source.dashboardTileOrder.filter((id): id is string => DEFAULT_DASHBOARD_TILE_ORDER.includes(String(id))) : legacyTileOrder;
  DEFAULT_DASHBOARD_TILE_ORDER.forEach((id) => { if (!data.dashboardTileOrder.includes(id)) data.dashboardTileOrder.push(id); });
  data.dashboardHiddenTiles = Array.isArray(source.dashboardHiddenTiles) ? source.dashboardHiddenTiles.filter((id): id is string => DEFAULT_DASHBOARD_TILE_ORDER.includes(String(id))) : [];
  data.roadmapProgress = normalizeRoadmapProgress(activeUser.roadmapProgress ?? source.roadmapProgress);
  data.roadmapTouchedPhases = normalizeRoadmapTouchedPhases(activeUser.roadmapTouchedPhases ?? source.roadmapTouchedPhases);
  return data;
};

export const loadGroundSchoolData = (): GroundSchoolData => {
  const restore = safeParse(window.localStorage.getItem(RESTORE_KEY));
  if (restore) {
    const data = normalizeGroundSchoolData(restore);
    window.localStorage.removeItem(RESTORE_KEY);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(syncActiveUserData(data)));
    return data;
  }

  const current = safeParse(window.localStorage.getItem(STORAGE_KEY));
  const legacy = safeParse(window.localStorage.getItem(LEGACY_STORAGE_KEY));
  const data = normalizeGroundSchoolData(current ?? legacy);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(syncActiveUserData(data)));
  return data;
};

export const prepareGroundSchoolDataForSave = (data: GroundSchoolData): GroundSchoolData =>
  normalizeGroundSchoolData(syncActiveUserData(data));

export const saveGroundSchoolData = (data: GroundSchoolData) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prepareGroundSchoolDataForSave(data)));
};
