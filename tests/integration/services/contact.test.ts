import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import { createContact } from '@/db/services/contact';

describe('createContact（モック DB による統合風）', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('insert が成功すると行データを返す', async () => {
    const mockRow = {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'Hello',
      message: '1234567890',
      isRead: false,
      createdAt: '2025-01-01T00:00:00.000Z',
    };

    vi.mocked(getDrizzle).mockReturnValue({
      insert: () => ({
        values: () => ({
          returning: () => ({
            get: async () => mockRow,
          }),
        }),
      }),
    } as never);

    const result = await createContact({
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'Hello',
      message: '1234567890',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockRow);
  });

  it('insert が例外なら failure を返す', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      insert: () => ({
        values: () => ({
          returning: () => ({
            get: async () => {
              throw new Error('db down');
            },
          }),
        }),
      }),
    } as never);

    const result = await createContact({
      name: 'Bob',
      email: 'bob@example.com',
      subject: 'S',
      message: '1234567890',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('db down');
  });
});
