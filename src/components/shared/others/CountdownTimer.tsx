'use client';

import { useEffect, useState } from 'react';
import { getResponsiveValue } from '@/utils/styles';

interface CountdownTimerProps {
  endDateTime: string | null;
  isClosed: boolean;
}

interface TimeResult {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export default function CountdownTimer({ endDateTime, isClosed }: CountdownTimerProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!endDateTime || isClosed) return;
    const timer = setInterval(() => setTick((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [endDateTime, isClosed]);

  const getTimeParts = (): TimeResult => {
    if (!endDateTime) return { days: '∞', hours: '∞', minutes: '∞', seconds: '∞' };
    const endTime = new Date(endDateTime).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.ceil((endTime - now) / 1000));

    const d = Math.floor(diff / (24 * 60 * 60));
    const h = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
    const m = Math.floor((diff % (60 * 60)) / 60);
    const s = diff % 60;

    return {
      days: String(d).padStart(2, '0'),
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
    };
  };

  const time = getTimeParts();

  return (
    <div className="flex items-center gap-1.5 pr-2">
      <TimeUnit value={time.days} label="day" />
      <Separator />
      <TimeUnit value={time.hours} label="hour" />
      <Separator />
      <TimeUnit value={time.minutes} label="min" />
      <Separator />
      <TimeUnit value={time.seconds} label="sec" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className="font-bold font-mono text-slate-800 leading-none"
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontSize: getResponsiveValue(15, 17, 320, 900, true),
        }}
        suppressHydrationWarning
      >
        {value}
      </span>
      <span
        className="pl-[0.05em] font-bold text-slate-400 uppercase tracking-[0.05em]"
        style={{ fontSize: getResponsiveValue(7, 8, 320, 900, true) }}
      >
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div
      className="h-4 w-[1px] bg-slate-200"
      style={{
        marginLeft: getResponsiveValue(3, 6, 320, 900, true),
        marginRight: getResponsiveValue(3, 6, 320, 900, true),
      }}
    />
  );
}
