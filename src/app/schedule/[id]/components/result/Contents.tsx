'use client';

import { CalendarCheck } from 'lucide-react';
import SectionHeading from '@/components/shared/headings/SectionHeading';
import type { Schedule } from '@/db/core/types';
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

  // 決定した日時を取得
  const confirmedDateTimeItem = scheduleData.confirmedDateTime
    ? convertedDateTimes.find((item) => item.key === scheduleData.confirmedDateTime)
    : null;

  const formattedConfirmedDate = confirmedDateTimeItem
    ? (() => {
        const d = confirmedDateTimeItem.date;
        const dateText = d.format('YYYY年MM月DD日(ddd)');
        const timeText = confirmedDateTimeItem.time ? ` ${confirmedDateTimeItem.time}` : '';
        return `${dateText}${timeText}`;
      })()
    : null;

  return (
    <div className="rounded-[2px] bg-white">
      <SectionHeading
        icon={CalendarCheck}
        title="出欠集計"
        rightContent={
          formattedConfirmedDate && (
            <div className="flex items-center gap-1 whitespace-nowrap rounded-[2px] border border-emerald-500 px-3 py-2 text-emerald-500">
              <span className="font-bold text-[12px]">決定 :</span>
              <span className="font-bold text-[13px]">{formattedConfirmedDate}</span>
            </div>
          )
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
