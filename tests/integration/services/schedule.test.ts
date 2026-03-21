import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import { createSchedule } from '@/db/services/schedule';

describe('createSchedule（モック DB による統合風）', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('insert が成功すると success と schedule id を返す', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      insert: () => ({
        values: vi.fn().mockResolvedValue(undefined),
      }),
    } as never);

    const result = await createSchedule({
      title: '打ち合わせ',
      dates: [{ date: '2026-06-15', times: ['19:00'] }],
      createdBy: 'user-1',
    });

    expect(result.success).toBe(true);
    expect(result.data?.id).toMatch(/^\d+$/);
  });

  it('insert が例外なら failure を返す', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      insert: () => ({
        values: vi.fn().mockRejectedValue(new Error('schedule insert failed')),
      }),
    } as never);

    const result = await createSchedule({
      title: 'x',
      dates: [{ date: '2026-06-15', times: ['10:00'] }],
      createdBy: 'u',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('schedule insert failed');
  });
});
