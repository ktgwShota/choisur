import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/app/contact/ContactForm';

// サーバーアクションをモック化
vi.mock('@/app/contact/actions', () => ({
  submitContactAction: vi.fn(),
}));

import { submitContactAction } from '@/app/contact/actions';

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('フォームの全フィールドが表示される', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/お名前/)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    expect(screen.getByLabelText(/件名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/お問い合わせ内容/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /送信する/ })).toBeInTheDocument();
  });

  it('必須フィールドが空の場合、バリデーションエラーが表示される', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /送信する/ });
    await user.click(submitButton);

    // バリデーションエラーが表示される（React Hook Form のバリデーション）
    await waitFor(() => {
      expect(screen.getByText(/お名前は必須です/)).toBeInTheDocument();
    });
  });


  it('お問い合わせ内容が10文字未満の場合、エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/お問い合わせ内容/);
    await user.type(messageInput, '短い');

    const submitButton = screen.getByRole('button', { name: /送信する/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/お問い合わせ内容は10文字以上で入力してください/)).toBeInTheDocument();
    });
  });

  it('フォーム送信が成功した場合、成功メッセージが表示される', async () => {
    const user = userEvent.setup();
    // サーバーアクションを成功レスポンスでモック
    vi.mocked(submitContactAction).mockResolvedValue({
      success: true,
      data: { id: 1 },
    });

    render(<ContactForm />);

    // フォームに入力
    await user.type(screen.getByLabelText(/お名前/), '山田 太郎');
    await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです');

    // 送信
    const submitButton = screen.getByRole('button', { name: /送信する/ });
    await user.click(submitButton);

    // 成功メッセージが表示される
    await waitFor(() => {
      expect(screen.getByText(/お問い合わせを受け付けました。ありがとうございます。/)).toBeInTheDocument();
    });

    // サーバーアクションが正しいデータで呼ばれたか確認
    expect(submitContactAction).toHaveBeenCalledWith({
      name: '山田 太郎',
      email: 'test@example.com',
      subject: 'テスト件名',
      message: 'これは10文字以上のテストメッセージです',
    });
  });

  it('フォーム送信が失敗した場合、エラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    // サーバーアクションを失敗レスポンスでモック
    vi.mocked(submitContactAction).mockResolvedValue({
      success: false,
      error: 'サーバーエラーが発生しました',
    });

    render(<ContactForm />);

    // フォームに入力
    await user.type(screen.getByLabelText(/お名前/), '山田 太郎');
    await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです');

    // 送信
    const submitButton = screen.getByRole('button', { name: /送信する/ });
    await user.click(submitButton);

    // エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText(/サーバーエラーが発生しました/)).toBeInTheDocument();
    });
  });

  it('送信中はボタンが無効化され、ローディング表示される', async () => {
    const user = userEvent.setup();
    // サーバーアクションを遅延させる
    let resolvePromise: (value: { success: true; data: { id: number } }) => void;
    const promise = new Promise<{ success: true; data: { id: number } }>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(submitContactAction).mockReturnValue(promise);

    render(<ContactForm />);

    // フォームに入力
    await user.type(screen.getByLabelText(/お名前/), '山田 太郎');
    await user.type(screen.getByLabelText(/メールアドレス/), 'test@example.com');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです');

    // 送信
    const submitButton = screen.getByRole('button', { name: /送信する/ });
    await user.click(submitButton);

    // 送信中はボタンが無効化される
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    // 送信完了
    resolvePromise!({ success: true, data: { id: 1 } });
    await waitFor(() => {
      // 送信成功後もボタンは無効化される（成功状態のため）
      expect(submitButton).toBeDisabled();
    });
  });

  it('送信成功後、フォームがリセットされる', async () => {
    const user = userEvent.setup();
    vi.mocked(submitContactAction).mockResolvedValue({
      success: true,
      data: { id: 1 },
    });

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/お名前/) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/メールアドレス/) as HTMLInputElement;

    await user.type(nameInput, '山田 太郎');
    await user.type(emailInput, 'test@example.com');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです');

    const submitButton = screen.getByRole('button', { name: /送信する/ });
    await user.click(submitButton);

    // 送信成功後、フォームがリセットされる
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });
});

