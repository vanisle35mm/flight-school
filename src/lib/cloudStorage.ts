import type { GroundSchoolData } from '../types';
import { normalizeGroundSchoolData, syncActiveUserData } from './storage';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const CLOUD_STATE_ID = 'primary';
const CLOUD_TABLE = 'groundschool_app_state';

type CloudStateRow = {
  id: string;
  data: unknown;
  updated_at: string;
};

export type CloudSyncStatus = 'local' | 'loading' | 'online' | 'syncing' | 'error';

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

  const cloudData = syncActiveUserData(normalizeGroundSchoolData(data));
  const { error } = await supabase
    .from(CLOUD_TABLE)
    .upsert({ id: CLOUD_STATE_ID, data: cloudData }, { onConflict: 'id' });

  if (error) throw error;
};
