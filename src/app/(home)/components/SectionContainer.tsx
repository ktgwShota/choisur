import type { CSSProperties, ReactNode } from 'react';
import { cn, getResponsiveValue } from '@/utils/styles';

interface SectionContainerProps {
  children: ReactNode;
  sx?: CSSProperties;
  className?: string;
}

export default function SectionContainer({
  children,
  sx,
  className,
  ...props
}: SectionContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[970px]', className)}
      style={{
        paddingLeft: getResponsiveValue(20, 40, 320, 600),
        paddingRight: getResponsiveValue(20, 40, 320, 600),
        paddingBottom: getResponsiveValue(50, 80, 640, 900),
        paddingTop: getResponsiveValue(40, 60, 640, 900),
        ...(sx || {}),
      }}
      {...props}
    >
      {children}
    </div>
  );
}
