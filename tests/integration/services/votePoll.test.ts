import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import { votePoll } from '@/db/services/poll';

describe('votePoll（モック DB）', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('選択肢が無い場合は Option not found', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            all: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    } as never);

    const result = await votePoll({
      pollId: 'p1',
      optionId: 1,
      voterId: 'v1',
      voterName: '太郎',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Option not found');
  });

  it('新規投票で対象に票が加算される', async () => {
    const optionRows = [
      {
        id: 1,
        pollId: 'p1',
        optionId: 1,
        url: 'https://a.example.com',
        title: 'A',
        description: null,
        image: null,
        votes: 0,
        voters: '[]',
      },
      {
        id: 2,
        pollId: 'p1',
        optionId: 2,
        url: 'https://b.example.com',
        title: 'B',
        description: null,
        image: null,
        votes: 0,
        voters: '[]',
      },
    ];

    const update = vi.fn(() => ({
      set: () => ({
        where: () => Promise.resolve(undefined),
      }),
    }));

    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            all: vi.fn().mockResolvedValue(optionRows),
          }),
        }),
      }),
      update,
    } as never);

    const result = await votePoll({
      pollId: 'p1',
      optionId: 1,
      voterId: 'v1',
      voterName: '太郎',
    });

    expect(result.success).toBe(true);
    expect(update).toHaveBeenCalled();
  });
});
