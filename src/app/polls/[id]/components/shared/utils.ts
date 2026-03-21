import type { ParsedPollOption as Option, ParsedPoll as Poll } from '@/db/core/types';

/**
 * 総投票数を計算
 */
export function calculateTotalVotes(poll: Poll): number {
  return poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
}

/**
 * 最多得票の選択肢を取得
 */
export function getWinningOption(poll: Poll): Option | null {
  if (poll.options.length === 0) return null;
  return poll.options.reduce(
    (max, option) => ((option.votes || 0) > (max.votes || 0) ? option : max),
    poll.options[0]
  );
}
