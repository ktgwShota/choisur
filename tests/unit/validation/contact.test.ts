import { describe, expect, it } from 'vitest';
import { contactFormSchema } from '@/db/validation/contact';

describe('contactFormSchema', () => {
  const valid = {
    name: '山田太郎',
    email: 'yamada@example.com',
    subject: '件名',
    message: '1234567890', // 10 chars
  };

  it('accepts valid input', () => {
    const r = contactFormSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it('rejects empty name', () => {
    const r = contactFormSchema.safeParse({ ...valid, name: '' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.flatten().fieldErrors.name?.[0]).toBe('お名前は必須です');
    }
  });

  it('rejects invalid email', () => {
    const r = contactFormSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.flatten().fieldErrors.email?.[0]).toBe(
        '有効なメールアドレスを入力してください'
      );
    }
  });

  it('rejects message shorter than 10 characters', () => {
    const r = contactFormSchema.safeParse({ ...valid, message: '123456789' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.flatten().fieldErrors.message?.[0]).toBe(
        'お問い合わせ内容は10文字以上で入力してください'
      );
    }
  });
});
