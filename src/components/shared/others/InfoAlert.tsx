'use client';

import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/shared/primitives/alert';
import { cn } from '@/utils/styles';

const sizeClasses = {
  default: 'px-4 py-4 text-sm',
  compact: 'px-3 py-2.5 text-[12.5px] leading-relaxed',
} as const;

interface InfoAlertProps {
  children: ReactNode;
  /** default: フォーム内など標準サイズ / compact: ポップオーバー内などコンパクト */
  size?: keyof typeof sizeClasses;
  className?: string;
}

/**
 * スカイ色の情報用アラート。ヒント・説明文の表示に使う。
 */
export default function InfoAlert({ children, size = 'default', className }: InfoAlertProps) {
  return (
    <Alert
      className={cn(
        'rounded-[2px] border-sky-200 bg-sky-50 text-sky-900',
        sizeClasses[size],
        className
      )}
    >
      <Info
        className={cn(
          'shrink-0 text-sky-600',
          size === 'default' ? 'h-4 w-4' : 'mt-0.5 h-3.5 w-3.5'
        )}
      />
      <AlertDescription
        className={cn('text-sky-800', size === 'compact' && 'text-[12.5px] leading-relaxed')}
      >
        {children}
      </AlertDescription>
    </Alert>
  );
}
