'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, getResponsiveValue } from '@/utils/styles';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';

/**
 * GlobalHeader
 *
 * クライアント側でパスを取得し、AppBar のスタイルを動的に変更します。
 */
export default function GlobalHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header
      className={cn(
        'right-0 left-0 z-40 w-full bg-[#fff] transition-all duration-300',
        isHome ? 'absolute' : 'static border-border border-b'
      )}
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: `calc(900px + ${getResponsiveValue(40, 64, 320, 900)})`,
          paddingLeft: getResponsiveValue(20, 40),
          paddingRight: getResponsiveValue(20, 40),
        }}
      >
        <div className="flex h-[80px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Choisur Logo" width={140} style={{ height: 'auto' }} />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Mobile Menu */}
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
