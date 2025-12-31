'use client';

import { useRef, useState } from 'react';
import { scheduleResponseSchema } from '@/db/validation/schedule';
import type { ScheduleTableProps } from '../../../types';
import MobileTable from './Mobile';
import DesktopTable from './Pc';

export default function Table({
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
}: ScheduleTableProps) {
  const showEditMode = showInputForm || isEditing;
  const rootRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProxySubmit = () => {
    const result = scheduleResponseSchema.safeParse({ name: voterName });
    if (!result.success) {
      const error = result.error.flatten().fieldErrors.name?.[0];
      setErrorMessage(error || '名前を入力してください');
      return;
    }
    handleSubmit();
  };

  const handleNameChange = (name: string) => {
    setVoterName(name);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleProxyCancel = () => {
    setErrorMessage(null);
    handleCancelEdit();
  };

  const handleStartEdit = (callback: () => void) => {
    // PC用: スクロール処理
    const element = rootRef.current;
    if (!element) {
      callback();
      return;
    }
    const rect = element.getBoundingClientRect();
    const targetTop = window.innerHeight / 2 - 100;
    const currentTop = rect.top;
    if (Math.abs(currentTop - targetTop) < 50) {
      callback();
      return;
    }
    const scrollY = window.scrollY + currentTop - targetTop;
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
    setTimeout(callback, 500);
  };

  const commonProps = {
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
  };

  return (
    <div ref={rootRef} className="relative">
      {/* PC専用セクション (640px以上で表示) */}
      <div className="hidden sm:block">
        <DesktopTable
          {...commonProps}
          handleNameChange={handleNameChange}
          handleProxyCancel={handleProxyCancel}
          handleProxySubmit={handleProxySubmit}
          errorMessage={errorMessage}
        />
      </div>

      {/* モバイル専用セクション (640px未満で表示) */}
      <div className="block sm:hidden">
        <MobileTable {...commonProps} />
      </div>
    </div>
  );
}
