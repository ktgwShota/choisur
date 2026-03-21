import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { closeSchedule, getSchedule } from '@/db/services/schedule';
import ActivePage from './components/active';
import ResultPage from './components/result';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  try {
    const result = await getSchedule(id);

    if (!result.success || !result.data) {
      notFound();
    }

    const scheduleResult = result.data;

    if (!scheduleResult.isClosed && scheduleResult.endDateTime) {
      const endTime = new Date(scheduleResult.endDateTime).getTime();
      if (endTime <= Date.now()) {
        await closeSchedule(id);
        scheduleResult.isClosed = true;
      }
    }

    const isConfirmed = scheduleResult.confirmedDateTime !== null;

    return <>{isConfirmed ? <ResultPage id={id} /> : <ActivePage id={id} />}</>;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return {
      title: '日程調整が見つかりません',
      robots: { index: false, follow: true },
    };
  }

  try {
    const result = await getSchedule(id);

    if (!result.success || !result.data) {
      return {
        title: '日程調整が見つかりません',
        robots: { index: false, follow: true },
      };
    }

    const schedule = result.data;
    const isClosed = schedule.isClosed || schedule.confirmedDateTime !== null;

    const datesCount = schedule.dates?.length || 0;

    const title = schedule.title;
    const description = isClosed
      ? `日程調整「${schedule.title}」は終了しました。`
      : `日程調整「${schedule.title}」。${datesCount}件の候補日から都合の良い日を選べます。`;

    return {
      title,
      description,
      robots: { index: false, follow: true },
      openGraph: {
        title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch (_error) {
    return {
      title: '日程調整',
      robots: { index: false, follow: true },
    };
  }
}
