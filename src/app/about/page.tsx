import type { Metadata } from 'next';
import BasicPageTitle from '@/components/shared/headings/BasicPageTitle';
import StyledList from '@/components/shared/others/StyledList';

export const metadata: Metadata = {
  title: '当サイトについて',
  description:
    'Choisur（チョイスル）は、飲み会やイベントの日程調整や店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。当サイトについてご紹介します。',
  alternates: {
    canonical: 'https://choisur.jp/about',
  },
  openGraph: {
    title: '当サイトについて',
    description:
      'Choisur（チョイスル）は、飲み会やイベントの日程調整や店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。当サイトについてご紹介します。',
    url: 'https://choisur.jp/about',
    siteName: 'Choisur',
    locale: 'ja_JP',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '当サイトについて | Choisur（チョイスル）',
    description:
      'Choisur（チョイスル）は、飲み会やイベントの日程調整や店決め（多数決）を簡単に作成・共有できる無料の幹事アプリです。当サイトについてご紹介します。',
  },
};

export default function AboutPage() {
  return (
    <>
      <BasicPageTitle>当サイトについて</BasicPageTitle>

      <div className="mb-16">
        <h6 className="mb-6 font-semibold text-[rgba(0,0,0,0.87)]">サービス概要</h6>
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
      </div>
    </>
  );
}
