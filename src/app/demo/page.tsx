import { ArrowRight, Calendar, Utensils } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DEMO_IDS } from '@/app/(home)/constants';

export const metadata: Metadata = {
  title: '実際の画面',
  description: '日程調整・多数決の画面を、実際の見た目のままご覧いただけます。',
};

const BG = '#0f1628';
const CYAN = 'rgba(0,240,255,0.12)';

export default function DemoPage() {
  const cards = [
    {
      href: `/polls/${DEMO_IDS.POLL}`,
      title: '多数決',
      subtitle: 'DISCOVERY',
      description: 'お店の候補に投票し、多数決で決める流れをご覧いただけます。',
      icon: Utensils,
      accent: 'from-teal-400/90 to-cyan-500/80',
      iconWrap: 'bg-teal-500/15 text-teal-300 ring-teal-400/25',
    },
    {
      href: `/schedule/${DEMO_IDS.SCHEDULE}`,
      title: '日程調整',
      subtitle: 'SCHEDULING',
      description: '候補日時への出欠入力と集計画面のイメージをご覧いただけます。',
      icon: Calendar,
      accent: 'from-violet-400/90 to-indigo-500/80',
      iconWrap: 'bg-violet-500/15 text-violet-200 ring-violet-400/25',
    },
  ] as const;

  return (
    <div
      className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden"
      style={{
        backgroundColor: BG,
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 30% 20%, ${CYAN} 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 90% 60%, rgba(99,102,241,0.08) 0%, transparent 55%)
        `,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[960px] px-5 pt-14 pb-20 md:px-10 md:pt-20">
        <nav className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-medium text-slate-400 text-sm transition-colors hover:text-white"
          >
            <span aria-hidden className="text-lg leading-none">
              ←
            </span>
            トップに戻る
          </Link>
        </nav>

        <p
          className="mb-2 font-bold uppercase tracking-[0.2em]"
          style={{ color: '#7dd3fc', fontSize: '11px' }}
        >
          View
        </p>
        <h1 className="font-black text-3xl text-white tracking-tight md:text-4xl">
          実際の画面を見る
        </h1>
        <p className="mt-4 max-w-xl text-[0.95rem] text-slate-400 leading-relaxed">
          幹事・参加者向けの画面を、そのままの見た目で開けます。
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/25 hover:bg-white/[0.07] hover:shadow-[0_28px_70px_rgba(0,240,255,0.08)] md:p-8"
              >
                <div
                  className={`pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-40 blur-2xl transition-opacity group-hover:opacity-60 ${card.accent}`}
                  aria-hidden
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-1 block font-bold text-[10px] text-slate-500 uppercase tracking-[0.15em]">
                      {card.subtitle}
                    </span>
                    <h2 className="font-extrabold text-white text-xl md:text-2xl">{card.title}</h2>
                  </div>
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${card.iconWrap}`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                </div>
                <p className="relative mt-4 flex-1 text-slate-400 text-sm leading-relaxed">
                  {card.description}
                </p>
                <div className="relative mt-6 flex items-center gap-2 font-bold text-cyan-300 text-sm transition-colors group-hover:text-cyan-200">
                  開く
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-12 text-center text-slate-500 text-xs">
          新規にイベントを作る場合は、トップの「今すぐ始める」から作成してください。
        </p>
      </div>
    </div>
  );
}
