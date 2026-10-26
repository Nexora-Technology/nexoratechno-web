import { test } from 'node:test';
import assert from 'node:assert/strict';
import { postLanguage, postsForLocale } from './blog-language.ts';
import { sectorOf, presentSectors } from './case-sectors.ts';

const vi = { title: 'Tại Sao Việt Nam Trở Thành Điểm Đến Hàng Đầu Cho Gia Công Phần Mềm Năm 2026' };
const en = { title: 'Why Vietnam Is Becoming a Top Destination for Software Development Outsourcing in 2026' };

test('detects the language of the two published translations', () => {
  assert.equal(postLanguage(vi.title), 'vi');
  assert.equal(postLanguage(en.title), 'en');
  assert.equal(postLanguage('Quy trình tài chính'), 'vi');
});

test('each locale lists only its own translation', () => {
  assert.deepEqual(postsForLocale([vi, en], 'vi'), [vi]);
  assert.deepEqual(postsForLocale([vi, en], 'en'), [en]);
});

test('falls back to every post when a locale has none', () => {
  assert.deepEqual(postsForLocale([en], 'vi'), [en]);
});

test('groups industries into sectors, unknown goes to other', () => {
  assert.equal(sectorOf('Fintech'), 'finance');
  assert.equal(sectorOf('Maritime'), 'travel');
  assert.equal(sectorOf('Retail and Food'), 'commerce');
  assert.equal(sectorOf('Space Mining'), 'other');
});

test('present sectors keep display order and locale labels', () => {
  assert.deepEqual(presentSectors(['Travel', 'Fintech', 'Unknown'], 'vi'), [
    { key: 'finance', label: 'Tài chính' },
    { key: 'travel', label: 'Du lịch & hàng hải' },
    { key: 'other', label: 'Khác' },
  ]);
});
