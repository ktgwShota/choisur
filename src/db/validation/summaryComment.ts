import { z } from 'zod';
import { AUTHOR_NAME_MAX_LENGTH, BODY_MAX_LENGTH } from '../services/summaryComment';

export const summaryCommentFormSchema = z.object({
  authorName: z
    .string()
    .min(1, '名前を入力してください')
    .max(AUTHOR_NAME_MAX_LENGTH, `名前は${AUTHOR_NAME_MAX_LENGTH}文字以内で入力してください`)
    .transform((s) => s.trim()),
  body: z
    .string()
    .min(1, 'コメントを入力してください')
    .max(BODY_MAX_LENGTH, `コメントは${BODY_MAX_LENGTH}文字以内で入力してください`)
    .transform((s) => s.trim()),
});

export type SummaryCommentFormData = z.infer<typeof summaryCommentFormSchema>;
