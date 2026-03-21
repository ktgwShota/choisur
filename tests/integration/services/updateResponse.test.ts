import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import { updateResponse } from '@/db/services/schedule';

describe('updateResponse（モック DB）', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('回答が無い場合は Response not found', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            get: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      }),
    } as never);

    const result = await updateResponse({
      scheduleId: 's1',
      respondentId: 'r1',
      name: '名前',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Response not found');
  });

  it('既存があれば更新して id を返す', async () => {
    const existing = {
      id: 3,
      scheduleId: 's1',
      respondentId: 'r1',
      name: '旧',
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

    const result = await updateResponse({
      scheduleId: 's1',
      respondentId: 'r1',
      availability: { '2026-06-15-19:00': 'available' },
    });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(3);
  });
});
