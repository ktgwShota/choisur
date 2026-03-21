import { describe, expect, it } from 'vitest';
import {
  calculateScore,
  calculateSummary,
  formatScore,
  getDateTimeKey,
  type Response,
} from '@/app/schedule/[id]/types';
import dayjs from '@/lib/dayjs';

describe('getDateTimeKey', () => {
  it('日付と時刻からキーを生成する', () => {
    const d = dayjs('2026-06-15');
    expect(getDateTimeKey(d, '19:00')).toBe('2026-06-15-19:00');
  });

  it('時刻なしは日付のみ', () => {
    const d = dayjs('2026-06-15');
    expect(getDateTimeKey(d)).toBe('2026-06-15');
  });
});

describe('calculateSummary', () => {
  const key = '2026-06-15-19:00';
  const responses: Response[] = [
    {
      name: 'A',
      availability: { [key]: 'available', '2026-06-16-12:00': 'unavailable' },
    },
    {
      name: 'B',
      availability: { [key]: 'maybe' },
    },
    {
      name: 'C',
      availability: { [key]: 'unavailable' },
    },
    { name: 'D', availability: { other: 'available' } },
  ];

  it('キーごとに available / maybe / unavailable を数える', () => {
    const s = calculateSummary(key, responses);
    expect(s.available).toBe(1);
    expect(s.maybe).toBe(1);
    expect(s.unavailable).toBe(1);
    expect(s.total).toBe(4);
  });
});

describe('calculateScore', () => {
  it('○=1, △=0.5 で合計する', () => {
    expect(calculateScore(2, 2)).toBe(3);
    expect(calculateScore(0, 0)).toBe(0);
  });
});

describe('formatScore', () => {
  it('整数は数値のまま', () => {
    expect(formatScore(3)).toBe(3);
  });

  it('小数は文字列1桁', () => {
    expect(formatScore(2.5)).toBe('2.5');
  });
});
