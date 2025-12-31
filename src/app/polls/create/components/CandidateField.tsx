'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '@/components/shared/primitives/form';
import type { PollFormData, PollOptionFormData } from '@/db/validation/types';
import { getResponsiveValue } from '@/utils/styles';
import { OptionInput } from './OptionInput';

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

export default function CandidateField() {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PollFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const watchedOptions = watch('options');

  // 内部状態としてPollOptionFormDataを管理（OGP取得などのロジック用）
  const [pollOptions, setPollOptions] = useState<PollOptionFormData[]>([
    { url: '', title: '' },
    { url: '', title: '' },
  ]);

  // react-hook-formの値と内部状態を同期
  useEffect(() => {
    const formOptions = watchedOptions || [];
    setPollOptions(
      formOptions.map((formOption) => ({
        url: formOption.url || '',
        title: formOption.title || '',
        description: formOption.description || '',
      }))
    );
  }, [watchedOptions]);

  const handleAddOption = () => {
    if (fields.length < MAX_OPTIONS) {
      append({
        url: '',
        title: '',
        description: '',
      });
      setPollOptions([
        ...pollOptions,
        {
          url: '',
          title: '',
          description: '',
        },
      ]);
    }
  };

  const updateOption = (index: number, updates: Partial<PollOptionFormData>) => {
    const option = pollOptions[index];
    if (option) {
      const updatedOption = { ...option, ...updates };
      setPollOptions(
        pollOptions.map((opt: PollOptionFormData, i: number) => (i === index ? updatedOption : opt))
      );
      // react-hook-formの値も更新
      if (updates.url !== undefined) {
        setValue(`options.${index}.url`, updates.url);
      }
      if (updates.title !== undefined) {
        setValue(`options.${index}.title`, updates.title);
      }
      if (updates.description !== undefined) {
        setValue(`options.${index}.description`, updates.description || '');
      }
    }
  };

  const handleRemoveOption = (index: number) => {
    if (fields.length > MIN_OPTIONS) {
      remove(index);
      setPollOptions(pollOptions.filter((_: PollOptionFormData, i: number) => i !== index));
    }
  };

  return (
    <FormField
      control={control}
      name="options"
      render={() => (
        <FormItem className="relative gap-0">
          <div style={{ marginBottom: getResponsiveValue(20, 24) }}>
            <FormLabel
              className="mb-4 block font-bold text-slate-900"
              style={{ fontSize: getResponsiveValue(15, 16) }}
            >
              候補リスト <span className="text-red-500">*</span>
            </FormLabel>
            <p className="text-[0.875rem] text-muted-foreground">
              候補となる店舗の情報を入力してください
            </p>
          </div>

          {fields.map((field, index) => {
            const option = pollOptions[index];
            const optionErrors = errors.options?.[index];
            return (
              <OptionInput
                key={field.id}
                option={option || { url: '', title: '' }}
                index={index}
                urlError={optionErrors?.url?.message}
                canRemove={fields.length > MIN_OPTIONS}
                onOptionChange={(updates) => updateOption(index, updates)}
                onRemove={() => handleRemoveOption(index)}
                control={control}
              />
            );
          })}

          {fields.length < MAX_OPTIONS && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddOption();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddOption();
                }
              }}
              className="group hover: pointer-events-auto relative z-10 mb-6 flex h-[90px] cursor-pointer items-center justify-center gap-3 rounded-[4px] border border-slate-200 border-dashed bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:translate-y-0"
            >
              <Plus
                size={28}
                className="text-blue-600 transition-transform duration-500 ease-out group-hover:rotate-90"
              />
              <p className="pointer-events-none m-0 font-bold text-[15px] text-blue-600">
                候補を追加
              </p>
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
