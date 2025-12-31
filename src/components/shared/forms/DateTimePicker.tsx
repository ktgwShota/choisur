'use client';

import dayjs from 'dayjs';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/shared/primitives/button';
import { Calendar } from '@/components/shared/primitives/calendar';
import { Input } from '@/components/shared/primitives/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shared/primitives/popover';
import { cn } from '@/utils/styles';

interface DateTimePickerProps {
  value: dayjs.Dayjs | null;
  onChange: (date: dayjs.Dayjs | null) => void;
  minDateTime?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  label?: string;
  error?: boolean;
  helperText?: string;
  onClear?: () => void;
}

export default function DateTimePicker({
  value,
  onChange,
  minDateTime,
  maxDate,
  label = '日時を選択',
  error,
  helperText,
  onClear,
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<dayjs.Dayjs | null>(value);

  React.useEffect(() => {
    setSelectedDateTime(value);
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const newDate = dayjs(date);
    const currentTime =
      selectedDateTime || dayjs().set('hour', 19).set('minute', 0).set('second', 0);

    const newDateTime = newDate.set('hour', currentTime.hour()).set('minute', currentTime.minute());

    setSelectedDateTime(newDateTime);
    onChange(newDateTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value;
    if (!timeStr) return;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const currentDate =
      selectedDateTime || dayjs().set('hour', 19).set('minute', 0).set('second', 0);
    const newDateTime = currentDate.set('hour', hours).set('minute', minutes);

    setSelectedDateTime(newDateTime);
    onChange(newDateTime);
  };

  // Disable dates before minDateTime (ignoring time for calendar disable)
  const isDateDisabled = (date: Date) => {
    if (maxDate && dayjs(date).isAfter(maxDate, 'day')) return true;
    if (minDateTime && dayjs(date).isBefore(minDateTime, 'day')) return true;
    return false;
  };

  return (
    <div className="relative flex w-full flex-col gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'group h-11 w-full justify-between rounded-[2px] border-border bg-white px-3 text-left font-medium shadow-none transition-all hover:border-slate-300 hover:bg-slate-50',
              !selectedDateTime && 'text-slate-400',
              error && 'border-red-500 text-red-500 focus-visible:ring-red-500'
            )}
          >
            <span className="truncate">
              {selectedDateTime ? selectedDateTime.format('YYYY/MM/DD HH:mm') : label}
            </span>
            <div className="flex items-center gap-2">
              {selectedDateTime && onClear && (
                <div
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClear();
                  }}
                  className="cursor-pointer rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </div>
              )}
              <CalendarIcon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  selectedDateTime ? 'text-blue-600' : 'text-slate-400'
                )}
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto rounded-[2px] border-border p-0 shadow-xl" align="start">
          <Calendar
            mode="single"
            selected={selectedDateTime?.toDate()}
            onSelect={handleDateSelect}
            initialFocus
            disabled={isDateDisabled}
            classNames={{
              day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-[2px]',
              day_range_start: 'rounded-l-[2px]',
              day_range_end: 'rounded-r-[2px]',
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-[2px]',
              day_today: 'bg-accent text-accent-foreground rounded-[2px]',
            }}
          />
          <div className="border-border border-t bg-slate-50/30 p-4">
            <Input
              type="time"
              value={selectedDateTime ? selectedDateTime.format('HH:mm') : '19:00'}
              onChange={handleTimeChange}
              className={cn(
                'h-10 w-full rounded-[2px] border-border bg-white px-3 font-medium text-sm outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-0',
                '[&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100',
                '[&::-webkit-datetime-edit-hour-field:focus]:bg-blue-600 [&::-webkit-datetime-edit-hour-field:focus]:text-white [&::-webkit-datetime-edit-hour-field:focus]:outline-none',
                '[&::-webkit-datetime-edit-minute-field:focus]:bg-blue-600 [&::-webkit-datetime-edit-minute-field:focus]:text-white [&::-webkit-datetime-edit-minute-field:focus]:outline-none'
              )}
            />
          </div>
        </PopoverContent>
      </Popover>
      {helperText && (
        <p className={cn('text-[0.8rem] text-muted-foreground', error && 'text-red-500')}>
          {helperText}
        </p>
      )}
    </div>
  );
}
