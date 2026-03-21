import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/db/core/drizzle', () => ({
  getDrizzle: vi.fn(),
}));

import { getDrizzle } from '@/db/core/drizzle';
import {
  createOrganizerToken,
  verifyPollOrganizerToken,
  verifyScheduleOrganizerToken,
} from '@/lib/organizer-auth';

describe('organizer-auth', () => {
  beforeEach(() => {
    vi.mocked(getDrizzle).mockReset();
  });

  it('createOrganizerToken は UUID 形式の文字列を返す', () => {
    const token = createOrganizerToken();
    expect(token).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('verifyPollOrganizerToken はトークン一致時に true を返す', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            get: vi.fn().mockResolvedValue({ organizerToken: 'valid-token' }),
          }),
        }),
      }),
    } as never);

    await expect(verifyPollOrganizerToken('poll-1', 'valid-token')).resolves.toBe(true);
  });

  it('verifyPollOrganizerToken はトークン不一致時に false を返す', async () => {
    vi.mocked(getDrizzle).mockReturnValue({
      select: () => ({
        from: () => ({
          where: () => ({
            get: vi.fn().mockResolvedValue({ organizerToken: 'valid-token' }),
          }),
        }),
      }),
    } as never);

    await expect(verifyPollOrganizerToken('poll-1', 'wrong-token')).resolves.toBe(false);
  });

  it('verifyScheduleOrganizerToken はトークン未指定時に false を返す', async () => {
    await expect(verifyScheduleOrganizerToken('schedule-1', undefined)).resolves.toBe(false);
  });
});
