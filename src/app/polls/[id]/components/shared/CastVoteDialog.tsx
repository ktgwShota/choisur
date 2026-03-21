'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import FormInputField from '@/components/shared/forms/FormInputField';
import RHFForm from '@/components/shared/forms/RHFForm';
import { Button } from '@/components/shared/primitives/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/shared/primitives/dialog';
import { getResponsiveValue } from '@/utils/styles';

const voterNameSchema = z.object({
  voterName: z
    .string()
    .min(1, '名前を入力してください')
    .max(20, '名前は20文字以内で入力してください'),
});

type VoterNameFormData = z.infer<typeof voterNameSchema>;

interface CastVoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  optionId: number;
  onSubmit: (name: string, userId: string, optionId: number) => Promise<void>;
}

export default function CastVoteDialog({
  open,
  onOpenChange,
  optionId,
  onSubmit,
}: CastVoteDialogProps) {
  const form = useForm<VoterNameFormData>({
    resolver: zodResolver(voterNameSchema),
    defaultValues: {
      voterName: '',
    },
  });

  const {
    formState: { isSubmitting, errors },
    reset,
  } = form;

  const handleSubmit = async (data: VoterNameFormData) => {
    const trimmedName = data.voterName.trim();
    try {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await onSubmit(trimmedName, userId, optionId);
      reset();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      form.setError('root', {
        message: 'エラーが発生しました',
      });
    }
  };

  return (
    <FadeDialog
      maxWidth="400px"
      open={open}
      onOpenChange={(val) => !val && onOpenChange(false)}
      header={
        <DialogHeader className="sr-only">
          <DialogTitle>投票者名の設定</DialogTitle>
        </DialogHeader>
      }
      contents={
        <RHFForm form={form} onSubmit={handleSubmit}>
          <FormInputField
            name="voterName"
            label="名前"
            required
            behavior="notched"
            placeholder="田中 太郎"
            maxLength={20}
          />
          {errors.root && <p className="mt-2 text-[12px] text-red-600">{errors.root.message}</p>}
        </RHFForm>
      }
      footer={
        <DialogFooter
          className="flex w-full flex-row border-border border-t"
          style={{
            paddingTop: getResponsiveValue(20, 24, 320, 900, true),
            gap: getResponsiveValue(20, 24, 320, 900, true),
          }}
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-auto min-w-0 flex-1 rounded-[2px] border-slate-200 py-3 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
            className="h-auto min-w-0 flex-1 rounded-[2px] bg-[#1976d2] py-3 text-white hover:bg-[#1565c0]"
          >
            投票
          </Button>
        </DialogFooter>
      }
    />
  );
}
