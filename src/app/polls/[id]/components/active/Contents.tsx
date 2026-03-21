'use client';

import { BarChart3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import SectionHeading from '@/components/shared/headings/SectionHeading';
import CountdownTimer from '@/components/shared/others/CountdownTimer';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { getResponsiveValue } from '@/utils/styles';
import { usePollVote } from '../../hooks/usePollVote';
import CastVoteDialog from '../shared/CastVoteDialog';
import { calculateTotalVotes } from '../shared/utils';
import OptionCard from './OptionCard';

interface ContentsProps {
  poll: Poll;
}

export default function Contents({ poll }: ContentsProps) {
  const { voter, setVoter, createVoter, vote, voting, isVotedByUser } = usePollVote(poll);
  const [castVoteDialogOpen, setCastVoteDialogOpen] = useState(false);
  const [pendingOptionId, setPendingOptionId] = useState<number | null>(null);
  const totalVotes = useMemo(() => calculateTotalVotes(poll), [poll]);
  const isAnyVoting = voting !== null;

  const handleVoteClick = (optionId: number) => {
    if (!voter) {
      setPendingOptionId(optionId);
      setCastVoteDialogOpen(true);
      return;
    }
    vote(optionId);
  };

  const handleDialogSubmit = async (name: string, userId: string, optionId: number) => {
    const newVoter = createVoter(name, userId);
    setVoter(newVoter);
    await vote(optionId, newVoter);
    setCastVoteDialogOpen(false);
    setPendingOptionId(null);
  };

  return (
    <>
      <div>
        <SectionHeading
          icon={BarChart3}
          title="投票受付中"
          rightContent={
            <CountdownTimer endDateTime={poll.endDateTime} isClosed={!!poll.isClosed} />
          }
        />

        <div
          className="grid grid-cols-1 justify-center md:grid-cols-2"
          style={{ gap: getResponsiveValue(20, 32) }}
        >
          {poll.options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              totalVotes={totalVotes}
              isVoted={isVotedByUser(option)}
              isVoting={voting === option.optionId}
              isDisabled={isAnyVoting && voting !== option.optionId}
              onVote={() => handleVoteClick(option.optionId)}
            />
          ))}
        </div>
      </div>

      {pendingOptionId !== null && (
        <CastVoteDialog
          open={castVoteDialogOpen}
          onOpenChange={(open) => {
            setCastVoteDialogOpen(open);
            if (!open) {
              setPendingOptionId(null);
            }
          }}
          optionId={pendingOptionId}
          onSubmit={handleDialogSubmit}
        />
      )}
    </>
  );
}
