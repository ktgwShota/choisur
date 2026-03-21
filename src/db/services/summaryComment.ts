import { and, desc, eq } from 'drizzle-orm';
import { getDrizzle } from '../core/drizzle';
import { summaryComments } from '../core/schema';
import type { DBResult, SummaryComment } from '../core/types';

export async function getSummaryComments(scheduleId: string): Promise<DBResult<SummaryComment[]>> {
  try {
    const db = getDrizzle();
    const rows = await db
      .select()
      .from(summaryComments)
      .where(eq(summaryComments.scheduleId, scheduleId))
      .orderBy(desc(summaryComments.createdAt));
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error in getSummaryComments:', error);
    // テーブル未作成時などは空配列を返してページは表示する（db:setup で schema.sql を適用すること）
    return { success: true, data: [] };
  }
}

export const BODY_MAX_LENGTH = 100;
export const AUTHOR_NAME_MAX_LENGTH = 20;

export async function createSummaryComment(
  scheduleId: string,
  authorName: string,
  body: string
): Promise<DBResult<SummaryComment>> {
  try {
    const trimmedName = authorName.trim().slice(0, AUTHOR_NAME_MAX_LENGTH);
    const trimmedBody = body.trim().slice(0, BODY_MAX_LENGTH);
    if (!trimmedName) {
      return { success: false, error: '名前を入力してください' };
    }
    if (!trimmedBody) {
      return { success: false, error: 'コメントを入力してください' };
    }
    const db = getDrizzle();
    const createdAt = new Date().toISOString();
    const [row] = await db
      .insert(summaryComments)
      .values({
        scheduleId,
        authorName: trimmedName,
        body: trimmedBody,
        createdAt,
      })
      .returning();
    if (!row) {
      return { success: false, error: 'Failed to create comment' };
    }
    return { success: true, data: row };
  } catch (error) {
    console.error('Error in createSummaryComment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateSummaryComment(
  commentId: number,
  scheduleId: string,
  body: string
): Promise<DBResult<SummaryComment>> {
  try {
    const trimmedBody = body.trim().slice(0, BODY_MAX_LENGTH);
    if (!trimmedBody) {
      return { success: false, error: 'コメントを入力してください' };
    }
    const db = getDrizzle();
    const [row] = await db
      .update(summaryComments)
      .set({ body: trimmedBody })
      .where(and(eq(summaryComments.id, commentId), eq(summaryComments.scheduleId, scheduleId)))
      .returning();
    if (!row) {
      return { success: false, error: 'コメントが見つかりません' };
    }
    return { success: true, data: row };
  } catch (error) {
    console.error('Error in updateSummaryComment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteSummaryComment(
  commentId: number,
  scheduleId: string
): Promise<DBResult<void>> {
  try {
    const db = getDrizzle();
    const _result = await db
      .delete(summaryComments)
      .where(and(eq(summaryComments.id, commentId), eq(summaryComments.scheduleId, scheduleId)));
    return { success: true };
  } catch (error) {
    console.error('Error in deleteSummaryComment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
