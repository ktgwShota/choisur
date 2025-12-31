'use client';

import { Settings2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/shared/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shared/primitives/dropdown-menu';
import { cn } from '@/utils/styles';

interface OrganizerMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function OrganizerMenu({ children, open, onOpenChange }: OrganizerMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-auto w-full shrink-0 rounded-[2px] border-slate-200 bg-white px-3 py-3 font-bold text-slate-600 transition-all hover:border-primary/30 hover:bg-slate-50 hover:text-primary active:scale-[0.98] sm:w-auto sm:px-4"
        >
          <Settings2 size={16} className="opacity-70" />
          <span className="text-[12px] sm:text-[13px]">メニュー</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[220px] rounded-[2px] border-slate-200 bg-white p-2.5"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface OrganizerMenuItemProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export function OrganizerMenuItem({
  icon,
  title,
  description,
  onClick,
  variant = 'default',
  disabled = false,
}: OrganizerMenuItemProps) {
  const isDanger = variant === 'danger';

  return (
    <DropdownMenuItem
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-[2px] px-3.5 py-3 transition-colors focus:outline-none',
        isDanger
          ? 'text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700'
          : 'hover:bg-blue-50 focus:bg-blue-50',
        disabled && 'pointer-events-none opacity-50 grayscale'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isDanger ? 'bg-red-100/50 text-red-600' : 'bg-blue-100/50 text-blue-600'
        )}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className={cn(
            'truncate font-bold text-[14px] leading-none',
            isDanger ? 'text-red-600' : 'text-slate-700'
          )}
        >
          {title}
        </span>
        {description && (
          <span className="text-[11px] text-slate-400 leading-tight">{description}</span>
        )}
      </div>
    </DropdownMenuItem>
  );
}
