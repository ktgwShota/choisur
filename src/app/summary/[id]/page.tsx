import { CalendarCheck2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SocialShareButtons from '@/components/shared/others/SocialShareButtons';
import { getSchedule } from '@/db/services/schedule';
import { getSummaryComments } from '@/db/services/summaryComment';
import dayjs from '@/lib/dayjs';
import { getResponsiveValue } from '@/utils/styles';
import { SummaryCommentBoard } from './components/SummaryCommentBoard';

function formatConfirmedDateTime(confirmedAt: string | null): string | null {
  if (!confirmedAt) return null;
  const hasTime = /-\d{1,2}:\d{2}$/.test(confirmedAt);
  const isoLike = hasTime
    ? confirmedAt.replace(/^(\d{4}-\d{2}-\d{2})-(\d{1,2}:\d{2})$/, '$1T$2')
    : confirmedAt;
  const d = dayjs(isoLike);
  return d.isValid()
    ? d.format(hasTime ? 'YYYY年MM月DD日(ddd) HH:mm' : 'YYYY年MM月DD日(ddd)')
    : null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SummaryPage({ params }: PageProps) {
  const { id } = await params;
  const scheduleResult = await getSchedule(id);

  if (!scheduleResult.success || !scheduleResult.data) {
    notFound();
  }

  const schedule = scheduleResult.data;
  const scheduleClosed = schedule.isClosed && schedule.confirmedDateTime;

  if (!scheduleClosed) {
    notFound();
  }

  const confirmedText = formatConfirmedDateTime(schedule.confirmedDateTime);

  const commentsResult = await getSummaryComments(schedule.id);
  const comments = commentsResult.success && commentsResult.data ? commentsResult.data : [];

  const shareText = `${schedule.title}の日程が決まりました`;

  return (
    <div className="relative">
      <div className="absolute -top-4 right-0 hidden md:flex md:flex-col md:items-center">
        <SocialShareButtons shareText={shareText} vertical />
      </div>

      <div className="mx-auto w-full max-w-xl">
        <article>
          <div className="my-4 text-center">
            <h1
              className="font-medium text-neutral-800 tracking-tight"
              style={{ fontSize: getResponsiveValue(17, 18, 320, 900, true) }}
            >
              日程が決定しました！
            </h1>
          </div>

          <div className="border-neutral-200 border-b">
            <div className="grid grid-cols-1 gap-6 text-center">
              <section>
                <p className="flex items-center justify-center gap-2 py-5 font-semibold text-neutral-800 text-sm">
                  日程
                </p>
                <p
                  className="text-neutral-800"
                  style={{ fontSize: getResponsiveValue(15, 16, 320, 900, true) }}
                >
                  {confirmedText ?? '—'}
                </p>
              </section>
            </div>

            <nav
              className="mt-6 flex flex-row items-center justify-center border-neutral-200 border-t py-6"
              style={{ gap: getResponsiveValue(20, 24, 320, 900, true) }}
            >
              <Link
                href={`/schedule/${schedule.id}?redirect=false`}
                className="inline-flex items-center justify-center gap-3 rounded-[2px] border border-slate-700 bg-slate-700 py-3 pr-5 pl-4 font-medium text-sm text-white hover:bg-slate-800"
              >
                <CalendarCheck2 className="h-4 w-4" aria-hidden />
                出欠表
              </Link>
            </nav>
          </div>
        </article>

        <div className="mt-4 flex justify-center md:hidden">
          <SocialShareButtons shareText={shareText} />
        </div>

        <SummaryCommentBoard scheduleId={schedule.id} initialComments={comments} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const scheduleResult = await getSchedule(id);

  if (!scheduleResult.success || !scheduleResult.data) {
    return {
      title: 'サマリー',
      robots: { index: false, follow: true },
    };
  }

  const schedule = scheduleResult.data;
  const scheduleClosed = schedule.isClosed && schedule.confirmedDateTime;
  if (!scheduleClosed) {
    return {
      title: 'サマリー',
      robots: { index: false, follow: true },
    };
  }

  const confirmedText = formatConfirmedDateTime(schedule.confirmedDateTime);
  const summaryMessage = confirmedText
    ? `${confirmedText}に集合することが決まりました。`
    : '集合日時が決まりました。';

  return {
    title: summaryMessage,
    description: summaryMessage,
    robots: { index: false, follow: true },
  };
}
