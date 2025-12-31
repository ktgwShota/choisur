import { Trash2 } from 'lucide-react';
import type { Control } from 'react-hook-form';
import FormInputField from '@/components/shared/forms/FormInputField';
import type { PollFormData, PollOptionFormData } from '@/db/validation/types';
import { cn, getResponsiveValue } from '@/utils/styles';

export function OptionInput({
  option,
  index,
  urlError,
  canRemove,
  onOptionChange,
  onRemove,
  control,
}: {
  option: PollOptionFormData;
  index: number;
  urlError?: string;
  canRemove: boolean;
  onOptionChange: (updates: Partial<PollOptionFormData>) => void;
  onRemove: () => void;
  control: Control<PollFormData>;
}) {
  return (
    <div
      className={cn(
        'group rounded-[2px] border border-slate-200 bg-white transition-all duration-300',
        urlError && 'border-red-500 bg-red-50/10'
      )}
      style={{ marginBottom: getResponsiveValue(20, 24), padding: getResponsiveValue(20, 24) }}
    >
      {/* Card Header - Enhanced Design */}
      <div
        className="flex items-start justify-between"
        style={{ marginBottom: getResponsiveValue(20, 24) }}
      >
        <div className="flex items-baseline gap-2">
          <span className="select-none font-black text-3xl text-blue-600/10 italic leading-none tracking-tighter">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="group/remove flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition-all duration-200 hover:bg-red-100 hover:text-red-600 active:scale-90"
            title="削除"
          >
            <Trash2
              size={15}
              strokeWidth={2.5}
              className="transition-transform group-hover/remove:rotate-12"
            />
          </button>
        )}
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 sm:gap-[var(--responsive-gap)]"
        style={{ '--responsive-gap': getResponsiveValue(20, 24) } as React.CSSProperties}
      >
        <FormInputField
          name={`options.${index}.title`}
          label="店名"
          placeholder="レストラン A"
          required
          showCharCount
          behavior="notched"
          style={{ marginBottom: getResponsiveValue(20, 24) }}
        />
        <FormInputField
          name={`options.${index}.url`}
          label="URL"
          placeholder="https://tabelog.com/..."
          behavior="notched"
          style={{ marginBottom: getResponsiveValue(20, 24) }}
        />
      </div>

      <FormInputField
        name={`options.${index}.description`}
        label="備考"
        placeholder="会社から徒歩10分 / 個室あり / 駐車場なし"
        maxLength={50}
        showCharCount
        behavior="notched"
      />
    </div>
  );
}
