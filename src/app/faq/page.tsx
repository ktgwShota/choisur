import type { Metadata } from 'next';
import FAQList from '@/app/(home)/components/FAQSection/FAQList';
import { FAQ_ITEMS } from '@/app/(home)/constants';
import BasicPageTitle from '@/components/shared/headings/BasicPageTitle';

export const metadata: Metadata = {
  title: 'よくある質問',
  description:
    'Choisur（チョイスル）のよくある質問一覧。会員登録・料金・対応ブラウザ・利用制限・パスワード保護（予定）などをまとめています。',
  alternates: {
    canonical: 'https://choisur.jp/faq',
  },
  openGraph: {
    title: 'よくある質問',
    description:
      'Choisur（チョイスル）のよくある質問一覧。会員登録・料金・対応ブラウザ・利用制限・パスワード保護（予定）などをまとめています。',
    url: 'https://choisur.jp/faq',
    siteName: 'Choisur',
    locale: 'ja_JP',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'よくある質問 | Choisur（チョイスル）',
    description:
      'Choisur（チョイスル）のよくある質問一覧。会員登録・料金・対応ブラウザ・利用制限・パスワード保護（予定）などをまとめています。',
  },
};

export default function FaqPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <BasicPageTitle>よくある質問</BasicPageTitle>

      <FAQList animate={false} />
    </>
  );
}
