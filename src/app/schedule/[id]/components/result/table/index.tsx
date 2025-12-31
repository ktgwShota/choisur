'use client';

import type { DateTimeItem, Response } from '../../../types';
import MobileTable from './Mobile';
import DesktopTable from './Pc';

interface TableProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
}

export default function Table({ allDateTimes, responses, confirmedDateTime }: TableProps) {
  return (
    <>
      {/* PC専用セクション (640px以上で表示) */}
      <div className="hidden sm:block">
        <div className="rounded-[2px] border border-[#ddd]">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <DesktopTable
                allDateTimes={allDateTimes}
                responses={responses}
                confirmedDateTime={confirmedDateTime}
              />
            </div>
          </div>
        </div>
      </div>

      {/* モバイル専用セクション (640px未満で表示) */}
      <div className="block sm:hidden">
        <div className="mb-2 overflow-hidden rounded-[2px] border border-slate-200 bg-white">
          <MobileTable
            allDateTimes={allDateTimes}
            responses={responses}
            confirmedDateTime={confirmedDateTime}
          />
        </div>
      </div>
    </>
  );
}
