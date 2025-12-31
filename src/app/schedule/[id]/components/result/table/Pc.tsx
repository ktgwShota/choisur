'use client';

import type { DateTimeItem, Response } from '../../../types';
import { TableHeader, TableRow } from '../../active/table/Pc';

interface DesktopTableProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
}

export default function DesktopTable({
  allDateTimes,
  responses,
  confirmedDateTime,
}: DesktopTableProps) {
  return (
    <div className="relative">
      {/* ヘッダー行 */}
      <TableHeader
        allDateTimes={allDateTimes}
        responses={responses}
        confirmedDateTime={confirmedDateTime}
      />

      {/* 回答者行 */}
      {responses.length > 0 &&
        responses.map((response, index) => (
          <TableRow
            key={response.respondentId}
            response={response}
            allDateTimes={allDateTimes}
            confirmedDateTime={confirmedDateTime}
            isLast={index === responses.length - 1}
          />
        ))}
    </div>
  );
}
