import type { Metadata } from 'next';
import BasicPageTitle from '@/components/shared/headings/BasicPageTitle';
import StyledList from '@/components/shared/others/StyledList';

export const metadata: Metadata = {
  title: '当サイトについて',
  description:
    'Choisur（チョイスル）について。幹事の負担を減らす日程調整・多数決ツール。サービス概要とご利用シーンをご紹介します。',
  alternates: {
    canonical: 'https://choisur.jp/about',
  },
  openGraph: {
    title: '当サイトについて',
    description: 'Choisur（チョイスル）について。幹事の負担を減らす日程調整・多数決ツール。',
    url: 'https://choisur.jp/about',
    siteName: 'Choisur',
    locale: 'ja_JP',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '当サイトについて | Choisur（チョイスル）',
    description: 'Choisur（チョイスル）について。幹事の負担を減らす日程調整・多数決ツール。',
  },
};

export default function AboutPage() {
  return (
    <>
      <BasicPageTitle>当サイトについて</BasicPageTitle>

      {/* トップ ABOUT セクションから移植 */}
      <section className="mb-16">
        <h2 className="mb-4 font-bold text-[rgba(0,0,0,0.87)] text-lg">サイトについて</h2>
        <h3 className="mb-6 font-bold text-base leading-snug sm:text-lg">
          幹事の負担を
          <span
            className="px-0.5"
            style={{
              background: 'linear-gradient(120deg, #818cf8 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            限りなくゼロ
          </span>
          へ。
        </h3>
        <div className="flex flex-col gap-6 text-[0.9375rem] text-[rgba(0,0,0,0.6)] leading-[2]">
          <p>
            Choisur（チョイスル）は、
            <br />
            飲み会をはじめとする様々なイベントの「多数決」や「日程調整」といった、幹事に集中しがちな手間を減らすためのツールです。
          </p>
          <p>
            従来は「いつ？」「どこで？」「だれと？」といった情報を手動で集計する手間が幹事の負担となっていましたが、
            <br />
            Choisur（チョイスル）を使用すれば、必要な情報を入力して URL
            を共有するだけで、簡単に全員の意思を可視化できます。
          </p>
        </div>
      </section>

      {/* 従来の about ページのサービス概要 */}
      <section className="mb-8">
        <h2 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)] text-lg">サービス概要</h2>
        <p className="mb-8 text-[rgba(0,0,0,0.6)] leading-relaxed">
          Choisur（チョイスル）は、意思決定を公正かつ迅速に行うためのオンライン多数決サービスです。
        </p>
        <StyledList
          items={[
            'いつまで経っても決まらない飲み会の場所',
            'やっぱりこちらの方が良かった...といった周囲からの不満',
          ]}
        />
        <p className="mt-8 text-[rgba(0,0,0,0.6)] leading-relaxed">
          あらゆる選択を参加者全員の納得感をもって決定することを支援します。
        </p>
      </section>
    </>
  );
}
