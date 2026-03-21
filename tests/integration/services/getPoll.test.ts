import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import { getPoll } from '@/db/services/poll';

describe('getPoll（モック DB）', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('poll が無い場合は Poll not found', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            get: vi.fn().mockResolvedValue(undefined),
            all: vi.fn(),
          }),
        }),
      }),
    } as never);

    const result = await getPoll('missing');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Poll not found');
  });

  it('poll と選択肢をパースして返す', async () => {
    const pollRow = {
      id: 'p1',
      title: 'タイトル',
      duration: null as number | null,
      endDateTime: null as string | null,
      createdBy: 'u',
      createdAt: '2025-01-01T00:00:00.000Z',
      isClosed: false,
      password: null as string | null,
    };

    const optionRows = [
      {
        id: 1,
        pollId: 'p1',
        optionId: 1,
        url: 'https://example.com',
        title: '候補',
        description: null,
        image: null,
        votes: 1,
        voters: JSON.stringify([{ id: 'v1', name: '花子' }]),
      },
    ];

    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            get: vi.fn().mockResolvedValue(pollRow),
            all: vi.fn().mockResolvedValue(optionRows),
          }),
        }),
      }),
    } as never);

    const result = await getPoll('p1');

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data.title).toBe('タイトル');
      expect(result.data.options[0]?.voters).toEqual([{ id: 'v1', name: '花子' }]);
    }
  });
});
