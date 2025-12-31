'use client';

import { ArrowDown, Rocket } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/shared/primitives/button';
import { getResponsiveValue } from '@/utils/styles';
import { COLORS } from '../../constants';
import CreateSelectionDialog from './CreateSelectionDialog';

export default function HeroActions() {
  const [openSelectionDialog, setOpenSelectionDialog] = useState(false);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      const windowHeight = window.innerHeight;
      const elementHeight = aboutSection.getBoundingClientRect().height;

      if (elementHeight <= windowHeight) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <div className="flex w-full flex-row justify-center gap-4 md:justify-start">
        <Button
          onClick={() => setOpenSelectionDialog(true)}
          className="!px-5 flex h-auto items-center rounded-full py-4 font-bold"
          style={{
            fontSize: getResponsiveValue(12.8, 14.4),
            background: COLORS.PRIMARY,
          }}
        >
          <Rocket size={getResponsiveValue(18, 20)} />
          今すぐ始める
        </Button>
        <Button
          variant="outline"
          onClick={scrollToAbout}
          className="!px-5 flex h-auto items-center rounded-full border-[#bfdbfe] bg-[#eff6ff] py-4 font-bold text-slate-800 shadow-none transition-all duration-200 hover:border-[#93c5fd] hover:bg-[#dbeafe] hover:shadow-none"
          style={{
            fontSize: getResponsiveValue(12.8, 14.4),
            color: COLORS.TEXT_MAIN,
          }}
        >
          <ArrowDown size={getResponsiveValue(18, 20)} style={{ color: COLORS.TEXT_MAIN }} />
          サイトについて
        </Button>
      </div>

      <CreateSelectionDialog
        open={openSelectionDialog}
        onClose={() => setOpenSelectionDialog(false)}
      />
    </>
  );
}
