'use client';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { BookOpen, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/shared/primitives/button';
import { Separator } from '@/components/shared/primitives/separator';
import {
  Sheet,
  SheetOverlay,
  SheetPortal,
  SheetTrigger,
} from '@/components/shared/primitives/sheet';
import { cn } from '@/utils/styles';
import { SEGMENT_LINKS } from './segmentLinks';

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-[#333] transition-colors hover:bg-white/5 sm:hidden"
        >
          <div className="hamburger" data-open={open}>
            <span className="hamburgerLine" />
            <span className="hamburgerLine" />
            <span className="hamburgerLine" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetPortal>
        <SheetOverlay className="overlay top-[80px]" />
        <SheetPrimitive.Content className="content fixed inset-x-0 top-[80px] z-50 flex h-auto w-full flex-col gap-0 border-white/5 border-t bg-[#1e293b] p-0 text-white/90 shadow-lg">
          {/* Visually hidden title for accessibility */}
          <SheetPrimitive.Title className="sr-only">ナビゲーションメニュー</SheetPrimitive.Title>

          {/* Content */}
          <div className="contentText px-6 py-8" data-state={open ? 'open' : 'closed'}>
            {/* Main Navigation */}
            <span className="mb-4 block px-2 font-extrabold text-sm text-white/80 uppercase tracking-widest">
              SERVICE
            </span>

            <nav className="mb-6 flex flex-col">
              {SEGMENT_LINKS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-white/5 hover:text-white"
                >
                  <item.icon
                    className={cn(
                      'h-[0.85rem] w-[0.85rem]',
                      item.id === 'polls' ? 'text-[#2dd4bf]' : 'text-[#f97316]'
                    )}
                  />
                  <span className="font-medium text-[0.85rem]">{item.label}</span>
                </Link>
              ))}
            </nav>

            <Separator className="my-6 bg-white/5" />

            {/* Sub Navigation */}
            <span className="mb-4 block px-2 font-extrabold text-sm text-white/80 uppercase tracking-widest">
              SUPPORT
            </span>

            <nav className="flex flex-col">
              {[
                { label: '利用方法', href: '/#how-to-use', icon: BookOpen },
                { label: 'よくある質問', href: '/#faq', icon: MessageSquare },
                { label: 'お問い合わせ', href: '/contact', icon: Mail },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-white/5 hover:text-white"
                >
                  <link.icon className="h-[0.85rem] w-[0.85rem]" />
                  <span className="font-medium text-[0.85rem]">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>

      <style jsx global>{`
        /* Overlay Animation */
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes overlayOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* Content Animation (Expand from top) */
        @keyframes contentIn {
          from {
            opacity: 0;
            transform: scaleY(0);
            transform-origin: top;
          }
          to {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: top;
          }
        }
        @keyframes contentOut {
          from {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: top;
          }
          to {
            opacity: 0;
            transform: scaleY(0);
            transform-origin: top;
          }
        }

        /* Overlay Styles */
        .overlay {
          animation-duration: 800ms;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }
        .overlay[data-state="open"] { animation-name: overlayIn; }
        .overlay[data-state="closed"] { animation-name: overlayOut; }

        /* Content Styles */
        .content {
          animation-duration: 800ms;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }
        .content[data-state="open"] { animation-name: contentIn; }
        .content[data-state="closed"] { animation-name: contentOut; }

        /* Content Text Animation */
        @keyframes contentTextIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes contentTextOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .contentText {
          animation-timing-function: ease-out;
          animation-fill-mode: both;
        }
        .contentText[data-state="open"] {
          animation-name: contentTextIn;
          animation-duration: 400ms;
          animation-delay: 200ms;
        }
        .contentText[data-state="closed"] {
          animation-name: contentTextOut;
          animation-duration: 0ms;
          animation-delay: 0ms;
        }

        /* Hamburger Menu Icon */
        .hamburger {
          width: 24px;
          height: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          position: relative;
        }
        .hamburgerLine {
          width: 22px;
          height: 2px;
          background-color: currentColor;
          border-radius: 2px;
          transform-origin: center;
        }

        /* Keyframe animations */
        @keyframes topLineToX {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(8px) rotate(0); }
          100% { transform: translateY(8px) rotate(45deg); }
        }
        @keyframes middleLineOut {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes bottomLineToX {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-8px) rotate(0); }
          100% { transform: translateY(-8px) rotate(-45deg); }
        }

        /* Reverse animations */
        @keyframes topLineFromX {
          0% { transform: translateY(8px) rotate(45deg); }
          50% { transform: translateY(8px) rotate(0); }
          100% { transform: translateY(0) rotate(0); }
        }
        @keyframes middleLineIn {
          0% { opacity: 0; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes bottomLineFromX {
          0% { transform: translateY(-8px) rotate(-45deg); }
          50% { transform: translateY(-8px) rotate(0); }
          100% { transform: translateY(0) rotate(0); }
        }

        /* Closed state */
        .hamburger[data-open="false"] .hamburgerLine:nth-child(1) {
          animation: topLineFromX 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .hamburger[data-open="false"] .hamburgerLine:nth-child(2) {
          animation: middleLineIn 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .hamburger[data-open="false"] .hamburgerLine:nth-child(3) {
          animation: bottomLineFromX 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Open state */
        .hamburger[data-open="true"] .hamburgerLine:nth-child(1) {
          animation: topLineToX 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .hamburger[data-open="true"] .hamburgerLine:nth-child(2) {
          animation: middleLineOut 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .hamburger[data-open="true"] .hamburgerLine:nth-child(3) {
          animation: bottomLineToX 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </Sheet>
  );
}
