'use client';

import { Share2 } from 'lucide-react';
import { siFacebook, siLine, siX } from 'simple-icons';
import { Button } from '@/components/shared/primitives/button';

interface SocialShareButtonsProps {
  shareUrl: string;
  shareText: string;
}

export default function SocialShareButtons({ shareUrl, shareText }: SocialShareButtonsProps) {
  const shareToX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareToLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('リンクをコピーしました');
    } catch (_err) {
      alert('コピーに失敗しました');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={shareToX}
        size="icon"
        className="rounded-full bg-black text-white hover:bg-gray-800"
        aria-label="Xでシェア"
      >
        <XIcon />
      </Button>
      <Button
        onClick={shareToFacebook}
        size="icon"
        className="rounded-full bg-[#1877F2] text-white hover:bg-[#166fe5]"
        aria-label="Facebookでシェア"
      >
        <FacebookIcon />
      </Button>
      <Button
        onClick={shareToLine}
        size="icon"
        className="rounded-full bg-[#06C755] text-white hover:bg-[#05b548]"
        aria-label="LINEでシェア"
      >
        <LineIcon />
      </Button>
      <Button
        onClick={copyToClipboard}
        size="icon"
        className="rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300"
        aria-label="リンクをコピー"
      >
        <Share2 size={18} />
      </Button>
    </div>
  );
}

function XIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={siX.path} />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={siFacebook.path} />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={siLine.path} />
    </svg>
  );
}
