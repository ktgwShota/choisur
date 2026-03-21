'use client';

import type { ReactNode } from 'react';
import { getResponsiveValue } from '@/utils/styles';

interface AdvancedPageTitleProps {
  label: string;
  title: string;
  actions: ReactNode;
  status: ReactNode;
}

export default function AdvancedPageTitle({
  label,
  title,
  actions,
  status,
}: AdvancedPageTitleProps) {
  return (
    <div className="flex flex-col gap-y-0 sm:grid sm:grid-cols-[1fr_auto] sm:grid-rows-[auto_auto] sm:gap-x-8 sm:gap-y-6 lg:gap-x-12">
      <div className="mb-6 flex w-full items-center justify-between gap-2 sm:contents">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-5 sm:col-start-2 sm:row-start-2 sm:mb-6 sm:w-auto sm:items-end">
          {status}
        </div>

        <div className="w-auto shrink-0 sm:col-start-2 sm:row-start-1 sm:mb-0 sm:flex sm:w-auto sm:flex-col sm:items-end">
          {actions}
        </div>
      </div>

      <div className="flex flex-col sm:col-start-1 sm:row-span-2 sm:row-start-1">
        <span className="whitespace-nowrap font-bold text-[10px] text-indigo-500 uppercase leading-none tracking-[0.15em]">
          {label}
        </span>

        <div
          className="flex flex-1 items-center justify-center"
          style={{
            marginTop: getResponsiveValue(32, 48, 320, 900, true),
            marginBottom: getResponsiveValue(32, 64, 320, 900, true),
          }}
        >
          <h1
            className="m-0 font-black text-slate-900 leading-[1.3] tracking-[-0.02em]"
            style={{ fontSize: getResponsiveValue(20, 24, 320, 900, true) }}
          >
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
