'use client';

import { Info, Pencil, Plus, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/shared/primitives/alert';
import { Button } from '@/components/shared/primitives/button';
import { Input } from '@/components/shared/primitives/input';
import { getResponsiveValue } from '@/utils/styles';
import type { ScheduleTableProps } from '../../../types';
import { calculateScore, calculateSummary, type DateTimeItem, type Response } from '../../../types';
import { DateStatusCard } from '../../shared/DateStatusCard';
import StatusIcon from '../../shared/StatusIcon';

// --- PC専用: テーブルヘッダー ---
interface TableHeaderProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
  bestKeys?: Set<string>;
  confirmedLabel?: string;
  hasNameColumn?: boolean;
}

// --- PC専用: メインコンポーネント ---
export default function DesktopTable({
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
  handleNameChange,
  handleProxyCancel,
  handleProxySubmit,
  errorMessage,
  showEditMode,
}: ScheduleTableProps & {
  handleStartEdit: (callback: () => void) => void;
  handleNameChange: (name: string) => void;
  handleProxyCancel: () => void;
  handleProxySubmit: () => void;
  errorMessage: string | null;
  showEditMode: boolean;
}) {
  return (
    <>
      {/* PC: テーブル表示 */}
      <DesktopResponseList
        allDateTimes={allDateTimes}
        allResponses={allResponses}
        bestKeys={bestKeys}
        confirmedDateTime={confirmedDateTime}
        respondentId={respondentId}
        isEditing={isEditing}
        showInputForm={showInputForm}
        handleEdit={() => handleStartEdit(handleEdit)}
        renderInputRow={
          <DesktopInputRow
            allDateTimes={allDateTimes}
            voterName={voterName}
            setVoterName={handleNameChange}
            myAvailability={myAvailability}
            toggleAvailability={toggleAvailability}
          />
        }
        renderActionButtons={(isLastRow) =>
          showEditMode ? (
            <DesktopEditActions
              isEditing={isEditing}
              voterName={voterName}
              handleCancelEdit={handleProxyCancel}
              handleSubmit={handleProxySubmit}
              isLastRow={isLastRow}
              errorMessage={errorMessage}
            />
          ) : null
        }
      />

      {/* PC: フッターアクションボタン（編集モードでない時） */}
      {!isClosed && !showEditMode && (
        <DesktopActionLayout hasBorderTop={allResponses.length > 0}>
          <Button
            onClick={() => handleStartEdit(isSubmitted ? handleEdit : () => setShowInputForm(true))}
            className="h-auto w-full gap-2 rounded-[2px] bg-[#1976d2] px-5 py-4 font-medium text-sm text-white uppercase tracking-wide shadow-md hover:bg-[#1565c0]"
          >
            {isSubmitted ? <Pencil size={18} /> : <Plus size={18} />}
            {isSubmitted ? '出欠を編集' : '出欠を入力'}
          </Button>
        </DesktopActionLayout>
      )}
    </>
  );
}

export function TableHeader({
  allDateTimes,
  responses,
  confirmedDateTime,
  bestKeys,
  hasNameColumn = true,
}: TableHeaderProps) {
  return (
    <div className="relative z-10 flex border-slate-200 border-b">
      {/* 左端の固定列（名前用） */}
      {hasNameColumn && (
        <div className="relative sticky left-0 z-20 w-[150px] min-w-[150px] max-w-[150px] shrink-0 border-slate-200 border-r bg-white">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#e2e8f0" strokeWidth="1" />
          </svg>
          <div className="absolute top-2 right-2 flex items-center gap-1.5 text-slate-500">
            <span className="font-medium text-[11px] leading-none">候補日</span>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-slate-500">
            <span className="font-medium text-[11px] leading-none">回答者</span>
          </div>
        </div>
      )}

      {/* 日時列 */}
      {allDateTimes.map(({ date, time, key }, index) => {
        const summary = calculateSummary(key, responses);
        const score = calculateScore(summary.available, summary.maybe);
        const isConfirmed = confirmedDateTime === key;
        const isDismissed = !!confirmedDateTime && !isConfirmed;
        const isBest = bestKeys?.has(key) ?? false;
        const isLast = index === allDateTimes.length - 1;

        return (
          <DateStatusCard
            key={key}
            date={date}
            time={time}
            score={score}
            total={responses.length}
            isConfirmed={isConfirmed}
            isDismissed={isDismissed}
            isBest={isBest}
            className={`w-[130px] min-w-[130px] max-w-[130px] flex-none ${isLast ? '' : 'border-slate-200 border-r'}`}
          />
        );
      })}
    </div>
  );
}

// --- PC専用: テーブル行 ---
interface TableRowProps {
  response: Response;
  allDateTimes: DateTimeItem[];
  bestKeys?: Set<string>;
  confirmedDateTime?: string | null;
  isMyResponse?: boolean;
  showMyBadge?: boolean;
  onEdit?: () => void;
  isLast?: boolean;
}

