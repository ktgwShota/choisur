'use client';

import { ArrowRight, Calendar, Utensils } from 'lucide-react';
import Link from 'next/link';
import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import { DialogHeader, DialogTitle } from '@/components/shared/primitives/dialog';
import { Separator } from '@/components/shared/primitives/separator';
import { getResponsiveValue } from '@/utils/styles';
import { COLORS } from '../../constants';

// Types
type ServiceOption = {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  href: string;
  colors: {
    accent: string; // Tailwind class for text color
    iconBg: string; // Tailwind class for background
    hover: string; // Tailwind class for hover background
  };
};

// Configuration
const SERVICE_OPTIONS: ServiceOption[] = [
  {
    title: '店決め',
    subtitle: 'DISCOVERY',
    description: '参加者の投票を集計し、全員が納得できるお店を決定します。',
    icon: Utensils,
    href: '/polls/create',
    colors: {
      accent: 'text-indigo-500', // #6366f1
      iconBg: 'bg-indigo-50', // #eef2ff
      hover: 'group-hover:bg-indigo-500',
    },
  },
  {
    title: '日程調整',
    subtitle: 'SCHEDULING',
    description: '参加者の出欠を集計し、全員が参加できる最適な日程を決定します。',
    icon: Calendar,
    href: '/schedule/create',
    colors: {
      accent: 'text-violet-500', // #8b5cf6
      iconBg: 'bg-violet-50', // #f5f3ff
      hover: 'group-hover:bg-violet-500',
    },
  },
];

export default function CreateSelectionDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <FadeDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      header={
        <DialogHeader>
          <DialogTitle
            className="text-center font-extrabold text-slate-900 tracking-widest"
            style={{ fontSize: getResponsiveValue(20, 24) }}
          >
            <span
              className="mb-2 block font-bold tracking-wide"
              style={{
                color: COLORS.ACCENT_INDIGO,
                fontSize: getResponsiveValue(11, 12),
              }}
            >
              サービス
            </span>
            SERVICE
            <div
              className="mx-auto mt-4 h-1 w-[60px] rounded-[2px]"
              style={{ backgroundColor: COLORS.ACCENT_INDIGO }}
            />
          </DialogTitle>
        </DialogHeader>
      }
      contents={
        <div className="flex flex-col sm:flex-row" style={{ gap: getResponsiveValue(20, 24) }}>
          {SERVICE_OPTIONS.map((opt) => (
            <ServiceCard key={opt.href} option={opt} />
          ))}
        </div>
      }
    />
  );
}

function ServiceCard({ option }: { option: ServiceOption }) {
  const { title, subtitle, description, icon: Icon, href, colors } = option;

  return (
    <Link
      href={href}
      className="group flex flex-1 flex-col rounded-[2px] border border-slate-200 bg-white no-underline transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
      style={{
        padding: getResponsiveValue(20, 28),
        paddingBottom: getResponsiveValue(20, 24),
      }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between gap-4"
        style={{ marginBottom: getResponsiveValue(20, 24) }}
      >
        <div className="min-w-0 flex-1">
          <span
            className={`mb-2 block font-bold uppercase leading-none tracking-[0.1em] ${colors.accent}`}
            style={{ fontSize: getResponsiveValue(10, 12) }}
          >
            {subtitle}
          </span>
          <h6
            className="break-words font-extrabold text-slate-900"
            style={{ fontSize: getResponsiveValue(17, 20) }}
          >
            {title}
          </h6>
        </div>
        <div
          className={`icon-box flex shrink-0 items-center justify-center rounded-lg p-3 transition-all duration-300 group-hover:text-white md:p-4 ${colors.iconBg} ${colors.accent} ${colors.hover}`}
        >
          <Icon style={{ width: getResponsiveValue(24, 28), height: getResponsiveValue(24, 28) }} />
        </div>
      </div>

      {/* Description */}
      <p
        className="flex-1 text-left font-medium text-slate-600 leading-relaxed"
        style={{ fontSize: getResponsiveValue(13, 14) }}
      >
        {description}
      </p>

      <Separator
        style={{
          marginTop: getResponsiveValue(20, 24),
          marginBottom: getResponsiveValue(20, 24),
        }}
      />

      {/* Footer Action */}
      <div
        className={`flex items-center justify-end gap-2 group-hover:[&_.action-icon]:translate-x-1 group-hover:[&_.action-icon]:opacity-100 ${colors.accent}`}
      >
        <span className="font-bold" style={{ fontSize: getResponsiveValue(12, 13) }}>
          イベントを作成
        </span>
        <ArrowRight
          className="action-icon opacity-70 transition-transform duration-300"
          style={{ width: getResponsiveValue(12, 16), height: getResponsiveValue(12, 16) }}
        />
      </div>
    </Link>
  );
}
