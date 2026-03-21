'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/styles';
import { SEGMENT_LINKS } from './segmentLinks';

/** インライン color は Lucide + React 19 で SVG 周りのハイドレーション差分の原因になるため Tailwind のみ使う */
const ACCENT_ICON: Record<string, 'indigo' | 'violet'> = {
  polls: 'indigo',
  schedule: 'violet',
};

export const DesktopNavigation = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className="hidden items-center sm:flex">
      {SEGMENT_LINKS.map((link, index) => {
        const Icon = link.icon;
        const accent = ACCENT_ICON[link.id] ?? 'indigo';
        const isActive = pathname.startsWith(link.pathPrefix);
        const activeIcon = accent === 'indigo' ? 'text-indigo-500' : 'text-violet-500';
        const activeUnderline = accent === 'indigo' ? 'bg-indigo-500' : 'bg-violet-500';

        return (
          <div key={link.href} className="flex items-center">
            {index > 0 && (
              <span className={cn('mx-1 h-3 w-px', isHome ? 'bg-white/25' : 'bg-black/20')} />
            )}
            <Link
              href={link.href}
              className={cn(
                'group relative inline-flex items-center gap-1.5 px-3 py-2 font-medium text-[13px] transition-colors duration-200',
                isHome
                  ? isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                  : isActive
                    ? 'text-slate-800'
                    : 'text-slate-400 hover:text-slate-800'
              )}
            >
              <Icon
                size={12}
                strokeWidth={2.2}
                className={cn('shrink-0', isActive ? activeIcon : 'text-inherit')}
              />
              {link.label}
              {/* sliding underline */}
              <span
                className={cn(
                  'absolute right-3 bottom-0 left-3 h-px origin-left transition-transform duration-300',
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  activeUnderline
                )}
              />
            </Link>
          </div>
        );
      })}
    </nav>
  );
};
