'use client';

import { ArrowRight, BarChart3 } from 'lucide-react';
import SectionHeading from '@/components/shared/headings/SectionHeading';
import { Avatar, AvatarFallback } from '@/components/shared/primitives/avatar';
import type { ParsedPollOption as Option, ParsedPoll as Poll } from '@/db/core/types';
import { cn, getResponsiveValue } from '@/utils/styles';

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
    <div className="flex flex-col">
      <SectionHeading
        icon={BarChart3}
        title="投票集計結果"
        rightContent={
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-medium text-slate-500"
              style={{ fontSize: getResponsiveValue(13, 14, 320, 900, true) }}
            >
              総投票数
            </span>
            <span
              className="font-black text-slate-900"
              style={{ fontSize: getResponsiveValue(16, 18, 320, 900, true) }}
            >
              {totalVotes.toLocaleString()}
            </span>
            <span
              className="font-medium text-slate-500"
              style={{ fontSize: getResponsiveValue(13, 14, 320, 900, true) }}
            >
              票
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: getResponsiveValue(20, 32) }}>
        {sortedOptions.map((option, index) => (
          <PollResultCard
            key={option.id}
            option={option}
            totalVotes={totalVotes}
            isLeading={index === 0 && (option.votes || 0) > 0}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

interface PollResultCardProps {
  option: Option;
  totalVotes: number;
  isLeading: boolean;
  rank: number;
}

function PollResultCard({ option, totalVotes, isLeading, rank }: PollResultCardProps) {
  const votes = option.votes || 0;
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  const _hasVotes = votes > 0;
  const displayedVoters = option.voters.slice(0, 3);
  const remainingVoters = Math.max(0, option.voters.length - 3);

  const getColorForRank = (rank: number) => {
    const colors = [
      'text-blue-500', // 1位 - 青
      'text-cyan-500', // 2位 - シアン
      'text-purple-500', // 3位 - 紫
      'text-orange-500', // 4位 - オレンジ
      'text-pink-500', // 5位 - ピンク
      'text-emerald-500', // 6位 - エメラルド
      'text-amber-500', // 7位 - アンバー
      'text-rose-500', // 8位 - ローズ
    ];
    return colors[(rank - 1) % colors.length] || 'text-slate-300';
  };

  const cardColor = getColorForRank(rank);

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col rounded-[2px] border border-slate-200 bg-white'
      )}
    >
      <div className="flex min-h-0 flex-grow flex-col p-6">
        {option.title && (
          <h3 className="mb-4 font-bold text-base text-slate-900 leading-tight">
            {option.title || option.url}
          </h3>
        )}

        {/* 備考の表示 */}
        {option.description && (
          <div className="mb-4">
            <p className="line-clamp-3 text-slate-500 text-sm leading-relaxed">
              {option.description}
            </p>
          </div>
        )}

        {/* 備考より下を一番下に固定するためのコンテナ */}
        <div className="mt-auto flex flex-col border-slate-200 border-t">
          <div className="flex items-center justify-center py-5">
            <DonutChart percentage={percentage} color={cardColor} votes={votes} />
          </div>

          <div className="flex min-h-[32px] items-center justify-between border-slate-200 border-t pt-5">
            <div className="flex items-center gap-2">
              {displayedVoters.length > 0 ? (
                <>
                  <div className="flex -space-x-2">
                    {displayedVoters.map((voter) => (
                      <Avatar key={voter.id} className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="bg-indigo-50 font-bold text-[11px] text-indigo-600">
                          {(voter.name && voter.name.length > 0
                            ? voter.name.charAt(0)
                            : '?'
                          ).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {remainingVoters > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-xs">
                      +{remainingVoters}
                    </span>
                  )}
                </>
              ) : (
                <div className="h-8" />
              )}
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-slate-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface DonutChartProps {
  percentage: number;
  color: string;
  votes: number;
}

function DonutChart({ percentage, color, votes }: DonutChartProps) {
  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
        />
        {percentage > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn('transition-all duration-500', color)}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-3xl text-slate-900 leading-none">
          {percentage.toFixed(0)}%
        </span>
        <span className="mt-1 text-slate-400 text-xs leading-none">
          {votes.toLocaleString()} 票
        </span>
      </div>
    </div>
  );
}
