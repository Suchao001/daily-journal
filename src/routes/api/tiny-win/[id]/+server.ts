import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db/client';
import { tinyWin } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { normalizeTitle, parseCompletedAt, sanitizeText } from '$lib/server/tinywin-utils';

function parseId(idParam?: string) {
  const id = Number(idParam);
  if (!idParam || Number.isNaN(id)) {
    throw new Error('invalid-id');
  }
  return id;
}

export const PUT: RequestHandler = async ({ params, request }) => {
  let id: number;
  try {
    id = parseId(params.id);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }

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
    .update(tinyWin)
    .set({
      title: normalizedTitle,
      description: sanitizeText(description),
      category: sanitizeText(category),
      completedAt: completedAtValue
    })
    .where(eq(tinyWin.id, id))
    .returning();

  if (!win) {
    return json({ error: 'not-found' }, { status: 404 });
  }

  return json(win);
};

export const DELETE: RequestHandler = async ({ params }) => {
  let id: number;
  try {
    id = parseId(params.id);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }

  const [win] = await db.delete(tinyWin).where(eq(tinyWin.id, id)).returning();

  if (!win) {
    return json({ error: 'not-found' }, { status: 404 });
  }

  return json({ success: true });
};
