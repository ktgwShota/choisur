'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Send, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormInputField from '@/components/shared/forms/FormInputField';
import RHFForm from '@/components/shared/forms/RHFForm';
import { Textarea } from '@/components/shared/primitives/textarea';
import type { SummaryComment } from '@/db/core/types';
import { AUTHOR_NAME_MAX_LENGTH, BODY_MAX_LENGTH } from '@/db/services/summaryComment';
import {
  type SummaryCommentFormData,
  summaryCommentFormSchema,
} from '@/db/validation/summaryComment';
import dayjs from '@/lib/dayjs';
import { useToastStore } from '@/stores/useToastStore';
import { getResponsiveValue } from '@/utils/styles';
import {
  createSummaryCommentAction,
  deleteSummaryCommentAction,
  updateSummaryCommentAction,
} from '../actions';
import {
  addMyCommentId,
  getMyCommentIds,
  removeMyCommentId,
  STORAGE_KEY_AUTHOR,
} from '../utils/summaryCommentStorage';

interface SummaryCommentBoardProps {
  scheduleId: string;
  initialComments: SummaryComment[];
}

export function SummaryCommentBoard({ scheduleId, initialComments }: SummaryCommentBoardProps) {
  const router = useRouter();
  const { showToast, showError } = useToastStore();
  const [myCommentIds, setMyCommentIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  useEffect(() => {
    setMyCommentIds(getMyCommentIds(scheduleId));
  }, [scheduleId]);

  const form = useForm<SummaryCommentFormData>({
    resolver: zodResolver(summaryCommentFormSchema),
    defaultValues: {
      authorName: '',
      body: '',
    },
    mode: 'onChange',
  });

  const {
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_AUTHOR);
      if (saved?.trim()) setValue('authorName', saved.trim());
    }
  }, [setValue]);

  const onSubmit = async (data: SummaryCommentFormData) => {
    try {
      const result = await createSummaryCommentAction(scheduleId, data.authorName, data.body);
      if (!result.success || !result.data) {
        showError(result.error ?? '投稿に失敗しました');
        return;
      }
      localStorage.setItem(STORAGE_KEY_AUTHOR, data.authorName);
      addMyCommentId(scheduleId, result.data.id);
      setMyCommentIds(getMyCommentIds(scheduleId));
      form.reset({ authorName: data.authorName, body: '' });
      showToast('コメントを投稿しました', 'success');
      router.refresh();
    } catch {
      showError('投稿に失敗しました');
    }
  };

  const startEdit = useCallback((c: SummaryComment) => {
    setEditingId(c.id);
    setEditBody(c.body);
  }, []);

  const saveEdit = async () => {
    if (editingId == null) return;
    setIsUpdating(true);
    try {
      const result = await updateSummaryCommentAction(editingId, scheduleId, editBody);
      if (!result.success) {
        showError(result.error ?? '更新に失敗しました');
        return;
      }
      showToast('コメントを更新しました', 'success');
      setEditingId(null);
      router.refresh();
    } catch {
      showError('更新に失敗しました');
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditBody('');
  }, []);

  const handleDelete = async (c: SummaryComment) => {
    if (!confirm('このコメントを削除しますか？')) return;
    setIsDeletingId(c.id);
    try {
      const result = await deleteSummaryCommentAction(c.id, scheduleId);
      if (!result.success) {
        showError(result.error ?? '削除に失敗しました');
        return;
      }
      removeMyCommentId(scheduleId, c.id);
      setMyCommentIds(getMyCommentIds(scheduleId));
      showToast('コメントを削除しました', 'success');
      router.refresh();
    } catch {
      showError('削除に失敗しました');
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-xl pt-6">
      {initialComments.length === 0 ? (
        <div className="rounded-[2px] border border-neutral-200 bg-white py-6">
          <p className="text-center text-neutral-500 text-sm">まだコメントはありません</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {initialComments.map((c) => {
            const isMine = myCommentIds.includes(c.id);
            const isEditing = editingId === c.id;
            const isDeleting = isDeletingId === c.id;
            return (
              <li
                key={c.id}
                className="rounded-[2px] border border-neutral-200 bg-white p-5"
                style={{ marginBottom: getResponsiveValue(20, 24) }}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-500"
                      aria-hidden
                    >
                      <User className="h-4 w-4" />
                    </span>
                    <span className="truncate font-medium text-neutral-800 text-sm">
                      {c.authorName}
                    </span>
                  </div>
                  <time className="shrink-0 text-neutral-400 text-xs" dateTime={c.createdAt}>
                    {dayjs(c.createdAt).format('YYYY/M/D HH:mm')}
                  </time>
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      maxLength={BODY_MAX_LENGTH}
                      className="min-h-[88px] resize-y rounded-[2px] border border-neutral-200 text-sm focus:ring-2 focus:ring-neutral-400/30"
                      placeholder="コメント"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={isUpdating}
                        className="rounded-[2px] bg-neutral-900 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                      >
                        {isUpdating ? '保存中...' : '保存'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isUpdating}
                        className="rounded-[2px] border border-neutral-200 bg-white px-4 py-2 font-medium text-neutral-700 text-sm transition-colors hover:bg-neutral-50 disabled:opacity-50"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end justify-between gap-2">
                    <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-neutral-700 text-sm leading-relaxed">
                      {c.body}
                    </p>
                    {isMine && (
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="rounded-[2px] p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          aria-label="編集"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          disabled={isDeleting}
                          className="rounded-[2px] p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          aria-label="削除"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div
        className="[&_[data-slot=form-label]]:!text-sm rounded-[2px] border border-neutral-200 bg-neutral-50/50 p-5 [&_[data-slot=input]]:border-neutral-200 [&_[data-slot=input]]:text-sm [&_[data-slot=textarea]]:border-neutral-200 [&_[data-slot=textarea]]:text-sm"
        style={{ marginTop: getResponsiveValue(20, 24, 320, 900, true) }}
      >
        <RHFForm form={form} onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <FormInputField
              name="authorName"
              label="名前"
              required
              maxLength={AUTHOR_NAME_MAX_LENGTH}
            />

            <FormInputField
              name="body"
              label="コメント"
              placeholder="予算は1人あたり5000円です。支払いは現金でお願いします。"
              required
              maxLength={BODY_MAX_LENGTH}
              showCharCount
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-3 rounded-[2px] border border-slate-700 bg-slate-700 py-3 pr-5 pl-4 font-medium text-sm text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden />
              {isSubmitting ? '投稿中...' : '投稿'}
            </button>
          </div>
        </RHFForm>
      </div>
    </section>
  );
}
