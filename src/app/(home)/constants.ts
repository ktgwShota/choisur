export const COLORS = {
  // Brand Colors
  PRIMARY: '#2563eb', // ロイヤルブルー (信頼感) - Main Actions, Hero, Links
  PRIMARY_LIGHT: '#dbeafe', // 薄いブルー (背景アクセント)

  // Accents (Used for specific features/services)
  ACCENT_CYAN: '#0ea5e9', // スカイブルー
  /** indigo-500 相当。hex だと CSR で rgb に正規化され React 19 の style ハイドレーションとずれるため rgb 固定 */
  ACCENT_INDIGO: 'rgb(99, 102, 241)',
  /** violet-500 相当。同上 */
  ACCENT_PURPLE: 'rgb(139, 92, 246)',
  ACCENT_ORANGE: '#f97316', // オレンジ (HowToUse: Poll)

  // Backgrounds
  BG_LIGHT: '#ffffff', // 純白の背景
  BG_GRAY: '#f8fafc', // わずかにグレーな背景
  BG_DARK: '#1e293b', // ダークセクション背景 (About, HowToUse)
  BG_DARK_LIGHT: '#334155', // ダークモード上のカード/ボタン背景 (Slate 700)

  // Text
  TEXT_MAIN: '#0f172a', // Slate 900 (見出し, 重要テキスト)
  TEXT_SUB: '#475569', // Slate 600 (本文, 補足)
  TEXT_ON_DARK: '#ffffff', // 白 (ダークモード見出し)
  TEXT_SUB_ON_DARK: '#cbd5e1', // Slate 300 (ダークモード本文)
  TEXT_MUTED: '#94a3b8', // Slate 400 (無効化, 控えめなラベル)

  // UI Elements
  BORDER: '#cbd5e1', // Slate 300 (標準枠線)
  BORDER_LIGHT: '#e2e8f0', // Slate 200 (薄い枠線 - カード等)
  CARD_BG: '#ffffff', // カード背景
  SHADOW_COLOR: 'rgba(0, 0, 0, 0.1)', // 汎用シャドウ
};

/** シード用固定 ID（`migrations/schema.sql` のデモセクションと同一。polls / schedules の主キーはどちらも `demo`） */
export const DEMO_IDS = {
  POLL: 'demo',
  SCHEDULE: 'demo',
} as const;

/** トップの FAQ セクションに表示する件数（それ以外は /faq で一覧） */
export const FAQ_HOME_PREVIEW_COUNT = 4;

export const FAQ_ITEMS = [
  {
    question: '会員登録は必要ですか？',
    answer: '会員登録は不要です。どなたでもご利用いただけます。',
  },
  {
    question: '利用料金はかかりますか？',
    answer: 'すべての機能を無料でご利用いただけます。',
  },
  {
    question: '対応しているブラウザを教えてください。',
    answer:
      'Safari および Google Chrome の最新版に対応しています。その他のブラウザでも動作する場合がありますが、動作保証の対象外です。',
  },
  {
    question: '利用制限はありますか？',
    answer:
      '基本的にはございません。ただし、当サービスや他の利用者への影響を避けるため、サーバーやアクセスに過度の負担を与えるようなご利用があった場合、利用を制限することがあります。',
  },
  {
    question: 'パスワードをかけて参加者以外に見られないようにできますか？',
    answer:
      '現在はパスワードでの保護には対応していません。共有したURLを開ける方なら、会員登録なしで内容を閲覧できる状態です。内容を限られた方だけに見せたい場合は、ご利用をお控えください。パスワードによる閲覧制限は、今後のアップデートで追加する予定です。',
  },
];
