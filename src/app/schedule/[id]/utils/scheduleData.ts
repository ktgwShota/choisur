import dayjs from '@/lib/dayjs';
import { calculateScore, calculateSummary, getDateTimeKey, type Response } from '../types';

interface DateOption {
  date: string;
  times: string[];
}

// サーバー側で使用する型（dateは文字列）
export interface DateTimeItemSerialized {
  date: string; // ISO形式の文字列
  time?: string;
  key: string;
}

export function processScheduleData(dates: DateOption[], responses: Response[]) {
  // 全日程をフラット化（dateは文字列として保存）
  const allDateTimes: DateTimeItemSerialized[] = [];
  for (const dateOption of dates) {
    const dateStr = dateOption.date; // 既に文字列
    if (dateOption.times.length > 0) {
      for (const time of dateOption.times) {
        const date = dayjs(dateStr);
        allDateTimes.push({ date: dateStr, time, key: getDateTimeKey(date, time) });
      }
    } else {
      const date = dayjs(dateStr);
      allDateTimes.push({ date: dateStr, key: getDateTimeKey(date) });
    }
  }

  // ソート（文字列として比較）
  const sorted = allDateTimes.sort((a, b) => {
    const dateA = dayjs(a.date);
    const dateB = dayjs(b.date);
    if (dateA.isBefore(dateB)) return -1;
    if (dateA.isAfter(dateB)) return 1;
    const timeA = a.time || '';
    const timeB = b.time || '';
    return timeA.localeCompare(timeB);
  });

  // Best日程を計算
  let bestKeys = new Set<string>();
  if (responses.length > 0) {
    const scores = sorted.map(({ key }) => {
      const summary = calculateSummary(key, responses);
      return { key, score: calculateScore(summary.available, summary.maybe) };
    });
    const maxScore = Math.max(...scores.map((s) => s.score));
    bestKeys = new Set(scores.filter((s) => s.score === maxScore && s.score > 0).map((s) => s.key));
  }

  return {
    allDateTimes: sorted,
    bestKeys,
  };
}

export function sortDateTimesByConfirmed(
  allDateTimes: DateTimeItemSerialized[],
  confirmedDateTime: string | null
) {
  return [...allDateTimes].sort((a, b) => {
    if (a.key === confirmedDateTime) return -1;
    if (b.key === confirmedDateTime) return 1;
    return 0;
  });
}
