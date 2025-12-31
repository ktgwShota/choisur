'use client';

import { Edit2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import FloatingLabelInput from '@/components/shared/forms/FloatingLabelInput';
import FormattedDate from '@/components/shared/others/FormattedDate';
import { Button } from '@/components/shared/primitives/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/primitives/dialog';
import { getResponsiveValue } from '@/utils/styles';
import { calculateScore, calculateSummary, type ScheduleTableProps } from '../../../types';
import { DateStatusCard } from '../../shared/DateStatusCard';
import StatusIcon, { setStatusDirectly } from '../../shared/StatusIcon';

// --- モバイル専用: メインコンポーネント ---
export default function MobileTable({
  allDateTimes,
  allResponses,
  bestKeys,
  isClosed,
  confirmedDateTime,
  voterName,
  setVoterName,
  myAvailability,
  toggleAvailability,
  isSubmitted,
  isEditing,
  showInputForm,
  setShowInputForm,
  respondentId,
  handleEdit,
  handleCancelEdit,
  handleSubmit,
  handleStartEdit,
  showEditMode,
}: ScheduleTableProps & {
  handleStartEdit: (callback: () => void) => void;
  showEditMode: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (voterName.trim()) {
      setError(null);
    }
  }, [voterName]);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)');
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  const selectedDateTime = allDateTimes[selectedIndex];
  const selectedKey = selectedDateTime?.key;
  const showOverlay = (showInputForm || isEditing) && isMobile;

  return (
    <>
      {/* モバイル: 編集ダイアログ */}
      <FadeDialog
        open={showOverlay}
        onOpenChange={(open) => !open && handleCancelEdit()}
        header={
          <DialogHeader className="py-1">
            <DialogTitle className="text-center font-bold text-slate-900 text-xl">
              出欠を入力
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              各日程の出欠状況を選択してください
            </DialogDescription>
          </DialogHeader>
        }
        contents={
          <div className="">
            <div style={{ marginBottom: getResponsiveValue(20, 24, 320, 900, true) }}>
              <FloatingLabelInput
                id="voterName"
                label="名前"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                error={!!error}
                helperText={error || undefined}
              />
            </div>

            <div
              className="flex justify-center border-[#e5e7eb] border-t border-b"
              style={{
                marginBottom: getResponsiveValue(20, 24, 320, 900, true),
                paddingTop: getResponsiveValue(20, 24, 320, 900, true),
                paddingBottom: getResponsiveValue(20, 24, 320, 900, true),
                gap: getResponsiveValue(16, 20, 320, 900, true),
              }}
            >
              {(['available', 'maybe', 'unavailable'] as const).map((statusOption) => {
                const currentStatus = myAvailability[selectedKey];
                const isCurrentStatus = currentStatus === statusOption;
                return (
                  <div
                    key={statusOption}
                    onClick={() => {
                      if (!isCurrentStatus) {
                        setStatusDirectly(currentStatus, statusOption, () =>
                          toggleAvailability(selectedKey)
                        );
                      }
                    }}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-full border-2 p-4 transition-all duration-200 ${
                      isCurrentStatus
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-transparent bg-transparent hover:bg-blue-50/50'
                    }`}
                  >
                    <StatusIcon status={statusOption} size={24} />
                  </div>
                );
              })}
            </div>

            <div
              className="flex flex-wrap"
              style={{
                gap: getResponsiveValue(12, 16),
              }}
            >
              {allDateTimes.map(({ date, key, time }, idx) => {
                const myStatus = myAvailability[key] ?? 'unavailable';
                const colorClasses = {
                  available: 'bg-green-500',
                  maybe: 'bg-orange-500',
                  unavailable: 'bg-red-500',
                };
                const isSelected = idx === selectedIndex;
                const borderClasses = {
                  available: 'border-green-500',
                  maybe: 'border-orange-500',
                  unavailable: 'border-red-500',
                };
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative flex h-9 items-center justify-center gap-1 rounded-[1px] border-2 px-3 font-medium text-white transition-all duration-200 hover:opacity-90 ${colorClasses[myStatus]} ${
                      isSelected
                        ? 'z-10 scale-105 border-blue-600 font-bold shadow-lg'
                        : borderClasses[myStatus]
                    }`}
                  >
                    <span className="whitespace-nowrap text-[11px]">
                      <FormattedDate date={date} />
                    </span>
                    {time && <span className="text-[11px] opacity-90">{time}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        }
        footer={
          <div
            className="flex border-border border-t"
            style={{
              paddingTop: getResponsiveValue(20, 24, 320, 900, true),
              gap: getResponsiveValue(20, 24, 320, 900, true),
            }}
          >
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className="h-[48px] flex-1 rounded-[2px] border-[#1976d2]/50 px-4 font-medium text-[#1976d2] text-[13px] uppercase tracking-wide hover:border-[#1976d2] hover:bg-[#1976d2]/[0.04]"
            >
              キャンセル
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (!voterName.trim()) {
                  setError('名前を入力してください');
                  return;
                }
                handleSubmit();
              }}
              className="h-[48px] flex-1 rounded-[2px] bg-[#1976d2] px-4 font-medium text-[13px] text-white uppercase tracking-wide shadow-md hover:bg-[#1565c0]"
            >
              {isEditing ? '更新' : '送信'}
            </Button>
          </div>
        }
      />

      {/* モバイル: 日付タブ */}
      <DateScrollList
        allDateTimes={allDateTimes}
        allResponses={allResponses}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        bestKeys={bestKeys}
        confirmedDateTime={confirmedDateTime}
      />

      {/* モバイル: レスポンスリスト */}
      {selectedDateTime && (
        <div>
          {allResponses.map((response, index) => {
            const isMyResponse = response.respondentId === respondentId;
            return (
              <div
                key={`${response.name}-${index}`}
                className="flex items-center justify-between border-[#f0f0f0] border-b last:border-b-0"
                style={{ padding: 20 }}
              >
                <div
                  onClick={isMyResponse ? () => handleEdit() : undefined}
                  className={`${isMyResponse ? 'cursor-pointer font-bold text-[13px] text-blue-600 hover:opacity-70' : 'font-bold text-[13px] text-slate-900'} flex items-center gap-1`}
                >
                  {response.name}
                  {isMyResponse && <span className="ml-1 text-[10px] text-blue-600">(Me)</span>}
                </div>
                <StatusIcon status={response.availability[selectedKey]} size={24} />
              </div>
            );
          })}
        </div>
      )}

      {/* モバイル: フッターアクションボタン（編集モードでない時） */}
      {!isClosed && !showEditMode && (
        <div
          className={`${allResponses.length === 0 ? '' : 'border-gray-200 border-t'}`}
          style={{ padding: getResponsiveValue(20, 24) }}
        >
          <div className="flex h-13 items-center justify-between gap-4">
            <Button
              variant="default"
              size="lg"
              onClick={() =>
                handleStartEdit(isSubmitted ? handleEdit : () => setShowInputForm(true))
              }
              className="h-full w-full gap-2 rounded-[2px] text-sm"
            >
              {isSubmitted ? <Edit2 size={18} /> : <Plus size={18} />}
              {isSubmitted ? '出欠を編集' : '出欠を入力'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// --- モバイル専用: 日付スクロールリスト ---
const DateScrollList = ({
  allDateTimes,
  allResponses,
  selectedIndex,
  setSelectedIndex,
  bestKeys,
  confirmedDateTime,
}: {
  allDateTimes: ScheduleTableProps['allDateTimes'];
  allResponses: ScheduleTableProps['allResponses'];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  bestKeys: Set<string>;
  confirmedDateTime: string | null;
}) => (
  <div
    className="scrollbar-none flex overflow-x-auto"
    style={{
      scrollbarWidth: 'none',
    }}
  >
    {allDateTimes.map(({ date, time, key }, index) => {
      const tabSummary = calculateSummary(key, allResponses);
      const tabScore = calculateScore(tabSummary.available, tabSummary.maybe);
      const isTabBest = bestKeys.has(key);
      const isTabConfirmed = confirmedDateTime === key;
      const isSelected = index === selectedIndex;

      return (
        <DateStatusCard
          key={key}
          date={date}
          time={time}
          score={tabScore}
          total={allResponses.length}
          isConfirmed={isTabConfirmed}
          isBest={isTabBest}
          isSelected={isSelected}
          onClick={() => setSelectedIndex(index)}
          className={`border-b ${isSelected ? 'border-b-blue-500' : 'border-b-slate-200'} ${index === allDateTimes.length - 1 ? '' : 'border-slate-200 border-r'}`}
        />
      );
    })}
  </div>
);
