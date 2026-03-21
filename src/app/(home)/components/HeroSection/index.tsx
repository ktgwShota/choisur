'use client';

import { Presentation, Rocket } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { getResponsiveValue } from '@/utils/styles';
import { COLORS } from '../../constants';
import CreateSelectionDialog, { type ServiceSelectionMode } from './CreateSelectionDialog';

const BG = '#0f1628';
const _CYAN = '#00f0ff';
const MUTED = '#94a3b8';
function CalendarMockup() {
  return (
    <div
      className="w-full overflow-hidden rounded-[2px]"
      style={{
        boxShadow: '0 24px 60px rgba(0,0,0,0.25), 0 0 40px rgba(0,240,255,0.06)',
      }}
    >
      <Image
        src="/demo.png"
        alt="日程調整のデモ画面"
        width={1158}
        height={984}
        className="w-full"
        priority
      />
    </div>
  );
}

function MockupDecoOverlay() {
  // 四隅ブラケット（カメラファインダー風）
  // 3D tilt div 内部に配置するため画像と同じ平面・角度になる
  const arm = 20;
  const c = 'rgba(0,240,255,0.7)';
  return (
    <div className="pointer-events-none absolute hidden md:block" style={{ inset: 0 }}>
      <div
        className="absolute"
        style={{
          top: -14,
          left: -14,
          width: arm,
          height: arm,
          borderTop: `2px solid ${c}`,
          borderLeft: `2px solid ${c}`,
        }}
      />
      <div
        className="absolute"
        style={{
          top: -14,
          right: -14,
          width: arm,
          height: arm,
          borderTop: `2px solid ${c}`,
          borderRight: `2px solid ${c}`,
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: -14,
          left: -14,
          width: arm,
          height: arm,
          borderBottom: `2px solid ${c}`,
          borderLeft: `2px solid ${c}`,
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: -14,
          right: -14,
          width: arm,
          height: arm,
          borderBottom: `2px solid ${c}`,
          borderRight: `2px solid ${c}`,
        }}
      />
    </div>
  );
}

