import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SectionContainer from '@/app/(home)/components/SectionContainer';
import ScrollReveal from '@/components/shared/motions/ScrollReveal';
import { getResponsiveValue } from '@/utils/styles';
import { COLORS, FAQ_HOME_PREVIEW_COUNT, FAQ_ITEMS } from '../../constants';
import FAQList from './FAQList';

export default function FaqSection() {
  const marginBottom = getResponsiveValue(32, 40, 320, 600);

  return (
    <div id="faq" className="overflow-hidden" style={{ backgroundColor: COLORS.BG_LIGHT }}>
      <SectionContainer
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <ScrollReveal mode="pop" direction="up" distance={16} duration={0.5} viewportAmount={0.5}>
          <div
            className="mx-auto w-full text-center sm:text-center"
            style={{
              maxWidth: '960px',
              marginBottom,
            }}
          >
            <h2
              className="font-extrabold leading-none tracking-wide"
              style={{
                color: COLORS.TEXT_MAIN,
                fontSize: 'clamp(1rem, 1.25rem + 2vw, 1.3rem)',
              }}
            >
              よくある質問
            </h2>
            <div className="mx-auto mt-5 flex justify-center sm:mx-auto">
              <span className="h-0.5 w-20 rounded-full bg-indigo-500 sm:w-24" />
            </div>
          </div>
        </ScrollReveal>

        <FAQList items={FAQ_ITEMS.slice(0, FAQ_HOME_PREVIEW_COUNT)} />

        <ScrollReveal
          mode="pop"
          direction="up"
          distance={12}
          duration={0.4}
          delay={0.2}
          viewportAmount={0.3}
        >
          <div className="mt-8 flex justify-end md:mt-10">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 font-semibold text-indigo-500 text-sm"
            >
              すべての質問を見る
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </ScrollReveal>
      </SectionContainer>
    </div>
  );
}
