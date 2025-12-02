export function parseCompletedAt(input?: string) {
  if (!input) {
    return new Date();
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('invalid-completed-at');
  }

  return parsed;
}

export function sanitizeText(value?: string | null) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function normalizeTitle(value?: string | null) {
  const trimmed = sanitizeText(value);
  if (!trimmed) {
    throw new Error('title-required');
  }

  return trimmed;
}
