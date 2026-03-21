import { describe, expect, it } from 'vitest';
import { calculateTotalVotes, getWinningOption } from '@/app/polls/[id]/components/shared/utils';
import type { ParsedPoll, ParsedPollOption } from '@/db/core/types';

function option(
  partial: Partial<ParsedPollOption> & Pick<ParsedPollOption, 'title'>
): ParsedPollOption {
  return {
    id: 1,
    pollId: 'p',
    optionId: 1,
    url: 'https://example.com',
    description: null,
    image: null,
    votes: 0,
    voters: [],
    ...partial,
  } as ParsedPollOption;
}

function poll(opts: ParsedPollOption[]): ParsedPoll {
  return {
    id: 'p',
    title: 't',
    duration: null,
    endDateTime: null,
    createdBy: 'u',
    createdAt: '2025',
    isClosed: false,
    password: null,
    options: opts,
  };
}

describe('calculateTotalVotes', () => {
  it('sums votes across options', () => {
    expect(
      calculateTotalVotes(
        poll([
          option({ title: 'a', votes: 2, optionId: 1 }),
          option({ title: 'b', votes: 3, optionId: 2 }),
        ])
      )
    ).toBe(5);
  });

  it('treats zero votes as 0', () => {
    expect(calculateTotalVotes(poll([option({ title: 'a', votes: 0, optionId: 1 })]))).toBe(0);
  });
});

describe('getWinningOption', () => {
  it('returns null when there are no options', () => {
    expect(getWinningOption(poll([]))).toBeNull();
  });

  it('returns the option with the highest vote count', () => {
    const winner = getWinningOption(
      poll([
        option({ title: 'low', votes: 1, optionId: 1 }),
        option({ title: 'high', votes: 5, optionId: 2 }),
      ])
    );
    expect(winner?.title).toBe('high');
  });

  it('uses first option when votes tie (reduce stability)', () => {
    const w = getWinningOption(
      poll([
        option({ title: 'first', votes: 2, optionId: 1 }),
        option({ title: 'second', votes: 2, optionId: 2 }),
      ])
    );
    expect(w?.title).toBe('first');
  });
});
