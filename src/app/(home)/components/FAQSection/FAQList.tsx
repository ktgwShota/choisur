'use client';

import React from 'react';
import { FAQ_ITEMS } from '@/app/(home)/constants';
import ScrollReveal from '@/components/shared/motions/ScrollReveal';
import { Accordion } from '@/components/shared/primitives/accordion';
import FAQAccordionItem from './FAQAccordionItem';

type FAQListItem = { question: string; answer: string };

type FAQListProps = {
  items?: FAQListItem[];
  animate?: boolean;
};

export default function FAQList({ items = FAQ_ITEMS, animate = true }: FAQListProps) {
  const [value, setValue] = React.useState<string>('');

  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={setValue}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
    >
      {items.map((item, index) => {
        const itemKey = item.question;
        return animate ? (
          <ScrollReveal
            key={itemKey}
            mode="pop"
            direction="up"
            distance={16}
            delay={index * 0.08}
            duration={0.5}
            className="min-w-0"
          >
            <FAQAccordionItem item={item} index={index} />
          </ScrollReveal>
        ) : (
          <div key={itemKey} className="min-w-0">
            <FAQAccordionItem item={item} index={index} />
          </div>
        );
      })}
    </Accordion>
  );
}
