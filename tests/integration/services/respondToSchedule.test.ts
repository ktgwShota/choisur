import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import { respondToSchedule } from '@/db/services/schedule';

describe('respondToSchedule（モック DB）', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('既存回答があれば update して id を返す', async () => {
    const existing = {
      id: 7,
      scheduleId: 's1',
      respondentId: 'r1',
      name: '旧名',
      availability: '{}',
      createdAt: '',
    };

    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            get: vi.fn().mockResolvedValue(existing),
          }),
        }),
      }),
      update: () => ({
        set: () => ({
          where: () => Promise.resolve(undefined),
        }),
      }),
    } as never);

    const result = await respondToSchedule({
      scheduleId: 's1',
      respondentId: 'r1',
      name: '新名',
      availability: { '2026-06-15-19:00': 'available' },
    });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(7);
  });

  it('新規なら insert の id を返す', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            get: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      }),
      insert: () => ({
        values: () => ({
          returning: () => ({
            get: vi.fn().mockResolvedValue({ id: 42 }),
          }),
        }),
      }),
    } as never);

    const result = await respondToSchedule({
      scheduleId: 's1',
      respondentId: 'r2',
      name: '太郎',
      availability: { '2026-06-15-19:00': 'maybe' },
    });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(42);
  });

  it('例外時は failure', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            get: vi.fn().mockRejectedValue(new Error('select failed')),
          }),
        }),
      }),
    } as never);

    const result = await respondToSchedule({
      scheduleId: 's1',
      respondentId: 'r1',
      name: 'x',
      availability: {},
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('select failed');
  });
});
