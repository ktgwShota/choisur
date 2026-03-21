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
        // transition-all だと border-b の有無が 300ms かけて補間され、トップへ戻ったとき枠線が遅れて消える
        'right-0 left-0 z-40 w-full',
        isHome ? 'absolute' : 'static border-border border-b'
      )}
    >
      <div
        className="w-full"
        style={{
          paddingLeft: getResponsiveValue(20, 40),
          paddingRight: getResponsiveValue(20, 40),
        }}
      >
        <div className="mx-auto w-full max-w-[960px]">
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
      </div>
    </header>
  );
}
