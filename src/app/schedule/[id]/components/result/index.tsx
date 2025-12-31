import { notFound } from 'next/navigation';
import { getSchedule } from '@/db/services/schedule';
import { PageLayout } from '@/components/shared/layouts/PageLayout';
import 'dayjs/locale/ja';
import LinkNotificationBanner from '@/components/shared/others/LinkNotification';
import Contents from './Contents';
import Header from './Header';

interface ResultPageProps {
  id: string;
}

export default async function ResultPage({ id }: ResultPageProps) {
  const result = await getSchedule(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const schedule = result.data;
  const hasPoll = !!schedule.pollId;

  return (
    <PageLayout
      banner={
        <LinkNotificationBanner
          title={hasPoll ? '多数決（店決め）が作成されています！' : '行き先はもう決まりましたか？'}
          description={
            hasPoll
              ? '行き先（お店）の候補や、現在の投票結果が確認できます。'
              : 'まだ決まっていない場合は、投票機能を使って全員の希望を聞いてみましょう。'
          }
          buttonText={hasPoll ? '多数決を表示' : '行き先を決める'}
          href={
            hasPoll
              ? `/polls/${schedule.pollId}`
              : `/polls/create?title=${encodeURIComponent(schedule.title)}&scheduleId=${schedule.id}`
          }
          color={hasPoll ? 'blue' : 'orange'}
        />
      }
      header={<Header schedule={schedule} />}
      contents={<Contents schedule={schedule} />}
    />
  );
}