export default function HeroSection() {
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<ServiceSelectionMode>('create');

  return (
    <div
      id="hero-section"
      className="relative flex min-h-screen w-full flex-col overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Static glows */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 40% 50%, rgba(0,240,255,0.10) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 85% 20%, rgba(56,189,248,0.07) 0%, transparent 55%)',
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 45% 45%, black 20%, transparent 100%)',
          }}
        />
        {/* Particles */}
        <style>{`
          @keyframes hero-float-blink {
            0%   { transform: translateY(0);         opacity: 0; }
            8%   { opacity: var(--op); }
            20%  { opacity: calc(var(--op) * 0.1); }
            30%  { opacity: var(--op); }
            45%  { opacity: calc(var(--op) * 0.15); }
            55%  { opacity: var(--op); }
            68%  { opacity: calc(var(--op) * 0.1); }
            78%  { opacity: var(--op); }
            90%  { opacity: calc(var(--op) * 0.2); }
            100% { transform: translateY(-100vh);    opacity: 0; }
          }
          @keyframes hero-float-steady {
            0%   { transform: translateY(0);      opacity: 0; }
            10%  { opacity: var(--op); }
            90%  { opacity: var(--op); }
            100% { transform: translateY(-100vh); opacity: 0; }
          }
          .hero-particle-blink {
            animation: hero-float-blink var(--dur) linear infinite;
            animation-delay: var(--delay);
          }
          .hero-particle-steady {
            animation: hero-float-steady var(--dur) linear infinite;
            animation-delay: var(--delay);
          }
        `}</style>
        {[
          { left: '4%', size: 2.5, dur: 14, delay: 0, color: '#00f0ff', op: 0.25 },
          { left: '10%', size: 2, dur: 18, delay: -4, color: COLORS.ACCENT_INDIGO, op: 0.2 },
          { left: '16%', size: 2, dur: 13, delay: -8, color: '#00f0ff', op: 0.3 },
          { left: '22%', size: 2, dur: 16, delay: -2, color: COLORS.ACCENT_INDIGO, op: 0.2 },
          { left: '29%', size: 2.5, dur: 20, delay: -10, color: '#00f0ff', op: 0.25 },
          { left: '35%', size: 2, dur: 15, delay: -6, color: COLORS.ACCENT_INDIGO, op: 0.2 },
          { left: '41%', size: 2.5, dur: 16, delay: -12, color: '#00f0ff', op: 0.3 },
          { left: '47%', size: 2, dur: 12, delay: -5, color: COLORS.ACCENT_INDIGO, op: 0.2 },
          { left: '53%', size: 2, dur: 19, delay: -9, color: '#00f0ff', op: 0.25 },
          { left: '59%', size: 2.5, dur: 14, delay: -3, color: COLORS.ACCENT_INDIGO, op: 0.2 },
          { left: '64%', size: 2, dur: 17, delay: -7, color: '#00f0ff', op: 0.3 },
          { left: '69%', size: 2.5, dur: 13, delay: -1, color: COLORS.ACCENT_INDIGO, op: 0.2 },
          { left: '74%', size: 2, dur: 18, delay: -11, color: '#00f0ff', op: 0.25 },
          { left: '79%', size: 2, dur: 15, delay: -4, color: COLORS.ACCENT_INDIGO, op: 0.2 },
          { left: '83%', size: 2.5, dur: 16, delay: -8, color: '#00f0ff', op: 0.3 },
          { left: '87%', size: 2, dur: 20, delay: -2, color: COLORS.ACCENT_INDIGO, op: 0.2 },
          { left: '90%', size: 2.5, dur: 12, delay: -12, color: '#00f0ff', op: 0.25 },
          { left: '93%', size: 2, dur: 17, delay: -6, color: COLORS.ACCENT_INDIGO, op: 0.2 },
          { left: '96%', size: 2, dur: 14, delay: -10, color: '#00f0ff', op: 0.3 },
          { left: '99%', size: 2.5, dur: 19, delay: -5, color: COLORS.ACCENT_INDIGO, op: 0.2 },
        ].map((p, i) => (
          <div
            key={`${p.left}-${p.dur}-${p.delay}`}
            className={`${i % 2 === 0 ? 'hero-particle-blink' : 'hero-particle-steady'} absolute rounded-full`}
            style={
              {
                left: p.left,
                bottom: '-4px',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                '--dur': `${p.dur}s`,
                '--delay': `${p.delay}s`,
                '--op': p.op,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div
        className="z-10 flex w-full flex-1 flex-col justify-center"
        style={{
          paddingLeft: getResponsiveValue(20, 40),
          paddingRight: getResponsiveValue(20, 40),
        }}
      >
        <div className="mx-auto w-full max-w-[960px]">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            {/* ── Left: Copy ── */}
            <div>
              {/* TODO: デザイン的にはあったほうがいいかも？考える */}
              {/* <div
                className="mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 sm:mb-7"
                style={{
                  backgroundColor: 'rgba(15,22,45,0.9)',
                  border: '1px solid rgba(0,240,255,0.2)',
                }}
              >
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: CYAN }} />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: '#7dd3fc', letterSpacing: '1px' }}
                >
                  日程調整 / 多数決アプリ
                </span>
              </div> */}

              {/* Headline */}
              <h1
                className="font-black text-white"
                style={{
                  fontSize: getResponsiveValue(24, 28, 320, 960, true),
                  lineHeight: 1.06,
                }}
              >
                幹事、もっと簡単に。
              </h1>

              {/* Body */}
              <p
                className="mt-4 leading-[1.85] sm:mt-6"
                style={{
                  color: MUTED,
                  fontSize: '0.95rem',
                  maxWidth: '960px',
                }}
              >
                Choisur（チョイスル）では、飲み会やイベントの「日程調整」や行き先を決めるための「多数決」を無料で利用できます。
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setDialogMode('create');
                    setOpen(true);
                  }}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 py-3.5 pr-6 pl-5.5 font-bold text-sm text-white shadow-[0_0_32px_rgba(99,102,241,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Rocket size={15} strokeWidth={2.5} className="shrink-0 text-white" />
                  今すぐ始める
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDialogMode('demo');
                    setOpen(true);
                  }}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full py-3.5 pr-6 pl-5.5 font-bold text-sm text-white transition-all hover:bg-white/5"
                  style={{
                    boxShadow: '0 0 0 1px rgba(148,163,184,0.3)',
                  }}
                >
                  <Presentation size={15} strokeWidth={2.5} className="shrink-0 text-white" />
                  デモを見る
                </button>
              </div>
            </div>

            {/* ── Right: Mockup ── */}
            {/* rotateY(-14deg) で手前側が広く見え視覚重心が右に寄る。カード幅 W に対し左へ W×sin(θ)/10 程度で補正（θ=14° → 約 2.4%） */}
            <div
              className="relative hidden w-full md:block"
              style={{
                transform: 'translateX(calc(-100% * sin(14deg) / 10))',
              }}
            >
              {/* 3-D tilt */}
              <div
                className="md:[transform:perspective(900px)_rotateY(-14deg)_rotateX(4deg)_scale(1.07)]"
                style={{
                  transformStyle: 'preserve-3d',
                  filter: 'drop-shadow(-10px 14px 28px rgba(0,0,0,0.3))',
                }}
              >
                <MockupDecoOverlay />
                <CalendarMockup />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateSelectionDialog open={open} onClose={() => setOpen(false)} mode={dialogMode} />
    </div>
  );
}
