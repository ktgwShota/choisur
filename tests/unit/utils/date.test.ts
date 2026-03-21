import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import dayjs from '@/lib/dayjs';
import { isPastDate } from '@/utils/date';

describe('isPastDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for calendar day before today', () => {
    expect(isPastDate(dayjs('2025-06-14'))).toBe(true);
  });

  it('returns false for today', () => {
    expect(isPastDate(dayjs('2025-06-15'))).toBe(false);
  });

  it('returns false for a future calendar day', () => {
    expect(isPastDate(dayjs('2025-06-16'))).toBe(false);
  });
});