export function TableRow({
  response,
  allDateTimes,
  bestKeys,
  confirmedDateTime,
  isMyResponse = false,
  showMyBadge = false,
  onEdit,
  isLast = false,
}: TableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`relative z-10 flex items-stretch border-slate-200 ${isLast ? '' : 'border-b'}`}
    >
      {/* 名前列（固定） */}
      <div
        className={`sticky left-0 z-[1] flex w-[150px] min-w-[150px] max-w-[150px] shrink-0 items-center justify-center border-slate-200 border-r bg-white p-5`}
      >
        {showMyBadge ? (
          <div
            onClick={isMyResponse && onEdit ? onEdit : undefined}
            className={`flex max-w-full items-center text-left ${isMyResponse && onEdit ? 'cursor-pointer hover:opacity-70' : 'cursor-default'}`}
          >
            {response.name.length > 9 && !isExpanded ? (
              <span
                className={`font-bold text-[12px] ${isMyResponse ? 'text-blue-600' : 'text-slate-900'}`}
              >
                {response.name.slice(0, 9)}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                >
                  ...
                </span>
              </span>
            ) : (
              <span
                onClick={(e) => {
                  if (isExpanded) {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }
                }}
                className={`flex-1 font-bold text-[13px] ${isMyResponse ? 'text-blue-600' : 'text-slate-900'} ${isExpanded ? 'cursor-pointer whitespace-normal break-words' : 'truncate'}`}
              >
                {response.name}
              </span>
            )}
            {isMyResponse && <span className="ml-1 shrink-0 text-[10px] text-blue-600">(Me)</span>}
          </div>
        ) : (
          <div className="max-w-full text-left">
            {response.name.length > 9 && !isExpanded ? (
              <span className="font-bold text-slate-900 text-xs">
                {response.name.slice(0, 9)}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                >
                  ...
                </span>
              </span>
            ) : (
              <span
                onClick={(e) => {
                  if (isExpanded) {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }
                }}
                className={`font-bold text-slate-900 text-xs ${isExpanded ? 'cursor-pointer whitespace-normal break-words' : 'block truncate'}`}
              >
                {response.name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ステータスセル */}
      {allDateTimes.map(({ key }) => {
        const status = response.availability[key];
        const _isBest = bestKeys?.has(key) ?? false;
        const isConfirmed = confirmedDateTime === key;
        const _isDismissed = !!confirmedDateTime && !isConfirmed;

        return (
          <div
            key={key}
            className={`relative flex w-[130px] min-w-[130px] max-w-[130px] flex-none items-center justify-center border-slate-200 border-r p-5 last:border-r-0 ${
              isConfirmed
                ? 'bg-gradient-to-br from-emerald-50/60 via-emerald-100/50 to-green-100/40'
                : ''
            }
            `}
          >
            <StatusIcon status={status} size={24} />
          </div>
        );
      })}
    </div>
  );
}

// --- PC専用: 入力行コンポーネント ---
const DesktopInputRow = ({
  allDateTimes,
  voterName,
  setVoterName,
  myAvailability,
  toggleAvailability,
}: {
  allDateTimes: ScheduleTableProps['allDateTimes'];
  voterName: string;
  setVoterName: (name: string) => void;
  myAvailability: ScheduleTableProps['myAvailability'];
  toggleAvailability: (key: string) => void;
}) => {
  return (
    <div className="-mt-[1px] flex w-max min-w-full border-blue-500 border-t border-b">
      {/* 名前入力カラム (左端に固定) */}
      <div className="sticky left-0 z-10 flex w-[150px] min-w-[150px] max-w-[150px] shrink-0 items-center justify-center border-slate-200 border-r bg-blue-50 p-5">
        <Input
          type="text"
          placeholder="名前"
          value={voterName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVoterName(e.target.value)}
          className="!text-[14px] h-auto w-full border-none bg-transparent px-0 py-0 text-center font-bold shadow-none outline-none ring-0 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* 日付選択カラム (スクロールと一緒に動く) */}
      <div className="flex">
        {allDateTimes.map(({ key }, _index) => (
          <div
            key={key}
            onClick={() => toggleAvailability(key)}
            className="flex w-[130px] min-w-[130px] max-w-[130px] flex-none cursor-pointer items-center justify-center border-slate-200 border-r bg-blue-50/20 p-5 transition-colors duration-150 last:border-r-0 hover:bg-blue-50/40"
          >
            <StatusIcon status={myAvailability[key]} size={24} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PC専用: 共通アクションレイアウト ---
const DesktopActionLayout = ({
  children,
  hasBorderTop = false,
  className = '',
}: {
  children: React.ReactNode;
  hasBorderTop?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`${hasBorderTop ? 'border-gray-200 border-t' : ''} ${className}`}
      style={{ padding: getResponsiveValue(20, 24) }}
    >
      <div
        className="flex items-center justify-between"
        style={{ gap: getResponsiveValue(20, 24) }}
      >
        {children}
      </div>
    </div>
  );
};

// --- PC専用: アクションボタンエリア ---
const DesktopEditActions = ({
  isEditing,
  voterName,
  handleCancelEdit,
  handleSubmit,
  isLastRow,
  errorMessage,
}: {
  isEditing: boolean;
  voterName: string;
  handleCancelEdit: () => void;
  handleSubmit: () => void;
  isLastRow: boolean;
  errorMessage: string | null;
}) => {
  return (
    <DesktopActionLayout
      className={`animate-[slideDown_0.3s_ease-out_forwards] ${isLastRow ? '' : 'border-gray-200 border-b'}`}
    >
      {errorMessage ? (
        <Alert className="flex h-full flex-1 items-center gap-3 rounded-[2px] border-red-100 bg-red-50/50 px-4 py-4 [&>svg]:static [&>svg]:translate-y-0">
          <TriangleAlert className="h-4 w-4 text-red-600" />
          <AlertDescription className="font-medium text-red-700 text-sm">
            {errorMessage}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="flex h-full flex-1 items-center gap-3 rounded-[2px] border-none bg-[#e3f2fd] px-4 py-4 [&>svg]:static [&>svg]:translate-y-0">
          <Info className="h-5 w-5 text-[#0288d1]" />
          <AlertDescription className="font-medium text-[#014361] text-[14px]">
            セル（枠）をクリックすると出欠を入力できます。
          </AlertDescription>
        </Alert>
      )}
      <div className="flex" style={{ gap: getResponsiveValue(20, 24) }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancelEdit}
          className="h-full rounded-[2px] border-[#1976d2]/50 px-4.5 py-3.5 font-medium text-[#1976d2] text-sm uppercase tracking-wide hover:border-[#1976d2] hover:bg-[#1976d2]/[0.04]"
        >
          キャンセル
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleSubmit}
          className="h-auto rounded-[2px] bg-[#1976d2] px-6 py-3.5 font-medium text-sm text-white uppercase tracking-wide shadow-md hover:bg-[#1565c0]"
        >
          {isEditing ? '更新' : '保存'}
        </Button>
      </div>
    </DesktopActionLayout>
  );
};

// --- PC専用: レスポンスリスト（テーブル形式） ---
const DesktopResponseList = ({
  allDateTimes,
  allResponses,
  bestKeys,
  confirmedDateTime,
  respondentId,
  isEditing,
  showInputForm,
  handleEdit,
  renderInputRow,
  renderActionButtons,
}: {
  allDateTimes: ScheduleTableProps['allDateTimes'];
  allResponses: ScheduleTableProps['allResponses'];
  bestKeys: Set<string>;
  confirmedDateTime: string | null;
  respondentId: string | null;
  isEditing: boolean;
  showInputForm: boolean;
  handleEdit: () => void;
  renderInputRow?: React.ReactNode;
  renderActionButtons?: (isLastRow: boolean) => React.ReactNode;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [stickyWidth, setStickyWidth] = useState<number | string>('100%');

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const updateWidth = () => {
      if (scrollContainerRef.current) {
        setStickyWidth(scrollContainerRef.current.clientWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(scrollContainerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scrollContainerRef} className="relative overflow-x-auto">
      <div className="w-max min-w-full">
        {/* Header */}
        <TableHeader
          allDateTimes={allDateTimes}
          responses={allResponses}
          confirmedDateTime={confirmedDateTime}
          bestKeys={bestKeys}
          confirmedLabel="確定"
        />

        {/* Responses Rows */}
        {allResponses.map((response, index) => {
          const isMyResponse = response.respondentId === respondentId;
          const isLastRow = index === allResponses.length - 1;
          const hasAdditionalRow = (isMyResponse && isEditing) || (showInputForm && !isEditing);
          const isLast = isLastRow && !hasAdditionalRow;

          if (isMyResponse && isEditing) {
            return (
              <div key="editing-row">
                {renderInputRow}
                {renderActionButtons && (
                  <div
                    className="sticky left-0 z-[15] bg-white"
                    style={{
                      width: stickyWidth,
                    }}
                  >
                    {renderActionButtons(isLastRow)}
                  </div>
                )}
              </div>
            );
          }

          return (
            <TableRow
              key={`${response.name}-${index}`}
              response={response}
              allDateTimes={allDateTimes}
              bestKeys={bestKeys}
              isMyResponse={isMyResponse}
              showMyBadge={true}
              onEdit={isMyResponse ? handleEdit : undefined}
              isLast={isLast}
            />
          );
        })}

        {showInputForm && !isEditing && (
          <div>
            {renderInputRow}
            {renderActionButtons && (
              <div
                className="sticky left-0 z-[15] bg-white"
                style={{
                  width: stickyWidth,
                }}
              >
                {renderActionButtons(true)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
