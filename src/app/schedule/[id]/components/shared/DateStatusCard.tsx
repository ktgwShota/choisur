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
  /** 決定した列に表示するラベル（例: "決定"） */
  confirmedLabel?: string;
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
  confirmedLabel,
  onClick,
  className,
}: DateStatusCardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative isolate flex w-full min-w-[130px] flex-1 flex-col items-center justify-center overflow-visible p-5 transition-colors ${onClick ? 'cursor-pointer' : 'cursor-default'} text-slate-900 ${isConfirmed ? 'bg-gradient-to-br from-emerald-50/60 via-emerald-100/50 to-green-100/40' : ''} ${className}
      `}
    >
      {isConfirmed && confirmedLabel && (
        <div
          className="absolute z-10 flex items-center gap-1 whitespace-nowrap border border-emerald-500 bg-white px-2 py-1 font-bold text-[10px] text-emerald-500"
          style={{ right: -1, top: -1 }}
        >
          {confirmedLabel}
        </div>
      )}
      <div className="relative z-0 flex flex-col items-center justify-between">
        <div className="mb-1 font-semibold text-[12px]">
          <FormattedDate date={date} />
        </div>

        <div className="mb-2 text-[10px] text-slate-500">{time ? `${time} ~` : '-'}</div>

        <ScoreProgressBar score={score} total={total} />
      </div>
    </div>
  );
}
