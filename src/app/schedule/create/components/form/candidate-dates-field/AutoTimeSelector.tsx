'use client';

import { Clock, Info } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/shared/primitives/alert';
import { Button } from '@/components/shared/primitives/button';
import { Input } from '@/components/shared/primitives/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shared/primitives/popover';
import type { Dayjs } from '@/lib/dayjs';
import dayjs from '@/lib/dayjs';
import { cn, getResponsiveValue } from '@/utils/styles';

interface AutoTimeSelectorProps {
  isAutoTimeEnabled: boolean;
  setIsAutoTimeEnabled: (val: boolean) => void;
  autoTimeValue: Dayjs | null;
  setAutoTimeValue: (val: Dayjs | null) => void;
  revision: number;
  setRevision: (fn: (prev: number) => number) => void;
}

export const AutoTimeSelector = ({
  isAutoTimeEnabled,
  setIsAutoTimeEnabled,
  autoTimeValue,
  setAutoTimeValue,
  revision,
  setRevision,
}: AutoTimeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempTime, setTempTime] = useState(autoTimeValue?.format('HH:mm') || '19:00');

  const handleClose = () => {
    setIsOpen(false);
  };

  const _handleClick = () => {
    if (isAutoTimeEnabled) {
      setIsAutoTimeEnabled(false);
      setAutoTimeValue(null);
    } else {
      setIsOpen(true);
    }
  };

  const handleAccept = () => {
    if (tempTime) {
      const [hours, minutes] = tempTime.split(':');
      const newValue = dayjs().hour(parseInt(hours, 10)).minute(parseInt(minutes, 10));
      setAutoTimeValue(newValue);
      setIsAutoTimeEnabled(true);
      setRevision((prev) => prev + 1);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          onClick={(e: React.MouseEvent) => {
            if (isAutoTimeEnabled) {
              e.preventDefault();
              setIsAutoTimeEnabled(false);
              setAutoTimeValue(null);
            }
          }}
          className={cn(
            '!pl-3 !pr-3.5 relative h-10 gap-1.5 overflow-hidden rounded-full font-bold transition-all duration-300',
            isAutoTimeEnabled
              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_12px_rgba(37,99,235,0.15)] hover:bg-blue-100 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]'
              : 'border-border bg-white text-slate-500 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700'
          )}
        >
          <span
            className={cn(
              'absolute inset-0 bg-blue-400/10 transition-transform duration-500',
              isAutoTimeEnabled ? 'translate-y-0' : 'translate-y-full'
            )}
          />

          <div className="relative z-10 flex items-center gap-1.75">
            {isAutoTimeEnabled ? (
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                <span
                  className="tracking-tight"
                  style={{
                    fontSize: getResponsiveValue(12, 13),
                  }}
                >
                  {autoTimeValue?.format('HH:mm')}
                </span>
              </div>
            ) : (
              <>
                <Clock className="transition-colors group-hover:text-slate-600" />
                <span
                  className="whitespace-nowrap"
                  style={{
                    fontSize: getResponsiveValue(11.5, 12.5),
                  }}
                >
                  時刻自動追加
                </span>
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-72 rounded-[2px] border-border p-4 shadow-xl"
        align="end"
        sideOffset={8}
      >
        <div className="space-y-4">
          <Alert className="rounded-[2px] border-blue-100 bg-blue-50/70 px-3 py-2.5 text-blue-800 shadow-none">
            <Info className="mt-0.5 h-3.5 w-3.5 text-blue-500" />
            <AlertDescription className="font-semibold text-[12.5px] leading-relaxed">
              日付を選択した時に、自動的に出欠表に追加する時間を設定できます。
            </AlertDescription>
          </Alert>

          <Input
            type="time"
            value={tempTime}
            onChange={(e) => setTempTime(e.target.value)}
            step="300"
            className={cn(
              'h-11 w-full rounded-[2px] border-border bg-white px-3 font-bold text-base tracking-wider outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-0 focus-visible:ring-0',
              '[&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100',
              '[&::-webkit-datetime-edit-hour-field:focus]:bg-blue-600 [&::-webkit-datetime-edit-hour-field:focus]:text-white [&::-webkit-datetime-edit-hour-field:focus]:outline-none',
              '[&::-webkit-datetime-edit-minute-field:focus]:bg-blue-600 [&::-webkit-datetime-edit-minute-field:focus]:text-white [&::-webkit-datetime-edit-minute-field:focus]:outline-none'
            )}
          />

          <div className="flex w-full gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-10 flex-1 rounded-[2px] border-border font-bold text-[13px] text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleAccept}
              className="h-10 flex-1 rounded-[2px] bg-blue-600 font-bold text-[13px] text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
            >
              追加
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
