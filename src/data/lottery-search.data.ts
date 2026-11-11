import { LotteryType, SearchPattern } from '../types/lottery.types';

/** Equivalence class: valid search patterns ('*' = empty box). */
export const VALID_SEARCH_PATTERNS: { name: string; pattern: SearchPattern; expected: string }[] = [
  { name: 'full 6 digits', pattern: '123456', expected: '123456' },
  { name: 'last 2 digits', pattern: '****56', expected: '****56' },
  { name: 'last 3 digits', pattern: '***456', expected: '***456' },
  { name: 'first 3 digits', pattern: '123***', expected: '123***' },
];

/** Equivalence class: invalid (non-numeric) keys. */
export const INVALID_KEYS: string[] = ['a', 'Z', 'ก', '-', '.', '@'];

/** Decision table: selected type -> expected query param (see LOTTERY_TYPE_PARAM). */
export const TYPE_FILTERS: { type: LotteryType; label: string }[] = [
  { type: 'all', label: 'ทั้งหมด' },
  { type: 'single', label: 'หวยเดี่ยว' },
  { type: 'series', label: 'หวยชุด' },
];
