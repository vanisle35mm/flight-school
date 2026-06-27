import type { ClassSession, FlashcardReviewStatus, GroundSchoolData, GroundSchoolUser, TcHistoryEntry, Todo } from '../types';

export const STORAGE_KEY = 'groundschool_v496';
export const LEGACY_STORAGE_KEY = 'groundschool_v47';
export const THEME_KEY = 'flightschool_theme';
export const RESTORE_KEY = 'groundschool_restore_payload';
export const DEFAULT_USER_ID = 'user_default';
export const DEFAULT_DASHBOARD_STAT_ORDER = ['classes', 'cards', 'accuracy', 'tasks'];
export const DEFAULT_DASHBOARD_TILE_ORDER = ['classes', 'cards', 'accuracy', 'tasks', 'taskList', 'weather', 'progress', 'quickActions'];

const normalizeFlashcardProgress = (value: unknown): Record<string, FlashcardReviewStatus> => {
  const progress: Record<string, FlashcardReviewStatus> = {};
  if (value && typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([key, status]) => {
      if (typeof key === 'string' && (status === 'known' || status === 'unknown')) progress[key] = status;
    });
  }
  return progress;
};

const normalizeClasses = (value: unknown): ClassSession[] => Array.isArray(value) ? value.map((session) => {
  const item = session && typeof session === 'object' ? session as Record<string, unknown> : {};
  return {
    date: typeof item.date === 'string' ? item.date : '',
    topics: typeof item.topics === 'string' ? item.topics : '',
    notes: typeof item.notes === 'string' ? item.notes : '',
    flashcards: Array.isArray(item.flashcards) ? item.flashcards.map((card) => {
      const parsed = card && typeof card === 'object' ? card as Record<string, unknown> : {};
      return { question: typeof parsed.question === 'string' ? parsed.question : '', answer: typeof parsed.answer === 'string' ? parsed.answer : '' };
    }) : []
  };
}) : [];

const normalizeTodos = (value: unknown): Todo[] => Array.isArray(value) ? value.map((todo) => {
  const item = todo && typeof todo === 'object' ? todo as Record<string, unknown> : {};
  return { text: typeof item.text === 'string' ? item.text : '', done: typeof item.done === 'boolean' ? item.done : false, dueDate: typeof item.dueDate === 'string' ? item.dueDate : '' };
}) : [];

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
  tcHistory: [],
  tcMissedIds: []
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
    dashboardStatOrder: [...DEFAULT_DASHBOARD_STAT_ORDER],
    dashboardTileOrder: [...DEFAULT_DASHBOARD_TILE_ORDER],
    dashboardHiddenTiles: [],
    flashcardProgress: {}
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
        tcMissedIds: data.tcMissedIds
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
    tcMissedIds: nextUser.tcMissedIds
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
    tcMissedIds: nextActiveUser.tcMissedIds
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
  const hasPerUserPstarData = Object.values(sourceUsers).some((value) => {
    const item = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    return 'tcHistory' in item || 'tcMissedIds' in item;
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
      classes: normalizeClasses(item.classes),
      todos: normalizeTodos(item.todos),
      flashcardProgress: normalizeFlashcardProgress(item.flashcardProgress),
      tcHistory: normalizeTcHistory(item.tcHistory),
      tcMissedIds: normalizeTcMissedIds(item.tcMissedIds)
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
      tcHistory: [],
      tcMissedIds: []
    };
  }

  const requestedUserId = typeof source.activeUserId === 'string' && users[source.activeUserId] ? source.activeUserId : Object.keys(users)[0];
  if (!hasPerUserPstarData) {
    const legacyOwner = Object.values(users).find((user) => user.role === 'admin') ?? users[requestedUserId];
    users[legacyOwner.id] = { ...legacyOwner, tcHistory: legacyTcHistory, tcMissedIds: legacyTcMissedIds };
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
  data.dashboardStatOrder = Array.isArray(source.dashboardStatOrder) ? source.dashboardStatOrder.filter((id): id is string => DEFAULT_DASHBOARD_STAT_ORDER.includes(String(id))) : [...DEFAULT_DASHBOARD_STAT_ORDER];
  DEFAULT_DASHBOARD_STAT_ORDER.forEach((id) => { if (!data.dashboardStatOrder.includes(id)) data.dashboardStatOrder.push(id); });
  const legacyTileOrder = [...data.dashboardStatOrder, 'weather', 'progress', 'quickActions'];
  data.dashboardTileOrder = Array.isArray(source.dashboardTileOrder) ? source.dashboardTileOrder.filter((id): id is string => DEFAULT_DASHBOARD_TILE_ORDER.includes(String(id))) : legacyTileOrder;
  DEFAULT_DASHBOARD_TILE_ORDER.forEach((id) => { if (!data.dashboardTileOrder.includes(id)) data.dashboardTileOrder.push(id); });
  data.dashboardHiddenTiles = Array.isArray(source.dashboardHiddenTiles) ? source.dashboardHiddenTiles.filter((id): id is string => DEFAULT_DASHBOARD_TILE_ORDER.includes(String(id))) : [];
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

export const saveGroundSchoolData = (data: GroundSchoolData) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(syncActiveUserData(normalizeGroundSchoolData(data))));
};
