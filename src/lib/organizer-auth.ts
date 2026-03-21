import { eq } from 'drizzle-orm';
import { getDrizzle } from '@/db/core/drizzle';
import { polls, schedules } from '@/db/core/schema';

export const ORGANIZER_UNAUTHORIZED_ERROR = 'この操作を実行する権限がありません。';

export function createOrganizerToken(): string {
  return crypto.randomUUID();
}

async function verifyOrganizerToken(
  table: typeof polls | typeof schedules,
  id: string,
  organizerToken: string | null | undefined
): Promise<boolean> {
  if (!organizerToken) {
    return false;
  }

  const db = getDrizzle();
  const row = await db
    .select({ organizerToken: table.organizerToken })
    .from(table)
    .where(eq(table.id, id))
    .get();

  return !!row?.organizerToken && row.organizerToken === organizerToken;
}

export async function verifyPollOrganizerToken(
  pollId: string,
  organizerToken: string | null | undefined
): Promise<boolean> {
  return verifyOrganizerToken(polls, pollId, organizerToken);
}

export async function verifyScheduleOrganizerToken(
  scheduleId: string,
  organizerToken: string | null | undefined
): Promise<boolean> {
  return verifyOrganizerToken(schedules, scheduleId, organizerToken);
}
