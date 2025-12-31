import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputField from '@/components/shared/forms/InputField';

describe('InputField', () => {
  it('ラベルが正しく表示される', () => {
    render(
      <InputField
        label="テストラベル"
        value=""
        onChange={() => { }}
      />
    );
    expect(screen.getByText('テストラベル')).toBeInTheDocument();
  });

  it('必須マーカーが表示される', () => {
    render(
      <InputField
        label="必須項目"
        value=""
        onChange={() => { }}
        required
      />
    );
    const label = screen.getByText('必須項目');
    expect(label).toBeInTheDocument();
    // 必須マーカー（*）が表示されているか確認
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('入力値が正しく表示される', () => {
    render(
      <InputField
        label="テスト"
        value="入力された値"
        onChange={() => { }}
      />
    );
    const input = screen.getByDisplayValue('入力された値');
    expect(input).toBeInTheDocument();
  });

  it('onChangeが呼び出される', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <InputField
        name="test-input"
        label="テスト"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');

    expect(handleChange).toHaveBeenCalled();
  });

  it('エラーメッセージが表示される', () => {
    render(
      <InputField
        label="テスト"
        value=""
        onChange={() => { }}
        error="エラーメッセージ"
      />
    );
    expect(screen.getByText('エラーメッセージ')).toBeInTheDocument();
  });

  it('文字数カウントが表示される', () => {
    render(
      <InputField
        label="テスト"
        value="テスト"
        onChange={() => { }}
        maxLength={10}
        showCharCount
      />
    );
    // 文字数カウントが表示される（3/10 の形式、「テスト」は3文字）
    expect(screen.getByText(/3\/10/)).toBeInTheDocument();
  });

  it('standardモードでラベルが上部に表示される', () => {
    render(
      <InputField
        label="標準ラベル"
        value=""
        onChange={() => { }}
        behavior="standard"
      />
    );
    const label = screen.getByText('標準ラベル');
    expect(label).toBeInTheDocument();
    // standardモードではラベルがinputの上に表示される
    expect(label.tagName).toBe('LABEL');
  });

  it('notchedモードでラベルがボーダー上に表示される', () => {
    render(
      <InputField
        label="ノッチラベル"
        value=""
        onChange={() => { }}
        behavior="notched"
      />
    );
    // notchedモードでもラベルは表示される
    expect(screen.getByText('ノッチラベル')).toBeInTheDocument();
  });

  it('プレースホルダーが表示される', () => {
    render(
      <InputField
        label="テスト"
        value=""
        onChange={() => { }}
        placeholder="プレースホルダー"
      />
    );
    expect(screen.getByPlaceholderText('プレースホルダー')).toBeInTheDocument();
  });

  it('maxLengthが正しく適用される', () => {
    render(
      <InputField
        name="test-input"
        label="テスト"
        value=""
        onChange={() => { }}
        maxLength={5}
      />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.maxLength).toBe(5);
  });
});

