'use client';

import type { Dayjs } from 'dayjs';
import FormattedDate from '@/components/shared/others/FormattedDate';
import { ScoreProgressBar } from './ScoreProgressBar';

interface DateStatusCardProps {
  date: Dayjs;
  time?: string;
  score: number;
  total: number;
  isConfirmed?: boolean;
  isDismissed?: boolean;
  isBest?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function DateStatusCard({
  date,
  time,
  score,
  total,
  isConfirmed = false,
  isDismissed = false,
  isBest = false,
  isSelected = false,
  onClick,
  className,
}: DateStatusCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative flex w-full min-w-[130px] flex-1 flex-col items-center justify-center p-5 transition-colors ${onClick ? 'cursor-pointer' : 'cursor-default'} text-slate-900 ${isConfirmed ? 'bg-gradient-to-br from-emerald-50/60 via-emerald-100/50 to-green-100/40' : ''} ${className}
      `}
    >
      <div className="flex flex-col items-center justify-between">
        <div className="mb-1 font-semibold text-[12px]">
          <FormattedDate date={date} />
        </div>

        <div className="mb-2 text-[10px] text-slate-500">{time ? `${time} ~` : '-'}</div>

        <ScoreProgressBar score={score} total={total} />
      </div>
    </div>
  );
}
