'use client';

import type { ReactNode } from 'react';

interface BasicPageTitleProps {
  children: ReactNode;
}

export default function BasicPageTitle({ children }: BasicPageTitleProps) {
  return (
    <h1
      className="mb-8 font-bold text-lg text-slate-900 sm:text-xl"
      style={{ color: 'rgba(0, 0, 0, 0.87)' }}
    >
      {children}
    </h1>
  );
}
