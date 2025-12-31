'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SectionHeader from '@/app/(home)/components/SectionHeader';
import ScrollReveal from '@/components/shared/motions/ScrollReveal';
import { Button } from '@/components/shared/primitives/button';

import { cn } from '@/utils/styles';
import { COLORS } from '../../constants';
import { STEPS_DATA } from './constants';

export default function HowToUseTabs() {
  const [activeTab, setActiveTab] = useState<'poll' | 'schedule'>('poll');

  const currentSteps = STEPS_DATA[activeTab];
  const ctaLink =
    activeTab === 'poll' ? 'https://choisur.jp/polls/create' : 'https://choisur.jp/schedule/create';

  const accentColorClass = activeTab === 'poll' ? 'text-orange-500' : 'text-violet-500';
  const _accentBgClass = activeTab === 'poll' ? 'bg-orange-500' : 'bg-violet-500';
  const activeTabClass =
    activeTab === 'poll'
      ? 'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/50'
      : 'bg-violet-500/10 text-violet-500 ring-1 ring-violet-500/50';

  return (
    <div className="relative w-full">
      <SectionHeader
        title="HOW TO USE"
        subtitle="利用方法"
        mode="dark"
        align="center"
        accentColor={activeTab === 'poll' ? COLORS.ACCENT_ORANGE : COLORS.ACCENT_PURPLE}
        mb={{ xs: '32px', sm: '48px' }}
      />

      {/* Modern Tab Switcher */}
      <div className="mb-16 flex justify-center">
        <div className="relative inline-flex items-center rounded-full bg-slate-900/50 p-1.5 ring-1 ring-white/10 backdrop-blur-xl">
          {/* Active Indicator Background */}
          <div
            className={cn(
              'absolute h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-full shadow-lg transition-all duration-500 ease-out',
              activeTab === 'poll'
                ? 'left-1.5 bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/20'
                : 'left-[calc(50%+3px)] bg-gradient-to-br from-violet-400 to-violet-600 shadow-violet-500/20'
            )}
          />

          <button
            onClick={() => setActiveTab('poll')}
            className={cn(
              'relative z-10 w-32 rounded-full py-2.5 font-bold text-sm transition-colors duration-300',
              activeTab === 'poll' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            店決め
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={cn(
              'relative z-10 w-32 rounded-full py-2.5 font-bold text-sm transition-colors duration-300',
              activeTab === 'schedule' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            日程調整
          </button>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {currentSteps.map((step, index) => (
          <ScrollReveal
            key={`${activeTab}-${step.num}`}
            mode="slide"
            direction="up"
            delay={index * 0.1}
            style={{ height: '100%' }}
          >
            <div
              className={cn(
                'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.04]',
                activeTab === 'poll'
                  ? 'hover:shadow-[0_8px_30px_-10px_rgba(249,115,22,0.15)]'
                  : 'hover:shadow-[0_8px_30px_-10px_rgba(139,92,246,0.15)]'
              )}
            >
              {/* Step Number in Background */}
              <div
                className={cn(
                  'absolute -top-6 -right-4 select-none font-black text-[4rem] leading-none opacity-[0.03] transition-colors duration-500 md:text-[8rem]',
                  activeTab === 'poll' ? 'text-orange-500' : 'text-violet-500'
                )}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 shadow-inner ring-1 ring-white/10">
                <div
                  className={cn(
                    'transition-colors duration-500 [&>svg]:h-7 [&>svg]:w-7',
                    accentColorClass
                  )}
                >
                  {step.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="relative z-10 mb-3 font-bold text-lg text-white">{step.title}</h3>

              {/* Description */}
              <p className="relative z-10 text-slate-400 text-sm leading-relaxed">{step.desc}</p>

              {/* Step Number Label */}
              <div
                className={cn(
                  'absolute top-6 right-6 flex h-6 w-6 items-center justify-center rounded-full font-bold text-[10px] ring-1 ring-inset',
                  activeTabClass
                )}
              >
                {step.num}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* CTA Section */}
      <ScrollReveal mode="pop" delay={0.3}>
        <div className="mt-16 text-center">
          <Link href={ctaLink} passHref legacyBehavior>
            <Button
              className={cn(
                'group relative h-auto overflow-hidden rounded-full py-4 pr-6 pl-8 font-bold text-base text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl',
                activeTab === 'poll'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/25 hover:shadow-orange-500/40'
                  : 'bg-gradient-to-r from-violet-500 to-indigo-500 shadow-violet-500/25 hover:shadow-violet-500/40'
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                無料で使ってみる
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>

              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
