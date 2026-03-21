# 技術スタックと記述スタイル

## 1. Next.js / React

### App Router
全面的に採用。

### Server Components 優先
- デフォルトは Server Component で実装する
- インタラクティブな機能（フックの使用、イベントハンドラ）が必要な末端のコンポーネントのみ `'use client'` を付与する

### Server Actions
- データ取得・更新は **Server Actions** で統一する
- `app/api/` (API Routes) は原則として使用しない

## 2. TypeScript / 型定義

### Zodの活用
バリデーションスキーマは Zod で定義し、型定義は `z.infer` を使用して生成することを標準とする。

### 型定義の配置
- **基本**: コンポーネントファイル内、または同ディレクトリ内の `types.ts` に定義（コロケーション）
- **共有**: 複数の機能にまたがる型のみ `src/types/` に定義する
- **グローバル**: アプリ全体で広範に使われる型（環境変数、汎用ユーティリティ型など）のみ `src/types/index.ts` 等に定義する
