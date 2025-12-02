import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db/client';
import { tinyWin } from '$lib/db/schema';
import { desc } from 'drizzle-orm';
import { normalizeTitle, parseCompletedAt, sanitizeText } from '$lib/server/tinywin-utils';

export const GET: RequestHandler = async () => {
  const wins = await db
    .select()
    .from(tinyWin)
    .orderBy(desc(tinyWin.completedAt), desc(tinyWin.createdAt));

  return json(wins);
};

export const POST: RequestHandler = async ({ request }) => {
  const { title, description, category, completedAt } = await request.json();
  let normalizedTitle: string;
  let completedAtValue: Date;
  try {
    normalizedTitle = normalizeTitle(title);
    completedAtValue = parseCompletedAt(completedAt);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }

  const [win] = await db
    .insert(tinyWin)
    .values({
      title: normalizedTitle,
      description: sanitizeText(description),
      category: sanitizeText(category),
      completedAt: completedAtValue
    })
    .returning();

  return json(win, { status: 201 });
};
