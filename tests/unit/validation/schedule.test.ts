import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  scheduleDateFormSchema,
  scheduleFormSchema,
  scheduleResponseSchema,
} from '@/db/validation/schedule';

describe('scheduleDateFormSchema', () => {
  it('accepts date and times array', () => {
    const r = scheduleDateFormSchema.safeParse({
      date: '2026-06-15',
      times: ['19:00'],
    });
    expect(r.success).toBe(true);
  });
});

describe('scheduleResponseSchema', () => {
  it('requires non-empty name', () => {
    const r = scheduleResponseSchema.safeParse({ name: '' });
    expect(r.success).toBe(false);
  });

  it('accepts non-empty name', () => {
    const r = scheduleResponseSchema.safeParse({ name: '太郎' });
    expect(r.success).toBe(true);
  });
});

describe('scheduleFormSchema', () => {
  const base = {
    title: '打ち合わせ',
    dates: [{ date: '2026-06-15', times: ['10:00'] }],
    hasAgreedToTerms: true,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('accepts minimal valid form', () => {
    const r = scheduleFormSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it('requires at least one date row', () => {
    const r = scheduleFormSchema.safeParse({ ...base, dates: [] });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.flatten().fieldErrors.dates?.[0]).toBe('日程を1つ以上選択してください');
    }
  });

  it('rejects when terms not agreed', () => {
    const r = scheduleFormSchema.safeParse({ ...base, hasAgreedToTerms: false });
    expect(r.success).toBe(false);
  });

  it('rejects end deadline in the past', () => {
    const r = scheduleFormSchema.safeParse({
      ...base,
      endDate: '2025-06-14',
      endTime: '12:00',
    });
    expect(r.success).toBe(false);
  });

  it('accepts end deadline in the future', () => {
    const r = scheduleFormSchema.safeParse({
      ...base,
      endDate: '2026-12-31',
      endTime: '23:59',
    });
    expect(r.success).toBe(true);
  });
});
