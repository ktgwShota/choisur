'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/shared/primitives/alert';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/shared/primitives/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/primitives/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shared/primitives/tooltip';
import type { ScheduleFormData } from '@/db/validation/types';
import { getResponsiveValue } from '@/utils/styles';
// Imports
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';

interface CandidateDatesFieldProps {
  control: Control<ScheduleFormData>;
}

export default function CandidateDatesField({ control }: CandidateDatesFieldProps) {
  const dates = useWatch({ control, name: 'dates' });
  const hasDates = dates && dates.length > 0;
  const [activeTab, setActiveTab] = useState('calendar');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleTabChange = (value: string) => {
    if (value === 'time' && !hasDates) {
      setShowTooltip(true);
      // 数秒後に自動で閉じる
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    setActiveTab(value);
  };

  return (
    <div style={{ marginBottom: getResponsiveValue(20, 24) }}>
      <FormField
        control={control}
        name="dates"
        render={() => (
          <FormItem className="gap-0">
            <FormLabel
              className="mb-4 block font-bold text-slate-900"
              style={{ fontSize: getResponsiveValue(15, 16) }}
            >
              日程候補 <span className="text-red-500">*</span>
            </FormLabel>

            <Alert className="mb-5 rounded-[2px] border-blue-200 bg-blue-50 px-4 py-4 text-blue-900 sm:mb-6">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription style={{ fontSize: getResponsiveValue(13, 14) }}>
                カレンダーの日付をクリックすると選択 / ダブルクリックで解除できます。
              </AlertDescription>
            </Alert>

            <FormControl>
              <div>
                {/* PC */}
                <div className="hidden items-stretch gap-5 sm:grid sm:grid-cols-[1fr_40%] sm:gap-6">
                  <DateSelector />
                  <TimeSelector />
                </div>

                {/* Mobile */}
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full sm:hidden"
                >
                  <TabsList className="flex h-auto w-full gap-0 bg-transparent p-0">
                    <div className="flex-1">
                      <TabsTrigger
                        value="calendar"
                        className="relative z-10 flex h-12 w-full items-center justify-center gap-2 rounded-none bg-slate-200 pr-[20px] text-slate-600 shadow-none transition-colors duration-200 [clip-path:polygon(0_0,calc(100%-20px)_0,100%_50%,calc(100%-20px)_100%,0_100%)] data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
                      >
                        <span className="font-bold text-[13px]">日付</span>
                      </TabsTrigger>
                    </div>

                    {hasDates ? (
                      <div className="relative -ml-[20px] flex-1">
                        <TabsTrigger
                          value="time"
                          className="flex h-12 w-full items-center justify-center gap-2 rounded-none bg-slate-200 pl-[20px] text-slate-600 shadow-none transition-colors duration-200 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,20px_50%)] data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-none"
                        >
                          <span className="font-bold text-[13px]">時間</span>
                        </TabsTrigger>
                      </div>
                    ) : (
                      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
                        <TooltipTrigger asChild>
                          <div className="relative -ml-[20px] flex-1">
                            {/* divでラップしてTooltipTriggerイベントを確実に捕捉させる */}
                            <TabsTrigger
                              value="time"
                              // 日付未選択時は見た目を無効化風にするが、クリックイベントを受け取るためにpointer-events-noneにはしない
                              className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-none bg-slate-100 pl-[20px] text-slate-400 shadow-none transition-colors duration-200 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,20px_50%)] data-[state=active]:shadow-none"
                            >
                              <span className="font-bold text-[13px]">時間</span>
                            </TabsTrigger>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          className="z-50 rounded-[2px] border-0 bg-gray-800 p-3 text-white"
                          side="top"
                          sideOffset={-10} // 少し近づける
                        >
                          <p className="text-xs">日付を選択すると利用可能になります</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TabsList>
                  <TabsContent value="calendar" className="mt-0 focus-visible:outline-none">
                    <DateSelector />
                  </TabsContent>
                  <TabsContent value="time" className="mt-0 focus-visible:outline-none">
                    <TimeSelector />
                  </TabsContent>
                </Tabs>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
