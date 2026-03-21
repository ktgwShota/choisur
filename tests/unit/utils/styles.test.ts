import { describe, expect, it } from 'vitest';
import { cn, getResponsiveValue } from '@/utils/styles';

describe('getResponsiveValue', () => {
  it('returns a clamp() string with rem and vw', () => {
    const s = getResponsiveValue(20, 40);
    expect(s).toMatch(/^clamp\(/);
    expect(s).toContain('rem');
    expect(s).toContain('vw');
  });

  it('respects custom viewport bounds when autoScale is true', () => {
    const s = getResponsiveValue(10, 30, 400, 800, true);
    expect(s).toMatch(/^clamp\(/);
    expect(s).toContain('rem');
  });
});

describe('cn', () => {
  it('merges tailwind classes with later conflicts winning', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles conditional falsy values', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });
});
