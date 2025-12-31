'use client';

import { usePathname } from 'next/navigation';
import { getResponsiveValue } from '@/utils/styles';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <main
      className="mx-auto my-0 w-full flex-grow rounded-none border-0 bg-white sm:max-w-[900px] sm:rounded-[2px] md:my-8 md:w-[calc(100%-64px)] md:border md:border-[#DDD]"
      style={{ padding: getResponsiveValue(20, 40) }}
    >
      {children}
    </main>
  );
}
