import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS クラス名をマージするユーティリティ関数
 * @param inputs - マージするクラス名（文字列、配列、オブジェクトなど）
 * @returns マージされたクラス名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * CSS clamp() を生成するユーティリティ関数
 * 基本的には第一引数と第二引数のみ使用する。20-40 の範囲外で使用する場合はスケーリング速度の関係で autoScale = true にして使用する
 *
 * ----------------------------------------
 * デフォルト挙動（autoScale = false）
 * ----------------------------------------
 * 固定スケーリング速度を使用
 *
 * 320px → 20px
 * 900px → 40px
 *
 * minPx / maxPx は clamp の上下限としてのみ使用される
 *
 * ----------------------------------------
 * autoScale = true の場合
 * ----------------------------------------
 * minWidth → minPx
 * maxWidth → maxPx
 *
 * を結ぶ直線でスケーリング速度を自動計算
 *
 * @param minPx - clamp の最小値（px）
 * @param maxPx - clamp の最大値（px）
 * @param minWidth - 最小ビューポート幅（px, default: 320）
 * @param maxWidth - 最大ビューポート幅（px, default: 900）
 * @param autoScale - true の場合、min/max からスケーリング速度を自動計算（default: false）
 *
 * @returns CSS clamp() 文字列
 */
export const getResponsiveValue = (
  minPx: number,
  maxPx: number,
  minWidth = 320,
  maxWidth = 900,
  autoScale = false
): string => {
  const rootFontSize = 16; // 1rem = 16px

  // clamp 用の上下限（rem）
  const minRem = +(minPx / rootFontSize).toFixed(3);
  const maxRem = +(maxPx / rootFontSize).toFixed(3);

  /**
   * --------------------------------
   * スケーリング基準値の決定
   * --------------------------------
   */
  const BASE_MIN_PX = 20;
  const BASE_MAX_PX = 40;

  const scaleMinPx = autoScale ? minPx : BASE_MIN_PX;
  const scaleMaxPx = autoScale ? maxPx : BASE_MAX_PX;

  /**
   * --------------------------------
   * 傾き（スケーリング速度）の計算
   * --------------------------------
   */
  const slope = (scaleMaxPx - scaleMinPx) / (maxWidth - minWidth);

  // vw 単位に変換（100vw = viewport 幅）
  const slopeVw = +(slope * 100).toFixed(3);

  /**
   * --------------------------------
   * 切片の計算
   * minWidth 時点で scaleMinPx になる直線
   * --------------------------------
   */
  const interceptPx = scaleMinPx - slope * minWidth;
  const interceptRem = +(interceptPx / rootFontSize).toFixed(3);

  const sign = interceptRem >= 0 ? '+' : '-';
  const absInterceptRem = Math.abs(interceptRem);

  /**
   * clamp の順序を保証
   */
  const lower = Math.min(minRem, maxRem);
  const upper = Math.max(minRem, maxRem);

  return `clamp(${lower}rem, ${slopeVw}vw ${sign} ${absInterceptRem}rem, ${upper}rem)`;
};
