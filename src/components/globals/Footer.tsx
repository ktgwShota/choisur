import { BarChart2, Calendar, Gavel, Layout, Mail, MessageSquare, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Separator } from '@/components/shared/primitives/separator';
import { getResponsiveValue } from '@/utils/styles';

type ServiceLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
};

export default function GlobalFooter() {
  const serviceLinks: ServiceLink[] = [
    {
      label: '日程調整',
      href: '/schedule/create',
      icon: Calendar,
      iconClassName: 'text-violet-500',
    },
    { label: '多数決', href: '/polls/create', icon: BarChart2, iconClassName: 'text-indigo-500' },
  ];

  const supportLinks = [
    { label: 'よくある質問', href: '/faq', icon: MessageSquare },
    { label: 'お問い合わせ', href: '/contact', icon: Mail },
  ];

  const aboutLinks = [
    { label: '当サイトについて', href: '/about', icon: Layout },
    { label: '利用規約', href: '/terms', icon: Gavel },
    { label: 'プライバシーポリシー', href: '/privacy', icon: ShieldCheck },
  ];

  return (
    <footer
      className="mt-auto border-t bg-[#0f1628] text-white"
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div
        className="w-full"
        style={{
          paddingLeft: getResponsiveValue(20, 40),
          paddingRight: getResponsiveValue(20, 40),
          paddingTop: '48px',
          paddingBottom: getResponsiveValue(20, 24),
        }}
      >
        <div className="mx-auto w-full max-w-[960px]">
          <div className="mb-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:gap-0">
            {/* タイトル */}
            <div className="w-full pr-12 text-left sm:w-[350px] sm:shrink-0">
              <Link href="/" className="mb-6 inline-flex items-center">
                <img src="/logo.png" alt="Choisur Logo" width={140} style={{ height: 'auto' }} />
              </Link>
              <p className="text-sm text-white/90">日程調整 / 多数決アプリ</p>
            </div>

            {/* リンクセクション */}
            <div className="flex w-full flex-1 flex-row flex-wrap gap-6 sm:ml-auto sm:grid sm:max-w-[500px] sm:grid-cols-2">
              {/* 1: SERVICE */}
              <div className="text-left">
                <span
                  className="mx-0 mb-5 inline-block w-fit font-extrabold text-white uppercase"
                  style={{
                    fontSize: getResponsiveValue(14, 16),
                    letterSpacing: '0.1em',
                  }}
                >
                  SERVICE
                </span>
                <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-3">
                  {serviceLinks.map((link, index) => (
                    <React.Fragment key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 font-medium text-[0.85rem] text-white/90 no-underline transition-all duration-200 hover:text-white"
                      >
                        <link.icon
                          className={`h-[0.85rem] w-[0.85rem] transition-colors duration-200 group-hover:text-white ${link.iconClassName}`}
                        />
                        {link.label}
                      </Link>
                      {index < serviceLinks.length - 1 && (
                        <span className="select-none text-white/20">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 2: SUPPORT */}
              <div className="text-left">
                <span
                  className="mx-0 mb-5 inline-block w-fit font-extrabold text-white uppercase"
                  style={{
                    fontSize: getResponsiveValue(14, 16),
                    letterSpacing: '0.1em',
                  }}
                >
                  SUPPORT
                </span>
                <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-3">
                  {supportLinks.map((link, index) => (
                    <React.Fragment key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 font-medium text-[0.85rem] text-white/90 no-underline transition-all duration-200 hover:text-white"
                      >
                        <link.icon className="h-[0.85rem] w-[0.85rem] text-white/90 transition-colors duration-200 group-hover:text-white" />
                        {link.label}
                      </Link>
                      {index < supportLinks.length - 1 && (
                        <span className="select-none text-white/20">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 3: ABOUT */}
              <div className="text-left sm:col-span-2">
                <span
                  className="mx-0 mb-5 inline-block w-fit font-extrabold text-white uppercase"
                  style={{
                    fontSize: getResponsiveValue(14, 16),
                    letterSpacing: '0.1em',
                  }}
                >
                  ABOUT
                </span>
                <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-3">
                  {aboutLinks.map((link, index) => (
                    <React.Fragment key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 font-medium text-[0.85rem] text-white/90 no-underline transition-all duration-200 hover:text-white"
                      >
                        <link.icon className="h-[0.85rem] w-[0.85rem] text-white/90 transition-colors duration-200 group-hover:text-white" />
                        {link.label}
                      </Link>
                      {index < aboutLinks.length - 1 && (
                        <span className="select-none text-white/20">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

          <p className="mt-6 text-center font-normal text-white/60 text-xs">
            © 2025 Choisur. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
