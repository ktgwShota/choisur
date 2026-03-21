import { describe, expect, it } from 'vitest';
import type { Response } from '@/app/schedule/[id]/types';
import {
  processScheduleData,
  sortDateTimesByConfirmed,
} from '@/app/schedule/[id]/utils/scheduleData';

describe('processScheduleData', () => {
  it('候補日時をフラット化し bestKeys を付ける', () => {
    const dates = [
      { date: '2026-06-15', times: ['19:00', '12:00'] },
      { date: '2026-06-16', times: ['10:00'] },
    ];
    const key1519 = '2026-06-15-19:00';
    const key1512 = '2026-06-15-12:00';
    const key1610 = '2026-06-16-10:00';

    const responses: Response[] = [
      {
        name: 'A',
        availability: {
          [key1519]: 'available',
          [key1512]: 'available',
          [key1610]: 'maybe',
        },
      },
    ];

    const { allDateTimes, bestKeys } = processScheduleData(dates, responses);

    expect(allDateTimes.map((d) => d.key)).toContain(key1519);
    expect(bestKeys.has(key1519)).toBe(true);
    expect(bestKeys.has(key1512)).toBe(true);
  });

  it('回答が空なら bestKeys は空', () => {
    const { bestKeys } = processScheduleData([{ date: '2026-06-15', times: ['19:00'] }], []);
    expect(bestKeys.size).toBe(0);
  });
});

describe('sortDateTimesByConfirmed', () => {
  it('確定キーを先頭に寄せる', () => {
    const items = [
      { date: '2026-06-16', time: '10:00', key: '2026-06-16-10:00' },
      { date: '2026-06-15', time: '19:00', key: '2026-06-15-19:00' },
    ];
    const sorted = sortDateTimesByConfirmed(items, '2026-06-15-19:00');
    expect(sorted[0]?.key).toBe('2026-06-15-19:00');
  });
});
