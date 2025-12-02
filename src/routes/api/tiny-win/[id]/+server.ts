import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mapTinyWin, supabaseAdmin } from '$lib/server/supabase-client';
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

  const { data, error } = await supabaseAdmin
    .from('tiny-win')
    .update({
      title: normalizedTitle,
      description: sanitizeText(description),
      category: sanitizeText(category),
      completed_at: completedAtValue.toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return json({ error: 'not-found' }, { status: 404 });
  }

  return json(mapTinyWin(data));
};

export const DELETE: RequestHandler = async ({ params }) => {
  let id: number;
  try {
    id = parseId(params.id);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('tiny-win')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return json({ error: 'not-found' }, { status: 404 });
  }

  return json({ success: true });
};
