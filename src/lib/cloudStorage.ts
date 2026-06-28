import type { GroundSchoolData, GroundSchoolUser } from '../types';
import { createEmptyGroundSchoolData, normalizeGroundSchoolData, prepareGroundSchoolDataForSave } from './storage';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const CLOUD_STATE_ID = 'primary';
const CLOUD_TABLE = 'groundschool_app_state';

type CloudStateRow = {
  id: string;
  data: unknown;
  updated_at: string;
};

export type CloudSyncStatus = 'local' | 'loading' | 'online' | 'syncing' | 'error';

type SecureProfileRow = {
  id: string;
  first_name: string;
  login_name: string;
  role: 'admin' | 'student';
  requires_password_reset: boolean;
};

type SecureUserDataRow = {
  user_id: string;
  data: Record<string, unknown>;
  updated_at: string;
};

export const isCloudStorageConfigured = () => isSupabaseConfigured && Boolean(supabase);

export const loadCloudGroundSchoolData = async (): Promise<GroundSchoolData | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(CLOUD_TABLE)
    .select('id,data,updated_at')
    .eq('id', CLOUD_STATE_ID)
    .maybeSingle<CloudStateRow>();

  if (error) throw error;
  return data ? normalizeGroundSchoolData(data.data) : null;
};

export const saveCloudGroundSchoolData = async (data: GroundSchoolData): Promise<void> => {
  if (!supabase) return;

  const cloudData = prepareGroundSchoolDataForSave(data);
  const { error } = await supabase
    .from(CLOUD_TABLE)
    .upsert({ id: CLOUD_STATE_ID, data: cloudData }, { onConflict: 'id' });

  if (error) throw error;
};

const securePayloadFromData = (data: GroundSchoolData) => {
  const prepared = prepareGroundSchoolDataForSave(data);
  const user = prepared.users[prepared.activeUserId];
  return {
    user,
    payload: {
      classes: user.classes,
      todos: user.todos,
      flashcardProgress: user.flashcardProgress,
      tcHistory: user.tcHistory,
      tcMissedIds: user.tcMissedIds,
      homeAirport: user.homeAirport,
      airportSetupRequired: user.airportSetupRequired,
      tcFlashcardSection: prepared.tcFlashcardSection,
      dashboardStatOrder: prepared.dashboardStatOrder,
      dashboardTileOrder: prepared.dashboardTileOrder,
      dashboardHiddenTiles: prepared.dashboardHiddenTiles
    }
  };
};

const secureUserFromRows = (profile: SecureProfileRow, row?: SecureUserDataRow): { user: GroundSchoolUser; payload: Record<string, unknown> } => {
  const payload = row?.data && typeof row.data === 'object' ? row.data : {};
  const normalized = normalizeGroundSchoolData({
    activeUserId: profile.id,
    users: {
      [profile.id]: {
        id: profile.id,
        firstName: profile.first_name,
        role: profile.role,
        requiresPasswordReset: profile.requires_password_reset,
        homeAirport: payload.homeAirport,
        airportSetupRequired: payload.airportSetupRequired,
        classes: payload.classes,
        todos: payload.todos,
        flashcardProgress: payload.flashcardProgress,
        tcHistory: payload.tcHistory,
        tcMissedIds: payload.tcMissedIds
      }
    },
    tcFlashcardSection: payload.tcFlashcardSection,
    dashboardStatOrder: payload.dashboardStatOrder,
    dashboardTileOrder: payload.dashboardTileOrder,
    dashboardHiddenTiles: payload.dashboardHiddenTiles
  });
  return { user: { ...normalized.users[profile.id], requiresPasswordReset: profile.requires_password_reset }, payload };
};

export const loadSecureGroundSchoolData = async (): Promise<GroundSchoolData | null> => {
  if (!supabase) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  const authUserId = sessionData.session?.user.id;
  if (!authUserId) return null;

  const [profilesResult, userDataResult] = await Promise.all([
    supabase.from('groundschool_profiles').select('id,first_name,login_name,role,requires_password_reset'),
    supabase.from('groundschool_user_data').select('user_id,data,updated_at')
  ]);
  if (profilesResult.error) throw profilesResult.error;
  if (userDataResult.error) throw userDataResult.error;

  const profiles = (profilesResult.data ?? []) as SecureProfileRow[];
  const rows = (userDataResult.data ?? []) as SecureUserDataRow[];
  const activeProfile = profiles.find((profile) => profile.id === authUserId);
  if (!activeProfile) return null;

  const rowMap = new Map(rows.map((row) => [row.user_id, row]));
  const users: Record<string, GroundSchoolUser> = {};
  let activePayload: Record<string, unknown> = {};
  profiles.forEach((profile) => {
    const parsed = secureUserFromRows(profile, rowMap.get(profile.id));
    users[profile.id] = parsed.user;
    if (profile.id === authUserId) activePayload = parsed.payload;
  });

  return normalizeGroundSchoolData({
    ...createEmptyGroundSchoolData(),
    activeUserId: authUserId,
    users,
    tcFlashcardSection: activePayload.tcFlashcardSection,
    dashboardStatOrder: activePayload.dashboardStatOrder,
    dashboardTileOrder: activePayload.dashboardTileOrder,
    dashboardHiddenTiles: activePayload.dashboardHiddenTiles
  });
};

export const saveSecureGroundSchoolData = async (data: GroundSchoolData): Promise<void> => {
  if (!supabase) return;
  const { user, payload } = securePayloadFromData(data);
  const { error } = await supabase
    .from('groundschool_user_data')
    .upsert({ user_id: user.id, data: payload }, { onConflict: 'user_id' });
  if (error) throw error;
};
