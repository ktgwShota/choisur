'use client';

import type * as React from 'react';
import { Input } from '@/components/shared/primitives/input';
import { cn } from '@/utils/styles';

interface InputWithCounterProps extends React.ComponentProps<typeof Input> {
  currentLength: number;
  maxLength: number;
  showCharCount?: boolean;
  containerClassName?: string;
}

export default function InputWithCounter({
  currentLength,
  maxLength,
  showCharCount = true,
  className,
  containerClassName,
  ...props
}: InputWithCounterProps) {
  return (
    <div
      className={cn(
        'flex items-center rounded-[2px] border border-[rgba(0,0,0,0.23)] bg-white transition-all',
        'focus-within:border-[#1976d2] focus-within:ring-1 focus-within:ring-[#1976d2]',
        'group w-full',
        containerClassName
      )}
    >
      <Input
        {...props}
        maxLength={maxLength}
        className={cn(
          'h-auto border-none bg-transparent px-4 py-4 text-[15px] shadow-none outline-none focus-visible:ring-0 md:text-[15px]',
          className
        )}
      />
      {showCharCount && (
        <span className="shrink-0 select-none px-4 text-[12px] text-[rgba(0,0,0,0.38)]">
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
  );
}
