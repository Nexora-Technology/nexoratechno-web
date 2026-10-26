import { timingSafeEqual } from 'node:crypto';

/** Constant-time token check; an unset or short expected token never matches. */
export function tokenMatches(expected: string | undefined, given: string | null): boolean {
  if (!expected || expected.length < 32 || !given) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}
