import type { ReactNode } from 'react';
import { Separator } from '@/components/shared/primitives/separator';

interface PageLayoutProps {
  header: ReactNode;
  contents: ReactNode;
  modals?: ReactNode;
  banner?: ReactNode;
}

export function PageLayout({ banner, header, contents, modals }: PageLayoutProps) {
  return (
    <div className="flex w-full flex-col">
      {banner ? <div>{banner}</div> : null}
      {header}
      <Separator />
      {contents}
      {modals}
    </div>
  );
}
