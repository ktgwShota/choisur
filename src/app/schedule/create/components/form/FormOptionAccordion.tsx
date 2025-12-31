'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { ChevronDown, Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import DateTimePicker from '@/components/shared/forms/DateTimePicker';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/shared/primitives/form';
import { getResponsiveValue } from '@/utils/styles';

dayjs.locale('ja');

export default function FormOptionAccordion() {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<any>();

  const [dateLimits, setDateLimits] = useState<{
    todayDate: string;
    maxEndDate: string;
    currentTimeString: string;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    const max = oneMonthLater.toISOString().split('T')[0];

    setDateLimits({
      todayDate: today,
      currentTimeString: time,
      maxEndDate: max,
    });
  }, []);

  const endDate = watch('endDate');
  const endTime = watch('endTime');

  const currentDateTime = endDate && endTime ? dayjs(`${endDate}T${endTime}`) : null;
  const minDateTime = dateLimits
    ? dayjs(`${dateLimits.todayDate}T${dateLimits.currentTimeString}`)
    : undefined;
  const maxDateTime = dateLimits ? dayjs(`${dateLimits.maxEndDate}T23:59`) : undefined;

  const handleClear = () => {
    setValue('endDate', '', { shouldValidate: true });
    setValue('endTime', '', { shouldValidate: true });
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="data-[state=open]: overflow-hidden rounded-[2px] border border-border bg-white transition-all duration-300"
    >
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="group flex w-full items-center justify-between px-4 py-5 font-bold text-slate-900 transition-all hover:bg-slate-50/80 data-[state=open]:bg-slate-50/50 [&[data-state=open]>svg:last-child]:rotate-180">
          <div className="flex items-center gap-3">
            <Settings2 className="h-4.5 w-4.5 text-slate-400 transition-colors group-hover:text-slate-600 group-data-[state=open]:text-blue-600" />
            <span style={{ fontSize: getResponsiveValue(14, 15) }}>オプション</span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-300" />
        </AccordionTrigger>
        <AccordionContent className="border-border border-t bg-white p-6">
          <div className="space-y-6">
            <div>
              <FormLabel
                className="mb-2 flex items-center gap-2 font-bold text-slate-800"
                style={{ fontSize: getResponsiveValue(14, 15) }}
              >
                自動公開
              </FormLabel>

              <p className="mb-4 max-w-xl text-slate-500 text-sm leading-relaxed">
                設定した日時に回答を集計して結果を公開します。
              </p>

              <div className="relative w-full max-w-[200px]">
                <FormField
                  control={control}
                  name="endDate"
                  render={() => (
                    <FormField
                      control={control}
                      name="endTime"
                      render={() => (
                        <FormItem className="w-full space-y-1">
                          <FormControl>
                            <DateTimePicker
                              value={currentDateTime}
                              onChange={(val) => {
                                if (val) {
                                  setValue('endDate', val.format('YYYY-MM-DD'), {
                                    shouldValidate: true,
                                  });
                                  setValue('endTime', val.format('HH:mm'), {
                                    shouldValidate: true,
                                  });
                                } else {
                                  handleClear();
                                }
                              }}
                              onClear={handleClear}
                              minDateTime={minDateTime}
                              maxDate={maxDateTime}
                              label="日時設定なし"
                              error={!!(errors.endDate || errors.endTime)}
                            />
                          </FormControl>
                          {(errors.endDate?.message || errors.endTime?.message) && (
                            <p className="font-medium text-red-500 text-xs">
                              {String(errors.endDate?.message || errors.endTime?.message || '')}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
