'use client';

import { PageLayout } from '@/components/shared/layouts/PageLayout';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { calculateTotalVotes, getWinningOption } from '../shared/utils';
import Contents from './Contents';
import Header from './Header';

interface ResultPageProps {
  pollData: Poll;
}

export default function ResultPage({ pollData }: ResultPageProps) {
  const sortedOptions = [...pollData.options].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const totalVotes = calculateTotalVotes(pollData);
  const winningOption = getWinningOption(pollData);

  return (
    <PageLayout
      header={<Header poll={pollData} />}
      contents={
        <Contents
          poll={pollData}
          sortedOptions={sortedOptions}
          totalVotes={totalVotes}
          winningOption={winningOption}
        />
      }
    />
  );
}
