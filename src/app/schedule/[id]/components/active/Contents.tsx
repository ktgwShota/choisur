'use client';

import { CalendarCheck } from 'lucide-react';
import SectionHeading from '@/components/shared/headings/SectionHeading';
import CountdownTimer from '@/components/shared/others/CountdownTimer';
import type { Schedule } from '@/db/core/types';
import { useData } from '../../hooks/useData';
import { useResponse } from '../../hooks/useResponse';
import Table from './table';

interface ContentsProps {
  schedule: Schedule;
}

export default function Contents({ schedule }: ContentsProps) {
  const scheduleData = {
    ...schedule,
    responses: schedule.responses ?? [],
  };

  const { allDateTimes, bestKeys } = useData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  const responseHook = useResponse({
    scheduleId: scheduleData.id,
    responses: scheduleData.responses,
    allDateTimes,
  });

  const scheduleTableProps = {
    allDateTimes,
    allResponses: scheduleData.responses,
    bestKeys,
    isClosed: !!scheduleData.isClosed,
    confirmedDateTime: scheduleData.confirmedDateTime,
    ...responseHook,
  };

  return (
    <div>
      <SectionHeading
        icon={CalendarCheck}
        title="出欠受付中"
        rightContent={
          <CountdownTimer
            endDateTime={scheduleData.endDateTime}
            isClosed={!!scheduleData.isClosed}
          />
        }
      />
      <div className="mb-2 overflow-hidden rounded-[2px] border border-slate-200 bg-white">
        <Table {...scheduleTableProps} />
      </div>
    </div>
  );
}
