import {
  BookOpen,
  Calendar,
  Gavel,
  Layout,
  Mail,
  MessageSquare,
  ShieldCheck,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Separator } from '@/components/shared/primitives/separator';
import { getResponsiveValue } from '@/utils/styles';

export default function GlobalFooter() {
  const serviceLinks = [
    { label: '店決め', href: '/polls/create', icon: Utensils, color: '#2dd4bf' },
    { label: '日程調整', href: '/schedule/create', icon: Calendar, color: '#f97316' },
  ];

  const supportLinks = [
    { label: '利用方法', href: '/#how-to-use', icon: BookOpen },
    { label: 'よくある質問', href: '/#faq', icon: MessageSquare },
    { label: 'お問い合わせ', href: '/contact', icon: Mail },
  ];

  const aboutLinks = [
    { label: '当サイトについて', href: '/about', icon: Layout },
    { label: '利用規約', href: '/terms', icon: Gavel },
    { label: 'プライバシーポリシー', href: '/privacy', icon: ShieldCheck },
  ];

  return (
    <footer className="mt-auto border-white/10 border-t bg-[#1e293b] text-white">
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: `calc(900px + ${getResponsiveValue(40, 64, 320, 900)})`,
          paddingLeft: getResponsiveValue(20, 40),
          paddingRight: getResponsiveValue(20, 40),
          paddingTop: '48px',
          paddingBottom: getResponsiveValue(20, 24),
        }}
      >
        <div className="mb-10 flex flex-col items-start justify-between gap-8 sm:flex-row sm:gap-0">
          {/* タイトル */}
          <div className="w-full pr-12 text-left sm:w-[350px] sm:shrink-0">
            <Link href="/" className="mb-6 inline-block">
              <img
                src="/logo.png"
                alt="Choisur"
                width={140}
                style={{ height: 'auto' }}
                className="brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-white/90">日程調整や店決めに使用する幹事用アプリ。</p>
          </div>

          {/* リンクセクション */}
          <div className="flex w-full flex-1 flex-row flex-wrap gap-5 sm:ml-auto sm:grid sm:max-w-[500px] sm:grid-cols-2">
            {/* 1: SERVICE */}
            <div className="text-left">
              <span
                className="mx-0 mb-5 inline-block w-fit border-[#3b82f6] border-b-2 pb-2 font-extrabold text-white uppercase"
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
                        className="h-[0.85rem] w-[0.85rem] transition-colors duration-200 group-hover:text-white"
                        style={{ color: (link as any).color }}
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
                className="mx-0 mb-5 inline-block w-fit border-[#3b82f6] border-b-2 pb-2 font-extrabold text-white uppercase"
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
                className="mx-0 mb-5 inline-block w-fit border-[#3b82f6] border-b-2 pb-2 font-extrabold text-white uppercase"
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

        <Separator className="bg-white/5" />

        <p className="mt-6 text-center font-normal text-white/60 text-xs">
          © 2025 Choisur. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
