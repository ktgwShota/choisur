'use client';

import { useEffect, useState } from 'react';

import { getResponsiveValue } from '@/utils/styles';
import CalendarCard from './CalendarCard';

export default function FloatingCalendarVisual() {
  const [isDecided, setIsDecided] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsDecided(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    { date: '12/19', day: 'Fri', id: 1, votes: ['ok', 'ng', 'ok', 'ng', 'ok', 'maybe'] },
    { date: '12/20', day: 'Sat', id: 2, votes: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok'] }, // Winner
    { date: '12/21', day: 'Sun', id: 3, votes: ['ok', 'ok', 'ng', 'ok', 'maybe', 'ng'] },
    { date: '12/22', day: 'Mon', id: 4, votes: ['ok', 'maybe', 'ok', 'ng', 'maybe', 'ok'] },
  ];

  return (
    <div className="tems-center flex justify-center">
      <div
        className="grid grid-cols-2 justify-center"
        style={{
          gap: getResponsiveValue(20, 40, 320, 600),
        }}
      >
        {cards.map((card, index) => (
          <CalendarCard key={card.id} data={card} isDecided={isDecided} index={index} />
        ))}
      </div>
    </div>
  );
}
