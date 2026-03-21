'use client';

import { BarChart3 } from 'lucide-react';
import SectionHeading from '@/components/shared/headings/SectionHeading';
import type { ParsedPollOption as Option, ParsedPoll as Poll } from '@/db/core/types';
import { getResponsiveValue } from '@/utils/styles';
import { ResultDisplay, VoterList } from '../active/OptionCard';

interface ContentsProps {
  poll: Poll;
  sortedOptions: Option[];
  totalVotes: number;
  winningOption: Option | null;
}

export default function Contents({
  poll,
  sortedOptions,
  totalVotes,
  winningOption,
}: ContentsProps) {
  return (
    <div>
      <SectionHeading
        icon={BarChart3}
        title="投票結果"
        rightContent={
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-medium text-slate-500"
              style={{ fontSize: getResponsiveValue(13, 14, 320, 900, true) }}
            >
              参加者
            </span>
            <span
              className="font-black text-slate-900"
              style={{ fontSize: getResponsiveValue(15, 17, 320, 900, true) }}
            >
              {totalVotes.toLocaleString()}
            </span>
            <span
              className="font-medium text-slate-500"
              style={{ fontSize: getResponsiveValue(13, 14, 320, 900, true) }}
            >
              名
            </span>
          </div>
        }
      />

      <div
        className="grid grid-cols-1 justify-center md:grid-cols-2"
        style={{ gap: getResponsiveValue(20, 32) }}
      >
        {sortedOptions.map((option) => (
          <ResultOptionCard
            key={option.id}
            option={option}
            totalVotes={totalVotes}
            isWinning={
              !!winningOption && (winningOption.votes || 0) > 0 && option.id === winningOption.id
            }
          />
        ))}
      </div>
    </div>
  );
}

interface ResultOptionCardProps {
  option: Option;
  totalVotes: number;
  isWinning?: boolean;
}

function ResultOptionCard({ option, totalVotes, isWinning }: ResultOptionCardProps) {
  const votes = option.votes || 0;
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

  return (
    <div className="group relative flex h-full w-full flex-col rounded-[2px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 transition-all duration-300">
      {isWinning && (
        <div className="absolute top-3 right-3 flex items-center gap-1 whitespace-nowrap rounded-[2px] border border-emerald-500 px-3 py-2 font-bold text-[12px] text-emerald-500">
          決定
        </div>
      )}
      <div className="flex min-h-0 flex-grow flex-col p-6">
        {option.title &&
          (option.url ? (
            <a
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 line-clamp-2 cursor-pointer overflow-hidden text-ellipsis font-bold text-lg text-slate-900 leading-snug no-underline transition-colors hover:text-blue-600 hover:underline"
            >
              {option.title}
            </a>
          ) : (
            <div className="mb-4 line-clamp-2 overflow-hidden text-ellipsis font-bold text-lg text-slate-900 leading-snug">
              {option.title}
            </div>
          ))}

        {option.description && (
          <div className="mb-4">
            <p className="line-clamp-3 text-slate-500 text-sm leading-relaxed">
              {option.description}
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-col border-slate-100 border-t pt-4">
          <ResultDisplay votes={votes} percentage={percentage} />
          <VoterList voters={option.voters} />
        </div>
      </div>
    </div>
  );
}
