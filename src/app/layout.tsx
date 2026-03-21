import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import '@/lib/dayjs';
import GlobalFooter from '@/components/globals/Footer';
import GlobalHeader from '@/components/globals/Header';
import MainLayout from '@/components/shared/layouts/MainLayout';
import LoadingOverlay from '@/components/shared/motions/LoadingOverlay';
import SmoothScroll from '@/components/shared/motions/SmoothScroll';
import ToastSnackbar from '@/components/shared/others/ToastSnackbar';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Choisur（チョイスル）',
    default: 'Choisur（チョイスル）| 日程調整 / 多数決アプリ',
  },
  description:
    'Choisur（チョイスル）は、飲み会やイベントの日程調整 / 多数決を簡単に作成・共有できる無料の幹事アプリです。会員登録・ログイン不要でご利用いただけます。',
  verification: {
    google: 'ofTAbzl-JBzpDPsfdbPZB74tnrA85pfVYutehiKDxsw',
  },
  other: {
    'google-adsense-account': 'ca-pub-1085041034271078',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://choisur.jp',
    siteName: 'Choisur（チョイスル）',
    title: {
      template: '%s | Choisur（チョイスル）',
      default: 'Choisur（チョイスル）| 日程調整 / 多数決アプリ',
    },
    description:
      'Choisur（チョイスル）は、飲み会やイベントの日程調整 / 多数決を簡単に作成・共有できる無料の幹事アプリです。会員登録・ログイン不要でご利用いただけます。',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s | Choisur（チョイスル）',
      default: 'Choisur（チョイスル）| 日程調整 / 多数決アプリ',
    },
    description:
      'Choisur（チョイスル）は、飲み会やイベントの日程調整 / 多数決を簡単に作成・共有できる無料の幹事アプリです。会員登録・ログイン不要でご利用いただけます。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={roboto.className}
        style={{ minWidth: '320px', backgroundColor: '#F1F5F9' }}
        suppressHydrationWarning
      >
        <ToastSnackbar />
        {/* <Tutorial /> */}
        <LoadingOverlay />
        <SmoothScroll>
          <div className="flex min-h-screen flex-col">
            <GlobalHeader />
            <MainLayout>{children}</MainLayout>
            <GlobalFooter />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
