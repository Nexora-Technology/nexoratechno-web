import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenMatches } from './revalidate-token.ts';

const token = 'a'.repeat(64);

test('accepts only the exact configured token', () => {
  assert.equal(tokenMatches(token, token), true);
  assert.equal(tokenMatches(token, token.slice(1)), false);
  assert.equal(tokenMatches(token, 'b'.repeat(64)), false);
  assert.equal(tokenMatches(token, null), false);
});

test('rejects everything when the token is unset or too short', () => {
  assert.equal(tokenMatches(undefined, ''), false);
  assert.equal(tokenMatches('', ''), false);
  assert.equal(tokenMatches('short', 'short'), false);
});
