import type { PageServerLoad } from './$types';
import { supabaseAdmin, type TinyWinRow, mapTinyWin } from '$lib/server/supabase-client';

export const load: PageServerLoad = async () => {
  let tinyWinsRaw: TinyWinRow[] = [];
  try {
    const { data, error } = await supabaseAdmin
      .from('tiny-win')
      .select('id, created_at, title, description, category, completed_at')
      .order('completed_at', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    tinyWinsRaw = data ?? [];
  } catch (error) {
    console.error('Failed to load tiny wins', error, 'cause:', (error as Error & { cause?: unknown })?.cause);
    throw error;
  }

  return {
    tinyWins: tinyWinsRaw.map(mapTinyWin)
  };
};
