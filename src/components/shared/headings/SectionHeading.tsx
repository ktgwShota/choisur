'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { getResponsiveValue } from '@/utils/styles';

interface SectionHeadingProps {
  icon: LucideIcon;
  title: string;
  rightContent?: ReactNode;
}

export default function SectionHeading({ icon: Icon, title, rightContent }: SectionHeadingProps) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ marginTop: getResponsiveValue(24, 28), marginBottom: getResponsiveValue(24, 28) }}
    >
      <h2
        className="flex items-center gap-2 font-bold text-slate-900"
        style={{ fontSize: getResponsiveValue(17, 18, 320, 900, true) }}
      >
        <Icon className="h-5 w-5 text-indigo-500" />
        {title}
      </h2>

      <div className="flex h-8 items-center">{rightContent}</div>
    </div>
  );
}
