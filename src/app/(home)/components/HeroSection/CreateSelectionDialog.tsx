'use client';

import { ArrowRight, BarChart2, Calendar } from 'lucide-react';
import Link from 'next/link';
import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import { DialogHeader, DialogTitle } from '@/components/shared/primitives/dialog';
import { cn, getResponsiveValue } from '@/utils/styles';
import { DEMO_IDS } from '../../constants';

export type ServiceSelectionMode = 'create' | 'demo';

type ServiceOption = {
  title: string;
  description: string;
  cta: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  href: string;
  gradient: string;
  /** Lucide の style color を避け、Tailwind で統一（React 19 ハイドレーション対策） */
  accent: 'indigo' | 'violet';
  /** linear-gradient の #RRGGBBAA 連結用 */
  iconHex: string;
  glowColor: string;
};

function getServiceOptions(mode: ServiceSelectionMode): ServiceOption[] {
  if (mode === 'demo') {
    return [
      {
        title: '多数決',
        description: '投票によって最適な候補を決める',
        cta: 'デモを見る',
        icon: BarChart2,
        href: `/polls/${DEMO_IDS.POLL}`,
        gradient: 'linear-gradient(160deg, #eef2ff 0%, #ffffff 60%)',
        accent: 'indigo',
        iconHex: '#6366f1',
        glowColor: 'rgba(99,102,241,0.15)',
      },
      {
        title: '日程調整',
        description: '出欠表から最適な日程を決める',
        cta: 'デモを見る',
        icon: Calendar,
        href: `/schedule/${DEMO_IDS.SCHEDULE}`,
        gradient: 'linear-gradient(160deg, #f5f3ff 0%, #ffffff 60%)',
        accent: 'violet',
        iconHex: '#8b5cf6',
        glowColor: 'rgba(139,92,246,0.15)',
      },
    ];
  }
  return [
    {
      title: '多数決',
      description: '投票によって最適な候補を決める',
      cta: '今すぐ始める',
      icon: BarChart2,
      href: '/polls/create',
      gradient: 'linear-gradient(160deg, #eef2ff 0%, #ffffff 60%)',
      accent: 'indigo',
      iconHex: '#6366f1',
      glowColor: 'rgba(99,102,241,0.15)',
    },
    {
      title: '日程調整',
      description: '出欠表から最適な日程を決める',
      cta: '今すぐ始める',
      icon: Calendar,
      href: '/schedule/create',
      gradient: 'linear-gradient(160deg, #f5f3ff 0%, #ffffff 60%)',
      accent: 'violet',
      iconHex: '#8b5cf6',
      glowColor: 'rgba(139,92,246,0.15)',
    },
  ];
}

export default function CreateSelectionDialog({
  open,
  onClose,
  mode = 'create',
}: {
  open: boolean;
  onClose: () => void;
  mode?: ServiceSelectionMode;
}) {
  const options = getServiceOptions(mode);

  return (
    <FadeDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      maxWidth="560px"
      contents={
        <div
          className="overflow-hidden rounded-[2px]"
          style={{
            // NOTE: FadeDialog の DialogContent は padding + paddingTop（上だけ太め）を指定している。
            // Tailwind の -my-5 等では上方向の相殺が足りず余白が残るため、FadeDialog と同じ
            // getResponsiveValue の clamp を calc(-1 *) で打ち消す（数値変更時は FadeDialog と揃えること）。
            marginTop: `calc(-1 * (${getResponsiveValue(24, 28, 320, 900, true)}))`,
            marginBottom: `calc(-1 * (${getResponsiveValue(20, 24, 320, 900, true)}))`,
            marginLeft: `calc(-1 * (${getResponsiveValue(20, 24, 320, 900, true)}))`,
            marginRight: `calc(-1 * (${getResponsiveValue(20, 24, 320, 900, true)}))`,
          }}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{mode === 'demo' ? 'デモを見る' : '今すぐ始める'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row">
            {options.map((opt, i) => (
              <ServicePanel key={opt.href} option={opt} divider={i === 0} />
            ))}
          </div>
        </div>
      }
    />
  );
}

function ServicePanel({ option, divider }: { option: ServiceOption; divider: boolean }) {
  const {
    title,
    description,
    cta,
    icon: Icon,
    href,
    gradient,
    accent,
    iconHex,
    glowColor,
  } = option;
  const accentText = accent === 'indigo' ? 'text-indigo-500' : 'text-violet-500';
  const accentBg = accent === 'indigo' ? 'bg-indigo-500' : 'bg-violet-500';

  return (
    <Link
      href={href}
      className="group relative flex flex-1 flex-col items-center justify-center no-underline transition-all duration-500"
      style={{
        background: gradient,
        padding: '48px 32px 40px',
        borderRight: divider ? '1px solid #e2e8f0' : undefined,
        borderBottom: divider ? '1px solid #e2e8f0' : undefined,
      }}
    >
      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: gradient.replace('0%, #ffffff 60%', '0%, #f8f9ff 60%') }}
      />

      {/* Icon */}
      <div className="relative mb-6">
        {/* Outer glow */}
        <div
          className="absolute inset-0 scale-[2] rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ backgroundColor: glowColor }}
        />
        {/* Icon container */}
        <div
          className={cn(
            'relative flex items-center justify-center overflow-hidden rounded-2xl transition-all duration-500 group-hover:scale-110',
            accentText
          )}
          style={{
            width: 68,
            height: 68,
            background: `linear-gradient(135deg, ${iconHex}22 0%, ${iconHex}0a 100%)`,
            border: `1px solid ${iconHex}33`,
            boxShadow: `inset 0 1px 0 ${iconHex}22`,
          }}
        >
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `linear-gradient(135deg, ${iconHex}30 0%, transparent 60%)` }}
          />
          <Icon size={28} strokeWidth={1.8} className="relative z-10" />
        </div>
      </div>
      {/* Text */}
      <div className="relative text-center">
        <h3
          className="mb-2 font-black text-slate-900"
          style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}
        >
          {title}
        </h3>
        <p className="text-slate-400 text-xs">{description}</p>
      </div>

      {/* CTA */}
      <div className="relative mt-6">
        <span
          className={cn('relative inline-flex items-center gap-1 font-bold text-xs', accentText)}
        >
          {cta}
          <ArrowRight size={13} strokeWidth={2.5} />
          {/* Underline */}
          <span
            className={cn(
              'absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-500 group-hover:w-full',
              accentBg
            )}
          />
        </span>
      </div>
    </Link>
  );
}
