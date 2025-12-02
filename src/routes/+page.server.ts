import type { PageServerLoad } from './$types';
import { db } from '$lib/db/client';
import { tinyWin } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
  let tinyWinsRaw;
  try {
    tinyWinsRaw = await db
      .select()
      .from(tinyWin)
      .orderBy(desc(tinyWin.completedAt), desc(tinyWin.createdAt));
  } catch (error) {
    console.error('Failed to load tiny wins', error, 'cause:', (error as Error & { cause?: unknown })?.cause);
    throw error;
  }

  return {
    tinyWins: tinyWinsRaw.map(win => ({
      ...win,
      createdAt: win.createdAt?.toISOString() ?? new Date().toISOString(),
      completedAt: win.completedAt?.toISOString() ?? win.createdAt?.toISOString() ?? new Date().toISOString()
    }))
  };
};
