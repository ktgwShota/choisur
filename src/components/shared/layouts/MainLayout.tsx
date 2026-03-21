'use client';

import { usePathname } from 'next/navigation';
import { getResponsiveValue } from '@/utils/styles';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidthPage = pathname === '/' || pathname === '/demo';

  if (isFullWidthPage) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <div
      className="mx-auto my-0 w-full flex-grow md:my-8 md:w-[calc(100%-64px)]"
      style={{ maxWidth: '960px' }}
    >
      <main
        className="min-w-0 flex-1 rounded-none border-0 bg-white sm:rounded-[2px] md:border md:border-[#DDD]"
        style={{ padding: getResponsiveValue(20, 40) }}
      >
        {children}
      </main>
    </div>
  );
}
