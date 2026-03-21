import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pollFormSchema, pollOptionFormSchema } from '@/db/validation/poll';

describe('pollOptionFormSchema', () => {
  it('accepts title and optional empty url', () => {
    const r = pollOptionFormSchema.safeParse({ title: '候補A', url: '', description: '' });
    expect(r.success).toBe(true);
  });

  it('rejects invalid URL when provided', () => {
    const r = pollOptionFormSchema.safeParse({ title: 'A', url: 'not a url' });
    expect(r.success).toBe(false);
  });

  it('accepts valid http URL', () => {
    const r = pollOptionFormSchema.safeParse({
      title: 'A',
      url: 'https://example.com/path',
    });
    expect(r.success).toBe(true);
  });
});

describe('pollFormSchema', () => {
  const base = {
    title: 'タイトル',
    password: undefined as string | undefined,
    options: [
      { title: 'A', url: '' as string | undefined },
      { title: 'B', url: '' as string | undefined },
    ],
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
    const r = pollFormSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it('requires at least two non-empty option titles', () => {
    const r = pollFormSchema.safeParse({
      ...base,
      options: [
        { title: 'A', url: '' },
        { title: '  ', url: '' },
      ],
    });
    expect(r.success).toBe(false);
  });

  it('rejects when terms not agreed', () => {
    const r = pollFormSchema.safeParse({ ...base, hasAgreedToTerms: false });
    expect(r.success).toBe(false);
  });

  it('rejects title over 50 chars', () => {
    const r = pollFormSchema.safeParse({ ...base, title: 'あ'.repeat(51) });
    expect(r.success).toBe(false);
  });

  it('rejects end date/time in the past', () => {
    const r = pollFormSchema.safeParse({
      ...base,
      endDate: '2025-06-14',
      endTime: '12:00',
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const endTimeErr = r.error.flatten().fieldErrors.endTime;
      expect(endTimeErr?.[0]).toBe('締切日時は現在時刻より後の日時を選択してください');
    }
  });

  it('accepts end date/time in the future', () => {
    const r = pollFormSchema.safeParse({
      ...base,
      endDate: '2025-12-31',
      endTime: '23:59',
    });
    expect(r.success).toBe(true);
  });
});
