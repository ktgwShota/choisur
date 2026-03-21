import { describe, expect, it } from 'vitest';
import { validateUrl } from '@/utils/url';

describe('validateUrl', () => {
  it('空・空白のみは null（エラーなし）', () => {
    expect(validateUrl('')).toBeNull();
    expect(validateUrl('   ')).toBeNull();
  });

  it('有効な絶対 URL は null', () => {
    expect(validateUrl('https://example.com/path?q=1')).toBeNull();
  });

  it('不正な文字列はエラーメッセージ', () => {
    expect(validateUrl('not a url')).toBe('正しい URL を入力してください');
  });
});
