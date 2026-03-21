import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import { updateVoterName } from '@/db/services/poll';

describe('updateVoterName（モック DB）', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('投票者名を含む選択肢を更新する', async () => {
    const update = vi.fn(() => ({
      set: () => ({
        where: () => Promise.resolve(undefined),
      }),
    }));

    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            all: vi.fn().mockResolvedValue([
              {
                id: 1,
                pollId: 'p1',
                optionId: 1,
                url: 'https://x.com',
                title: 'A',
                description: null,
                image: null,
                votes: 1,
                voters: JSON.stringify([{ id: 'v1', name: '旧名' }]),
              },
            ]),
          }),
        }),
      }),
      update,
    } as never);

    const result = await updateVoterName({
      pollId: 'p1',
      voterId: 'v1',
      voterName: '新名',
    });

    expect(result.success).toBe(true);
    expect(update).toHaveBeenCalled();
  });
});
