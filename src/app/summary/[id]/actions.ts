'use server';

import { revalidatePath } from 'next/cache';
import {
  createSummaryComment,
  deleteSummaryComment,
  updateSummaryComment,
} from '@/db/services/summaryComment';
import type { ActionState } from '@/types';

export async function createSummaryCommentAction(
  scheduleId: string,
  authorName: string,
  body: string
): Promise<ActionState<{ id: number }>> {
  try {
    const result = await createSummaryComment(scheduleId, authorName, body);
    if (!result.success || !result.data) {
      return { success: false, error: result.error ?? '投稿に失敗しました' };
    }
    revalidatePath(`/summary/${scheduleId}`);
    return { success: true, data: { id: result.data.id } };
  } catch (error) {
    console.error('Error in createSummaryCommentAction:', error);
    return { success: false, error: '投稿に失敗しました' };
  }
}

export async function updateSummaryCommentAction(
  commentId: number,
  scheduleId: string,
  body: string
): Promise<ActionState> {
  try {
    const result = await updateSummaryComment(commentId, scheduleId, body);
    if (!result.success) {
      return { success: false, error: result.error ?? '更新に失敗しました' };
    }
    revalidatePath(`/summary/${scheduleId}`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error in updateSummaryCommentAction:', error);
    return { success: false, error: '更新に失敗しました' };
  }
}

export async function deleteSummaryCommentAction(
  commentId: number,
  scheduleId: string
): Promise<ActionState> {
  try {
    const result = await deleteSummaryComment(commentId, scheduleId);
    if (!result.success) {
      return { success: false, error: result.error ?? '削除に失敗しました' };
    }
    revalidatePath(`/summary/${scheduleId}`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error in deleteSummaryCommentAction:', error);
    return { success: false, error: '削除に失敗しました' };
  }
}
