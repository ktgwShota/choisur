import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import {
  AUTHOR_NAME_MAX_LENGTH,
  BODY_MAX_LENGTH,
  createSummaryComment,
} from '@/db/services/summaryComment';

describe('createSummaryComment（バリデーション＋モック DB）', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('名前が空なら DB を呼ばず失敗', async () => {
    const result = await createSummaryComment('s1', '   ', '本文');
    expect(result.success).toBe(false);
    expect(result.error).toBe('名前を入力してください');
    expect(getDrizzle).not.toHaveBeenCalled();
  });

  it('本文が空なら失敗', async () => {
    const result = await createSummaryComment('s1', '太郎', '  ');
    expect(result.success).toBe(false);
    expect(result.error).toBe('コメントを入力してください');
  });

  it('名前・本文は最大長で切り詰めて保存する', async () => {
    const longName = 'あ'.repeat(AUTHOR_NAME_MAX_LENGTH + 5);
    const longBody = 'い'.repeat(BODY_MAX_LENGTH + 10);

    vi.mocked(getDrizzle).mockReturnValue({
      insert: () => ({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              id: 1,
              scheduleId: 's1',
              authorName: 'あ'.repeat(AUTHOR_NAME_MAX_LENGTH),
              body: 'い'.repeat(BODY_MAX_LENGTH),
              createdAt: '2025-01-01T00:00:00.000Z',
            },
          ]),
        }),
      }),
    } as never);

    const result = await createSummaryComment('s1', longName, longBody);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data.authorName.length).toBe(AUTHOR_NAME_MAX_LENGTH);
      expect(result.data.body.length).toBe(BODY_MAX_LENGTH);
    }
  });

  it('insert が行を返さなければ失敗', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      insert: () => ({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as never);

    const result = await createSummaryComment('s1', '太郎', 'こんにちは');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to create comment');
  });
});
