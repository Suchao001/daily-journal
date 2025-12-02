import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mapTinyWin, supabaseAdmin } from '$lib/server/supabase-client';
import { normalizeTitle, parseCompletedAt, sanitizeText } from '$lib/server/tinywin-utils';

export const GET: RequestHandler = async () => {
  const { data, error } = await supabaseAdmin
    .from('tiny-win')
    .select('id, created_at, title, description, category, completed_at')
    .order('completed_at', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json((data ?? []).map(mapTinyWin));
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

  const { data, error } = await supabaseAdmin
    .from('tiny-win')
    .insert({
      title: normalizedTitle,
      description: sanitizeText(description),
      category: sanitizeText(category),
      completed_at: completedAtValue.toISOString()
    })
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(mapTinyWin(data), { status: 201 });
};
