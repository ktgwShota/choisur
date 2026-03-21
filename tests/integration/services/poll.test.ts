import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import { createPoll } from '@/db/services/poll';

describe('createPoll（モック DB による統合風）', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('insert が成功すると success と poll id を返す', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      insert: () => ({
        values: vi.fn().mockResolvedValue(undefined),
      }),
    } as never);

    const result = await createPoll({
      title: 'テスト投票',
      createdBy: 'user-1',
      options: [
        { url: 'https://a.example.com', title: 'A' },
        { url: 'https://b.example.com', title: 'B' },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.data?.id).toMatch(/^\d+$/);
    expect(result.data?.organizerToken).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it('poll 挿入で例外なら failure を返す', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      insert: () => ({
        values: vi.fn().mockRejectedValue(new Error('poll insert failed')),
      }),
    } as never);

    const result = await createPoll({
      title: 'x',
      createdBy: 'u',
      options: [{ url: 'https://a.example.com', title: 'A' }],
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('poll insert failed');
  });

  it('選択肢挿入で例外なら failure を返す', async () => {
    let insertCount = 0;
    vi.mocked(getDrizzle).mockReturnValue({
      insert: () => ({
        values: vi.fn().mockImplementation(async () => {
          insertCount += 1;
          if (insertCount >= 2) {
            throw new Error('option insert failed');
          }
        }),
      }),
    } as never);

    const result = await createPoll({
      title: 'x',
      createdBy: 'u',
      options: [
        { url: 'https://a.example.com', title: 'A' },
        { url: 'https://b.example.com', title: 'B' },
      ],
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('option insert failed');
  });
});
