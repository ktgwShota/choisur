import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BasicPageTitle from '@/components/shared/headings/BasicPageTitle';

describe('BasicPageTitle', () => {
  it('子要素を h1 で描画する', () => {
    render(<BasicPageTitle>ページタイトル</BasicPageTitle>);
    const h1 = screen.getByRole('heading', { level: 1, name: 'ページタイトル' });
    expect(h1).toBeInTheDocument();
  });
});
