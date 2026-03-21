import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/services/contact', () => ({
  createContact: vi.fn(),
}));

import { submitContactAction } from '@/app/contact/actions';
import { createContact } from '@/db/services/contact';

describe('submitContactAction', () => {
  beforeEach(() => {
    vi.mocked(createContact).mockReset();
  });

  it('Zod 失敗時は success: false と details を返す', async () => {
    const result = await submitContactAction({
      name: '',
      email: 'a@example.com',
      subject: '件名',
      message: '1234567890',
    });
    expect(result.success).toBe(false);
    if (!result.success && 'details' in result) {
      expect(result.details).toBeDefined();
    }
  });

  it('DB 成功時は success: true と data を返す', async () => {
    const row = {
      id: 1,
      name: '山田',
      email: 'y@example.com',
      subject: '件名',
      message: '1234567890',
      isRead: false,
      createdAt: '2025-01-01T00:00:00.000Z',
    };
    vi.mocked(createContact).mockResolvedValue({ success: true, data: row });

    const result = await submitContactAction({
      name: '山田',
      email: 'y@example.com',
      subject: '件名',
      message: '1234567890',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(row);
    }
  });

  it('createContact が失敗したらエラーを返す', async () => {
    vi.mocked(createContact).mockResolvedValue({ success: false, error: 'db error' });

    const result = await submitContactAction({
      name: '山田',
      email: 'y@example.com',
      subject: '件名',
      message: '1234567890',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('db error');
    }
  });
});
