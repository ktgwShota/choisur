import { ClipboardList, Inbox } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/shared/primitives/card';

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[8px] border border-slate-200 bg-white p-6">
        <h1 className="font-semibold text-2xl text-slate-900">管理ダッシュボード</h1>
        <p className="mt-2 text-slate-500 text-sm">
          ここから各管理ページへ移動できます。将来的に機能が増えても拡張しやすい構成です。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-4 border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-slate-700">
            <Inbox className="h-5 w-5" />
            <h2 className="font-semibold text-lg">お問い合わせ管理</h2>
          </div>
          <p className="text-slate-500 text-sm">
            お問い合わせの一覧・詳細確認、既読管理、検索、削除ができます。
          </p>
          <Link
            href="/dashboard/contacts"
            className="inline-flex w-fit items-center rounded-full bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            管理画面を開く
          </Link>
        </Card>

        <Card className="flex flex-col gap-4 border border-slate-200 border-dashed bg-slate-50 p-5">
          <div className="flex items-center gap-2 text-slate-600">
            <ClipboardList className="h-5 w-5" />
            <h2 className="font-semibold text-lg">今後の管理機能</h2>
          </div>
          <p className="text-slate-500 text-sm">
            将来的なモジュール追加を想定して、サブページを拡張できます。
          </p>
        </Card>
      </div>
    </div>
  );
}
