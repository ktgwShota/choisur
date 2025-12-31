'use client';

import { useState } from 'react';
import { calculateScore, calculateSummary, type DateTimeItem, type Response } from '../../../types';
import { DateStatusCard } from '../../shared/DateStatusCard';
import StatusIcon from '../../shared/StatusIcon';

// --- モバイル専用: メインコンポーネント ---
interface MobileTableProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
}

export default function MobileTable({
  allDateTimes,
  responses,
  confirmedDateTime,
}: MobileTableProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDateTime = allDateTimes[selectedIndex];
  const selectedKey = selectedDateTime?.key;

  return (
    <>
      {/* モバイル: 日付タブ */}
      <DateScrollList
        allDateTimes={allDateTimes}
        responses={responses}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        confirmedDateTime={confirmedDateTime}
      />

      {/* モバイル: レスポンスリスト */}
      {selectedDateTime && (
        <div>
          <ResponseList
            responses={responses}
            selectedKey={selectedKey}
            confirmedDateTime={confirmedDateTime}
          />
        </div>
      )}
    </>
  );
}

// --- モバイル専用: 日付スクロールリスト ---
const DateScrollList = ({
  allDateTimes,
  responses,
  selectedIndex,
  setSelectedIndex,
  confirmedDateTime,
}: {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  confirmedDateTime: string | null;
}) => (
  <div
    className="scrollbar-none flex overflow-x-auto"
    style={{
      scrollbarWidth: 'none',
    }}
  >
    {allDateTimes.map(({ date, time, key }, index) => {
      const tabSummary = calculateSummary(key, responses);
      const tabScore = calculateScore(tabSummary.available, tabSummary.maybe);
      const isTabConfirmed = confirmedDateTime === key;
      const isSelected = index === selectedIndex;

      return (
        <DateStatusCard
          key={key}
          date={date}
          time={time}
          score={tabScore}
          total={responses.length}
          isConfirmed={isTabConfirmed}
          isSelected={isSelected}
          onClick={() => setSelectedIndex(index)}
          className={`border-b ${isSelected ? 'border-b-blue-500' : 'border-b-slate-200'} ${index === allDateTimes.length - 1 ? '' : 'border-slate-200 border-r'}`}
        />
      );
    })}
  </div>
);

// --- モバイル専用: レスポンスリスト ---
const ResponseList = ({
  responses,
  selectedKey,
  confirmedDateTime,
}: {
  responses: Response[];
  selectedKey: string;
  confirmedDateTime: string | null;
}) => {
  const isConfirmed = confirmedDateTime === selectedKey;

  return (
    <div
      className={
        isConfirmed ? 'bg-gradient-to-br from-emerald-50/60 via-emerald-100/50 to-green-100/40' : ''
      }
    >
      {responses.map((response, index) => {
        return (
          <div
            key={`${response.name}-${index}`}
            className="flex items-center justify-between border-[#f0f0f0] border-b last:border-b-0"
            style={{ padding: 20 }}
          >
            <div className="flex items-center gap-1 font-bold text-[13px] text-slate-900">
              {response.name}
            </div>
            <StatusIcon status={response.availability[selectedKey]} size={24} />
          </div>
        );
      })}
    </div>
  );
};
