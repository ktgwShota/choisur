'use client';

import { CalendarCheck } from 'lucide-react';
import SectionHeading from '@/components/shared/headings/SectionHeading';
import type { Schedule } from '@/db/core/types';
import { getResponsiveValue } from '@/utils/styles';
import { convertDateTimeItems } from '../../utils/convertDateTimeItems';
import { processScheduleData, sortDateTimesByConfirmed } from '../../utils/scheduleData';
import Table from './table';

interface ContentsProps {
  schedule: Schedule;
}

export default function Contents({ schedule }: ContentsProps) {
  const scheduleData = {
    ...schedule,
    responses: schedule.responses ?? [],
  };

  const { allDateTimes } = processScheduleData(scheduleData.dates, scheduleData.responses);
  const sortedDateTimes = sortDateTimesByConfirmed(allDateTimes, scheduleData.confirmedDateTime);
  const convertedDateTimes = convertDateTimeItems(sortedDateTimes);
  const responseCount = scheduleData.responses.length;

  return (
    <div className="rounded-[2px] bg-white">
      <SectionHeading
        icon={CalendarCheck}
        title="出欠表"
        rightContent={
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-medium text-slate-500"
              style={{ fontSize: getResponsiveValue(13, 14, 320, 900, true) }}
            >
              参加者
            </span>
            <span
              className="font-black text-slate-900"
              style={{ fontSize: getResponsiveValue(15, 17, 320, 900, true) }}
            >
              {responseCount.toLocaleString()}
            </span>
            <span
              className="font-medium text-slate-500"
              style={{ fontSize: getResponsiveValue(13, 14, 320, 900, true) }}
            >
              人
            </span>
          </div>
        }
      />

      <Table
        allDateTimes={convertedDateTimes}
        responses={scheduleData.responses}
        confirmedDateTime={scheduleData.confirmedDateTime}
      />
    </div>
  );
}
