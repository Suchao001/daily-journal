import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '$env/static/private';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase env vars are missing (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
}

export type TinyWinRow = {
  id: number;
  created_at: string | null;
  title: string;
  description: string | null;
  category: string | null;
  completed_at: string | null;
};

export const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export function mapTinyWin(row: TinyWinRow) {
  const createdAt = row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString();
  const completedAt = row.completed_at
    ? new Date(row.completed_at).toISOString()
    : row.created_at
      ? new Date(row.created_at).toISOString()
      : new Date().toISOString();

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    createdAt,
    completedAt
  };
}
