'use client';

import { BarChart3 } from 'lucide-react';
import SectionHeading from '@/components/shared/headings/SectionHeading';
import CountdownTimer from '@/components/shared/others/CountdownTimer';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { getResponsiveValue } from '@/utils/styles';
import { usePollVote } from '../../hooks/usePollVote';
import OptionCard from './OptionCard';

interface ContentsProps {
  poll: Poll;
  onVoteClick: (optionId: number) => void;
}

export default function Contents({ poll, onVoteClick }: ContentsProps) {
  const { voting, isVotedByUser } = usePollVote(poll.id, poll);

  return (
    <div>
      <SectionHeading
        icon={BarChart3}
        title="投票受付中"
        rightContent={<CountdownTimer endDateTime={poll.endDateTime} isClosed={!!poll.isClosed} />}
      />

      <div
        className="grid grid-cols-1 justify-center md:grid-cols-2"
        style={{ gap: getResponsiveValue(20, 32) }}
      >
        {poll.options.map((option) => {
          const totalVotes =
            poll.options.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;
          const isVoted = isVotedByUser(option);
          const isVoting = voting === option.optionId;
          const isAnyVoting = voting !== null;

          return (
            <OptionCard
              key={option.id}
              option={option}
              totalVotes={totalVotes}
              isVoted={isVoted}
              isVoting={isVoting}
              isDisabled={isAnyVoting && !isVoting}
              onVote={() => onVoteClick(option.optionId)}
            />
          );
        })}
      </div>
    </div>
  );
}
