import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_STAT_ORDER = ['classes', 'cards', 'accuracy', 'tasks'];
const DEFAULT_TILE_ORDER = ['classes', 'cards', 'accuracy', 'tasks', 'taskList', 'weather', 'progress', 'quickActions'];
const defaultFlightTraining = () => ({
  checklist: [
    { id: 'preflight-docs', label: 'Documents, weather, weight and balance reviewed', checked: false },
    { id: 'briefing', label: 'Lesson objective and emergency plan briefed', checked: false },
    { id: 'before-start', label: 'Before-start flow practiced', checked: false },
    { id: 'runup', label: 'Run-up flow practiced', checked: false },
    { id: 'before-takeoff', label: 'Before-takeoff briefing complete', checked: false },
    { id: 'post-flight', label: 'Post-flight notes and defects recorded', checked: false }
  ],
  outsideChecks: [
    { id: 'left-wing', label: 'Left wing walkaround points reviewed', checked: false },
    { id: 'nose', label: 'Nose, propeller, oil, and air inlets reviewed', checked: false },
    { id: 'right-wing', label: 'Right wing walkaround points reviewed', checked: false },
    { id: 'tail', label: 'Empennage and control surfaces reviewed', checked: false },
    { id: 'fuel', label: 'Fuel quantity, caps, drains, and contamination checks reviewed', checked: false },
    { id: 'final-look', label: 'Final ramp area and tie-down check reviewed', checked: false }
  ],
  schedule: [],
  panelPractice: { throttle: 35, mixture: 100, flaps: 0, heading: 270, altitude: 1200, airspeed: 0, masterOn: false, avionicsOn: false, fuelPumpOn: false }
});

export const getSupabaseServerConfig = () => ({
  url: (process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, ''),
  anonKey: process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? '',
  serviceKey: process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
});

export const createServerClients = () => {
  const config = getSupabaseServerConfig();
  if (!config.url || !config.anonKey || !config.serviceKey) return null;
  const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
  return {
    config,
    admin: createClient(config.url, config.serviceKey, options),
    publicClient: createClient(config.url, config.anonKey, options)
  };
};

export const normalizeLoginName = (value) => String(value ?? '').trim().toLocaleLowerCase('en-CA');

export const verifyConfiguredAdminPassword = (password) => {
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';
  const adminPasswordHash = (process.env.ADMIN_PASSWORD_HASH ?? process.env.VITE_ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase();
  const hashedPassword = createHash('sha256').update(password, 'utf8').digest('hex');
  return Boolean((adminPasswordHash && hashedPassword === adminPasswordHash) || (adminPassword && password === adminPassword));
};

export const emptyUserPayload = () => ({
  homeAirport: '',
  airportSetupRequired: true,
  classes: [],
  todos: [],
  flashcardProgress: {},
  tcHistory: [],
  tcMissedIds: [],
  tcFlashcardSection: 'all',
  rocaHistory: [],
  rocaMissedIds: [],
  rocaFlashcardSection: 'all',
  flightTraining: defaultFlightTraining(),
  dashboardStatOrder: [...DEFAULT_STAT_ORDER],
  dashboardTileOrder: [...DEFAULT_TILE_ORDER],
  dashboardHiddenTiles: []
});

export const legacyUserPayload = (user = {}, root = {}) => ({
  classes: Array.isArray(user.classes) ? user.classes : [],
  todos: Array.isArray(user.todos) ? user.todos : [],
  flashcardProgress: user.flashcardProgress && typeof user.flashcardProgress === 'object' ? user.flashcardProgress : {},
  tcHistory: Array.isArray(user.tcHistory) ? user.tcHistory : [],
  tcMissedIds: Array.isArray(user.tcMissedIds) ? user.tcMissedIds : [],
  rocaHistory: Array.isArray(user.rocaHistory) ? user.rocaHistory : [],
  rocaMissedIds: Array.isArray(user.rocaMissedIds) ? user.rocaMissedIds : [],
  tcFlashcardSection: typeof root.tcFlashcardSection === 'string' ? root.tcFlashcardSection : 'all',
  rocaFlashcardSection: typeof root.rocaFlashcardSection === 'string' ? root.rocaFlashcardSection : 'all',
  flightTraining: user.flightTraining && typeof user.flightTraining === 'object' ? user.flightTraining : defaultFlightTraining(),
  dashboardStatOrder: Array.isArray(root.dashboardStatOrder) ? root.dashboardStatOrder : [...DEFAULT_STAT_ORDER],
  dashboardTileOrder: Array.isArray(root.dashboardTileOrder) ? root.dashboardTileOrder : [...DEFAULT_TILE_ORDER],
  dashboardHiddenTiles: Array.isArray(root.dashboardHiddenTiles) ? root.dashboardHiddenTiles : []
});

export const createAuthUser = async (admin, { firstName, password, role, requiresPasswordReset }) => {
  const email = `${randomUUID()}@users.flightschool.app`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role },
    user_metadata: { first_name: firstName }
  });
  if (error || !data.user) throw error ?? new Error('Supabase did not create the user.');
  return { user: data.user, email };
};

export const randomTemporaryPassword = () => randomBytes(32).toString('base64url');

export const getBearerToken = (request) => {
  const header = request.headers?.authorization ?? request.headers?.Authorization ?? '';
  return typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : '';
};

export const requireAdmin = async (request, clients) => {
  const token = getBearerToken(request);
  if (!token) return null;
  const { data: authData, error: authError } = await clients.admin.auth.getUser(token);
  if (authError || !authData.user) return null;
  const { data: profile, error: profileError } = await clients.admin
    .from('groundschool_profiles')
    .select('id,first_name,login_name,role,requires_password_reset')
    .eq('id', authData.user.id)
    .maybeSingle();
  if (profileError || profile?.role !== 'admin') return null;
  return { authUser: authData.user, profile };
};
