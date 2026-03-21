import dayjs from '@/lib/dayjs';
import type { DateTimeItem } from '../types';
import type { DateTimeItemSerialized } from './scheduleData';

/**
 * サーバー側のシリアライズされたDateTimeItemをクライアント側のDateTimeItemに変換
 */
export function convertDateTimeItems(serialized: DateTimeItemSerialized[]): DateTimeItem[] {
  return serialized.map((item) => ({
    date: dayjs(item.date),
    time: item.time,
    key: item.key,
  }));
}
