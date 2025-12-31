'use server';

import {
  closePoll,
  createPoll,
  deletePoll,
  getPoll,
  reopenPoll,
  updateVoterName,
  votePoll,
} from '@/db/services/poll';
import type { ActionState } from '@/types';

export type CreatePollInput = Parameters<typeof createPoll>[0] & {
  endDate?: string | null;
  endTime?: string | null;
};

// 投票作成
export async function createPollAction(
  input: CreatePollInput
): Promise<ActionState<{ id: string }>> {
  try {
    const result = await createPoll({
      title: input.title,
      options: input.options,
      duration: input.duration,
      endDateTime:
        input.endDate && input.endTime ? `${input.endDate}T${input.endTime}` : input.endDate,
      password: input.password,
      createdBy: input.createdBy,
      scheduleId: input.scheduleId,
    });

    if (!result.success) {
      return { success: false, error: result.error || '多数決の作成に失敗しました' };
    }

    return { success: true, data: result.data } as any;
  } catch (error) {
    console.error('Error in createPollAction:', error);
    return { success: false, error: '多数決の作成に失敗しました' };
  }
}

// 投票取得
export async function getPollAction(pollId: string): Promise<ActionState> {
  try {
    const result = await getPoll(pollId);

    if (!result.success || !result.data) {
      return { success: false, error: result.error || 'Poll not found' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in getPollAction:', error);
    return { success: false, error: '投票の取得に失敗しました' };
  }
}

// 投票終了
export async function closePollAction(pollId: string): Promise<ActionState> {
  try {
    const result = await closePoll(pollId);

    if (!result.success) {
      return { success: false, error: result.error || '投票の終了に失敗しました' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in closePollAction:', error);
    return { success: false, error: '投票の終了に失敗しました' };
  }
}

// 投票再開
export async function reopenPollAction(pollId: string): Promise<ActionState> {
  try {
    const result = await reopenPoll(pollId);

    if (!result.success) {
      return { success: false, error: result.error || '投票の再開に失敗しました' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in reopenPollAction:', error);
    return { success: false, error: '投票の再開に失敗しました' };
  }
}

// 投票削除
export async function deletePollAction(pollId: string): Promise<ActionState> {
  try {
    const result = await deletePoll(pollId);

    if (!result.success) {
      return { success: false, error: result.error || '投票の削除に失敗しました' };
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in deletePollAction:', error);
    return { success: false, error: '投票の削除に失敗しました' };
  }
}

// 投票（一人一票、トグル動作含む）
export async function submitVoteAction(
  input: Parameters<typeof votePoll>[0]
): Promise<ActionState> {
  try {
    const result = await votePoll(input);

    if (!result.success) {
      return { success: false, error: result.error || '投票に失敗しました' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in submitVoteAction:', error);
    return { success: false, error: '投票に失敗しました' };
  }
}

// 投票者名の更新
export async function registerVoterNameAction(
  input: Parameters<typeof updateVoterName>[0]
): Promise<ActionState> {
  try {
    const result = await updateVoterName(input);

    if (!result.success) {
      return { success: false, error: result.error || '投票者名の更新に失敗しました' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in registerVoterNameAction:', error);
    return { success: false, error: '投票者名の更新に失敗しました' };
  }
}

// パスワード検証
export async function verifyPollPasswordAction(
  pollId: string,
  password: string
): Promise<ActionState> {
  try {
    const result = await getPoll(pollId);

    if (!result.success || !result.data) {
      return { success: false, error: 'Poll not found' };
    }

    const poll = result.data;
    if (poll.password === password) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: 'パスワードが正しくありません' };
    }
  } catch (error) {
    console.error('Error in verifyPollPasswordAction:', error);
    return { success: false, error: '認証エラーが発生しました' };
  }
}
