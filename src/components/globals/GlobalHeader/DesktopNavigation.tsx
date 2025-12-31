'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/utils/styles';
import { SEGMENT_LINKS } from './segmentLinks';

export const DesktopNavigation = () => {
  const allLinks: Array<{
    href: string;
    label: string;
    sectionId?: string;
    pathPrefix?: string;
  }> = [
    { href: '/#how-to-use', label: '利用方法', sectionId: 'how-to-use' },
    { href: '/#faq', label: 'よくある質問', sectionId: 'faq' },
    ...SEGMENT_LINKS.map((link) => ({
      href: link.href,
      label: link.label,
      pathPrefix: link.pathPrefix,
    })),
  ];

  return (
    <nav className="hidden items-center gap-3 sm:flex">
      {allLinks.map((link, index) => (
        <React.Fragment key={link.href}>
          <NavLink
            href={link.href}
            label={link.label}
            sectionId={link.sectionId}
            pathPrefix={link.pathPrefix}
          />
          {index < allLinks.length - 1 && (
            <span className="select-none text-[#333] opacity-30">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  sectionId?: string;
  pathPrefix?: string;
}

export function NavLink({ href, label, sectionId, pathPrefix }: NavLinkProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const handleClick = (e: React.MouseEvent) => {
    if (sectionId && isHomePage) {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'cursor-pointer font-medium text-[#333] text-[14px] decoration-0 transition-all duration-300 hover:opacity-80'
      )}
    >
      {label}
    </Link>
  );
}
