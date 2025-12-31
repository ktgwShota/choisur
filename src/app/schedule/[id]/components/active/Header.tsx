'use client';

import { CalendarCheck2, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';
import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import AdvancedPageTitle from '@/components/shared/headings/AdvancedPageTitle';
import OrganizerMenu, { OrganizerMenuItem } from '@/components/shared/others/OrganizerMenu';
// import { CountdownTimer } from '@/components/data-display/CountdownTimer'; // TODO: 残り時間を表示するデザインを考えて追加する
import SocialShareButtons from '@/components/shared/others/SocialShareButtons';
import { Button } from '@/components/shared/primitives/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/primitives/dialog';
import { Separator } from '@/components/shared/primitives/separator';
import type { Schedule } from '@/db/core/types';
import { getResponsiveValue } from '@/utils/styles';
import { useActions } from '../../hooks/useActions';
import { useData } from '../../hooks/useData';
import { calculateSummary, type ScheduleData } from '../../types';
import StatusIcon from '../shared/StatusIcon';

interface HeaderProps {
  schedule: Schedule;
}

export default function Header({ schedule }: HeaderProps) {
  const scheduleData = {
    ...schedule,
    responses: schedule.responses ?? [],
  };

  const actionsHook = useActions({
    scheduleId: scheduleData.id,
  });

  // シェア用のURLを生成
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${scheduleData.title}の日程調整`;

  return (
    <>
      <AdvancedPageTitle
        label="Event Information"
        title={scheduleData.title}
        status={<SocialShareButtons shareUrl={shareUrl} shareText={shareText} />}
        actions={
          <OrganizerMenu
            open={actionsHook.isMenuOpen}
            onOpenChange={actionsHook.handleMenuOpenChange}
          >
            <OrganizerMenuItem
              icon={<CalendarCheck2 size={18} />}
              title="日程を決定"
              onClick={actionsHook.handleCloseClick}
            />
            <Separator className="my-2.5 bg-slate-100" />
            <OrganizerMenuItem
              icon={<Trash2 size={18} />}
              title="ページを削除"
              variant="danger"
              onClick={actionsHook.handleDeleteClick}
            />
          </OrganizerMenu>
        }
      />
      <Dialogs
        scheduleData={{
          ...scheduleData,
          isClosed: !!scheduleData.isClosed,
        }}
        actionsHook={actionsHook}
      />
    </>
  );
}

interface ActionsHook {
  deleteDialogOpen: boolean;
  closeDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  setCloseDialogOpen: (open: boolean) => void;
  handleDeleteConfirm: () => void;
  handleCloseConfirm: (confirmedDateTime: string) => void;
  isMenuOpen: boolean;
  handleMenuOpenChange: (open: boolean) => void;
  handleCloseClick: () => void;
  handleDeleteClick: () => void;
}

interface DialogsProps {
  scheduleData: ScheduleData;
  actionsHook: ActionsHook;
}

function Dialogs({ scheduleData, actionsHook }: DialogsProps) {
  const { allDateTimes, bestKeys } = useData({
    dates: scheduleData.dates,
    responses: scheduleData.responses,
  });

  const [selectedDateTime, setSelectedDateTime] = useState<string>('');

  const handleCloseConfirm = () => {
    if (selectedDateTime) {
      actionsHook.handleCloseConfirm(selectedDateTime);
      setSelectedDateTime('');
    }
  };

  const handleCloseCancel = () => {
    setSelectedDateTime('');
    actionsHook.setCloseDialogOpen(false);
  };

  return (
    <>
      <FadeDialog
        maxWidth="400px"
        open={actionsHook.deleteDialogOpen}
        onOpenChange={(open) => actionsHook.setDeleteDialogOpen(open)}
        header={
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-slate-900 text-xl">
              ページを削除
            </DialogTitle>
            <DialogDescription className="text-center font-medium text-red-600 text-sm">
              この操作は取り消せません
            </DialogDescription>
          </DialogHeader>
        }
        footer={
          <DialogFooter
            className="!justify-center flex flex-row border-border border-t"
            style={{
              paddingTop: getResponsiveValue(20, 24, 320, 900, true),
              gap: getResponsiveValue(20, 24, 320, 900, true),
            }}
          >
            <Button
              variant="outline"
              onClick={() => actionsHook.setDeleteDialogOpen(false)}
              className="h-auto w-[110px] rounded-[2px] border-slate-200 py-3 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={actionsHook.handleDeleteConfirm}
              className="h-auto w-[100px] rounded-[2px] bg-red-600 py-3 text-white hover:bg-red-700"
            >
              削除
            </Button>
          </DialogFooter>
        }
      />

      <FadeDialog
        open={actionsHook.closeDialogOpen}
        onOpenChange={(open) => !open && handleCloseCancel()}
        header={
          <DialogHeader className="py-1">
            <DialogTitle className="text-center font-bold text-slate-900 text-xl">
              日程を決定
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              候補の中から選択してください
            </DialogDescription>
          </DialogHeader>
        }
        contents={
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[...allDateTimes]
              .sort((a, b) => {
                const isBestA = bestKeys.has(a.key);
                const isBestB = bestKeys.has(b.key);
                if (isBestA && !isBestB) return -1;
                if (!isBestA && isBestB) return 1;
                return a.date.unix() - b.date.unix();
              })
              .map(({ date, time, key }) => {
                const summary = calculateSummary(key, scheduleData.responses);
                const isBest = bestKeys.has(key);
                const isSelected = selectedDateTime === key;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedDateTime(key)}
                    className={`group relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-[2px] border px-4 py-5 transition-all duration-200 ease-out ${
                      isSelected
                        ? 'border-[#1976d2] bg-[#f0f7ff] ring-1 ring-[#1976d2]/10'
                        : isBest
                          ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300 hover:bg-emerald-50/60'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Left: Radio & Date */}
                    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          isSelected
                            ? 'border-[#1976d2] bg-[#1976d2]'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
                      </div>

                      <div className="flex min-w-0 flex-col">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span
                            className={`whitespace-nowrap font-bold text-sm tracking-tight ${
                              isSelected ? 'text-[#1976d2]' : 'text-slate-800'
                            }`}
                          >
                            {date.format('MM/DD')}
                          </span>
                          <span
                            className={`whitespace-nowrap text-[13px] ${
                              isSelected ? 'text-[#1976d2]/80' : 'text-slate-500'
                            }`}
                          >
                            ({date.format('ddd')})
                          </span>
                          {time && (
                            <span
                              className={`whitespace-nowrap font-bold text-[13px] text-slate-700 ${
                                isSelected ? 'text-[#1976d2]/90' : 'text-slate-700'
                              }`}
                            >
                              {time}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Score/Status */}
                    <div className="flex shrink-0 flex-col items-end justify-center">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-slate-700">
                          <StatusIcon status="available" size={14} />
                          <span className="font-bold text-[13px]">{summary.available}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <StatusIcon status="maybe" size={14} />
                          <span className="font-bold text-[13px]">{summary.maybe}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <StatusIcon status="unavailable" size={14} />
                          <span className="font-bold text-[13px]">{summary.unavailable}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        }
        footer={
          <DialogFooter
            className="!justify-center flex flex-row border-border border-t"
            style={{
              paddingTop: getResponsiveValue(20, 24, 320, 900, true),
              gap: getResponsiveValue(20, 24, 320, 900, true),
            }}
          >
            <Button
              variant="outline"
              onClick={handleCloseCancel}
              className="h-auto w-[110px] rounded-[2px] border-[#1976d2]/30 py-3 text-[#1976d2] hover:border-[#1976d2] hover:bg-[#1976d2]/5"
            >
              キャンセル
            </Button>
            <Button
              variant="default"
              onClick={handleCloseConfirm}
              className="h-auto w-[100px] rounded-[2px] bg-[#1976d2] py-3 text-white hover:bg-[#1565c0]"
            >
              決定
            </Button>
          </DialogFooter>
        }
      ></FadeDialog>
    </>
  );
}
