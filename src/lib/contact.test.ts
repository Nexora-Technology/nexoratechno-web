import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseContact, contactEmailHtml, contactSubject } from './contact.ts';

const valid = { name: 'Lan', email: 'lan@example.com', message: 'We need a booking platform.' };

test('accepts a minimal payload and defaults the budget', () => {
  const result = parseContact(valid);
  assert.ok('data' in result);
  assert.equal(result.data.budget, 'unsure');
  assert.deepEqual(result.data.services, []);
});

test('rejects missing name, bad email and short message', () => {
  assert.deepEqual(parseContact({ ...valid, name: ' ' }), { error: 'Name is required' });
  assert.deepEqual(parseContact({ ...valid, email: 'lan@' }), { error: 'Valid email is required' });
  assert.deepEqual(parseContact({ ...valid, message: 'short' }), { error: 'Message must be at least 10 characters' });
  assert.ok('error' in parseContact(null));
});

test('keeps known budget and services, drops unknown values', () => {
  const result = parseContact({ ...valid, budget: '10k-50k', services: ['AI / Data', '<script>'] });
  assert.ok('data' in result);
  assert.equal(result.data.budget, '10k-50k');
  assert.deepEqual(result.data.services, ['AI / Data']);
  const unknown = parseContact({ ...valid, budget: '1m' });
  assert.ok('data' in unknown && unknown.data.budget === 'unsure');
});

test('rejects oversized fields', () => {
  assert.ok('error' in parseContact({ ...valid, message: 'x'.repeat(5001) }));
});

test('escapes user input in the email and includes the budget', () => {
  const result = parseContact({
    ...valid,
    name: '<b>Lan</b>',
    company: 'A & B "Co"',
    message: 'Line one <img src=x onerror=alert(1)>\nLine two',
    budget: 'over-200k',
  });
  assert.ok('data' in result);
  const html = contactEmailHtml(result.data);
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;b&gt;Lan&lt;/b&gt;'));
  assert.ok(html.includes('A &amp; B &quot;Co&quot;'));
  assert.ok(html.includes('Over 200,000 USD'));
  assert.ok(html.includes('Line one &lt;img src=x onerror=alert(1)&gt;<br>Line two'));
});

test('subject strips line breaks from the name', () => {
  const result = parseContact({ ...valid, name: 'Lan\r\nBcc: x@y.z' });
  assert.ok('data' in result);
  assert.ok(!/[\r\n]/.test(contactSubject(result.data)));
});
