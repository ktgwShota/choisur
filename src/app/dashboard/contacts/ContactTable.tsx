'use client';

import { AlertCircle, Eye, MailCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/shared/primitives/alert';
import { Badge } from '@/components/shared/primitives/badge';
import { Button } from '@/components/shared/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/primitives/dialog';
import { Input } from '@/components/shared/primitives/input';
import { Separator } from '@/components/shared/primitives/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shared/primitives/table';
import type { Contact } from '@/db/core/types';

const PAGE_SIZE = 20;

type StatusFilter = 'all' | 'read' | 'unread';

type ContactTableProps = {
  contacts: Contact[];
  totalCount: number;
  unreadCount: number;
  page: number;
  status: StatusFilter;
  query: string;
  error?: string | null;
  setContactReadStatusAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  deleteContactAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
};

function buildQueryString({
  page,
  status,
  query,
}: {
  page: number;
  status: StatusFilter;
  query: string;
}) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (status !== 'all') params.set('status', status);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export default function ContactTable({
  contacts,
  totalCount,
  unreadCount,
  page,
  status,
  query,
  error,
  setContactReadStatusAction,
  deleteContactAction,
}: ContactTableProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const pageLinks = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const title = useMemo(() => {
    if (status === 'read') return '既読一覧';
    if (status === 'unread') return '未読一覧';
    return 'お問い合わせ一覧';
  }, [status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[6px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-semibold text-2xl text-slate-900">{title}</h1>
            <p className="mt-1 text-slate-500 text-sm">
              全件数: <span className="font-semibold text-slate-900">{totalCount}</span>件 / 未読:{' '}
              <span className="font-semibold text-amber-600">{unreadCount}</span>件
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant={status === 'all' ? 'default' : 'outline'} size="sm">
              <Link
                href={`/dashboard/contacts${buildQueryString({ page: 1, status: 'all', query })}`}
              >
                すべて
              </Link>
            </Button>
            <Button asChild variant={status === 'unread' ? 'default' : 'outline'} size="sm">
              <Link
                href={`/dashboard/contacts${buildQueryString({
                  page: 1,
                  status: 'unread',
                  query,
                })}`}
              >
                未読
              </Link>
            </Button>
            <Button asChild variant={status === 'read' ? 'default' : 'outline'} size="sm">
              <Link
                href={`/dashboard/contacts${buildQueryString({ page: 1, status: 'read', query })}`}
              >
                既読
              </Link>
            </Button>
          </div>
        </div>

        <Separator />

        <form className="flex flex-col gap-3 sm:flex-row sm:items-center" method="get">
          <Input
            name="q"
            defaultValue={query}
            placeholder="名前・メール・件名・本文で検索"
            className="h-10"
          />
          <input type="hidden" name="status" value={status !== 'all' ? status : ''} />
          <Button type="submit" className="h-10">
            検索
          </Button>
          {(query || status !== 'all') && (
            <Button asChild type="button" variant="outline" className="h-10">
              <Link href="/dashboard/contacts">リセット</Link>
            </Button>
          )}
        </form>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="overflow-hidden rounded-[6px] border border-slate-200 bg-white">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow>
                <TableHead className="w-[170px]">日時</TableHead>
                <TableHead>名前</TableHead>
                <TableHead>メール</TableHead>
                <TableHead>件名</TableHead>
                <TableHead className="w-[120px] text-center">状態</TableHead>
                <TableHead className="w-[160px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-slate-400">
                    該当するお問い合わせはありません
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-slate-50/60">
                    <TableCell className="text-[13px] text-slate-500">
                      {new Date(contact.createdAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{contact.name}</TableCell>
                    <TableCell className="text-slate-600">{contact.email}</TableCell>
                    <TableCell className="max-w-[240px] truncate text-slate-700">
                      {contact.subject}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          contact.isRead
                            ? 'border-slate-200 bg-slate-100 text-slate-600'
                            : 'border-amber-200 bg-amber-100 text-amber-700'
                        }
                      >
                        {contact.isRead ? '既読' : '未読'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <form
                          action={async (formData) => {
                            await setContactReadStatusAction(formData);
                          }}
                        >
                          <input type="hidden" name="id" value={contact.id} />
                          <input
                            type="hidden"
                            name="isRead"
                            value={contact.isRead ? 'false' : 'true'}
                          />
                          <Button type="submit" size="icon" variant="ghost" className="h-8 w-8">
                            <MailCheck className="h-4 w-4" />
                          </Button>
                        </form>
                        <form
                          action={async (formData) => {
                            await deleteContactAction(formData);
                          }}
                          onSubmit={(event) => {
                            if (!confirm('このお問い合わせを削除しますか？')) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={contact.id} />
                          <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-3 rounded-[6px] border border-slate-200 bg-white px-4 py-3 sm:flex-row">
        <p className="text-slate-500 text-sm">
          {totalCount === 0
            ? '0件'
            : `${(page - 1) * PAGE_SIZE + 1}〜${Math.min(page * PAGE_SIZE, totalCount)}件 / ${totalCount}件`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page <= 1}
            className="disabled:pointer-events-none disabled:opacity-50"
          >
            <Link
              href={`/dashboard/contacts${buildQueryString({ page: page - 1, status, query })}`}
            >
              前へ
            </Link>
          </Button>
          {pageLinks.map((pageNumber) => (
            <Button
              key={pageNumber}
              asChild
              variant={pageNumber === page ? 'default' : 'outline'}
              size="sm"
            >
              <Link
                href={`/dashboard/contacts${buildQueryString({ page: pageNumber, status, query })}`}
              >
                {pageNumber}
              </Link>
            </Button>
          ))}
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            className="disabled:pointer-events-none disabled:opacity-50"
          >
            <Link
              href={`/dashboard/contacts${buildQueryString({ page: page + 1, status, query })}`}
            >
              次へ
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={Boolean(selectedContact)} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-xl">
          {selectedContact ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">{selectedContact.subject}</DialogTitle>
                <DialogDescription className="text-slate-500">
                  {selectedContact.name} / {selectedContact.email}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="rounded-[6px] border border-slate-200 bg-slate-50/50 p-3 text-slate-700">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
                <p className="text-slate-400 text-xs">
                  受信日時: {new Date(selectedContact.createdAt).toLocaleString('ja-JP')}
                </p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedContact(null)}>
                  閉じる
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
