'use client';

import LinkNotificationBanner from '@/components/shared/others/LinkNotification';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
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
  const hasSchedule = !!pollData.scheduleId;

  return (
    <PageLayout
      banner={
        <LinkNotificationBanner
          title={
            hasSchedule ? '出欠表（日程調整）が作成されています！' : '日程はもう決まりましたか？'
          }
          description={
            hasSchedule
              ? '候補日時の確認や、メンバーの出欠状況が確認できます。'
              : 'まだ決まっていなければ、日程調整機能を使って全員の都合を聞いてみましょう。'
          }
          buttonText={hasSchedule ? '出欠表を表示' : '出欠表を作成'}
          href={
            hasSchedule
              ? `/schedule/${pollData.scheduleId}`
              : `/schedule/create?title=${encodeURIComponent(pollData.title)}&pollId=${pollData.id}`
          }
          color={hasSchedule ? 'blue' : 'orange'}
        />
      }
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
