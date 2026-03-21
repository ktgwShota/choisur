## 🚀 技術スタック

### ⚛️ コア
- **TypeScript 5.9.3**  
- **React 19.2.3**  
- **Next.js 15.1.4**  

---

### ☁️ インフラ
- **Cloudflare Workers**  
- **Cloudflare D1**  
- **OpenNext**  
- **Wrangler**  

---

### 🗃️ ORM
- **Drizzle ORM**  
- **Drizzle Kit**  
- **Drizzle Zod**  
---

### 🧩 状態管理
- **Zustand**  

---

### 🧾 フォーム / バリデーション
- **React Hook Form**  
- **Zod**  

---

### 🎨 UI / デザイン
- **shadcn/ui**  
- **Radix UI**  
- **Tailwind CSS 4**  

---

### 🛠️ テスト
- **Playwright**  
- **Vitest**  
- **React Testing Library**  

---

### 🛠️ 品質管理
- **Biome**  
- **Knip**  

---

## 📊 アーキテクチャ

### レイヤード構造
アプリケーションは以下の責務で分離されています。

1. **UI Layer (`app/`, `components/`)**: ReactコンポーネントとNext.js Pages。
2. **Action Layer (`**/actions.ts`)**: Server Actions。UIとService Layerの仲介役。
3. **Service Layer (`src/db/services/`)**: ビジネスロジック。Drizzle ORMを使用したDB操作。
4. **Validation Layer (`src/db/validation/`)**: Zodによる入力バリデーション。
5. **Data Layer (`src/db/core/`)**: Drizzleのスキーマ定義と接続設定。

### リクエスト処理フロー
```
Cloudflare Worker (Entrypoint)
    ↓
.open-next/worker.js (OpenNext Generated)
    ↓
Next.js App Router / Server Actions
    ↓
Service Layer (Drizzle ORM)
    ↓
D1 Database Access (via Binding)
```

---

## � ディレクトリ構造

```
src/
├── app/                  # Next.js App Router (ページ、Server Actions)
│   ├── (home)/          # トップページのコンポーネント
│   ├── polls/           # 多数決機能
│   └── schedule/        # 日程調整機能
├── components/           # 共通 React コンポーネント (UIパーツ)
├── db/                   # データベース関連
│   ├── core/            # スキーマ定義、接続設定 (drizzle.ts)
│   ├── services/        # DBアクセス・ビジネスロジック (ORM操作)
│   └── validation/      # バリデーションスキーマ (Zod / drizzle-zod)
├── hooks/                # カスタム React Hooks
├── lib/                  # 外部ライブラリの設定・初期化 (MUI, Dayjs)
├── stores/               # Zustand による状態管理
├── types/                # 共通型定義
└── utils/                # 汎用的な純粋関数 (日付, OGP, URL, Styles)
```

### 開発ルール
- `lib` は「外部ライブラリの設定（初期化）」のみを置きます（例: `lib/dayjs.ts` で日本語化設定）。
- `utils` は「アプリ独自の処理（純粋関数）」を置きます（例: `utils/date.ts` でフォーマット処理）。
- **DB操作**: 直接 `app` や `actions` で `drizzle` を叩かず、必ず `src/db/services` 経由で行います。

---

## 🛠️ セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数（リモートデプロイ・stg/prd DB 操作時）

`wrangler.jsonc` の stg/prd 用 D1 ID は `.env` から読み込みます。

```bash
cp .env.example .env
# D1_DATABASE_ID_STG / D1_DATABASE_ID_PRD を Cloudflare ダッシュボードの値に設定
```

管理画面用 Basic 認証（ローカルの `dev:cf` など）は `.dev.vars` に設定します。

```bash
cp .dev.vars.example .dev.vars
```

### 3. ローカルデータベースの準備

ローカル開発用のD1データベース（SQLite）を作成し、スキーマを適用します。

```bash
npm run db:setup
```

### 4. 開発サーバーの起動

**A. フロントエンド先行開発 (高速)**
UIやアニメーションの実装に適しています。
※ D1への実際の保存は行われません（モック推奨）。

```bash
npm run dev
# -> http://localhost:3000
```

**B. API / データベース連携開発**
Cloudflare Pages 互換モードで起動します。ローカルD1データベースに実際に接続して動作確認ができます。

```bash
npm run dev:cf
# -> http://localhost:8788
```

---

## 🗄️ データベース操作

### マイグレーションの管理
Drizzle Kitを使用してスキーマの変更を管理します。

```bash
# スキーマ変更からマイグレーションファイルを生成
npx drizzle-kit generate

# マイグレーションをローカルDBに適用
npm run db:setup
```

### デバッグ
```bash
# 任意のSQLを実行
npm run db:query -- "SELECT * FROM polls LIMIT 5"
```

---

## � 利用可能なコマンド

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | フロントエンド開発サーバー起動 (Next.js) |
| `npm run dev:cf` | Cloudflare 互換の開発サーバー起動 |
| `npm run build:cf` | Cloudflare 向けのビルド実行 |
| `npm run deploy:prd` | 本番環境 (Production) へのデプロイ |
| `npm run db:setup` | ローカルDBの作成・初期化 |
| `npm run db:reset` | ローカルDBの完全初期化 |
| `npm run check:fix` | Biome による一括コード修正 (Lint, Format, Imports) |
| `npm run knip` | 未使用コードの検出 |
| `npm run cf-typegen` | Cloudflare の型定義自動生成 |

### 開発
| コマンド | 説明 |
| --- | --- |
| `npm run dev` | フロントエンド開発サーバー起動 (Next.js) |
| `npm run dev:cf` | Cloudflare 互換の開発サーバー起動 |
| `npm run build:cf` | Cloudflare 向けのビルド実行 |
| `npm run preview` | ビルド後のプレビュー起動 |

### デプロイ
| コマンド | 説明 |
| --- | --- |
| `npm run deploy:stg` | ステージング環境へのデプロイ |
| `npm run deploy:prd` | 本番環境へのデプロイ |

### データベース
| コマンド | 説明 |
| --- | --- |
| `npm run db:setup` | ローカルDBの作成・初期化 |
| `npm run db:setup:stg` | ステージング環境DBのセットアップ |
| `npm run db:setup:prd` | 本番環境DBのセットアップ |
| `npm run db:query` | ローカルDBへのSQLクエリ実行 |
| `npm run db:reset` | ローカルDBの完全初期化 |

### テスト
| コマンド | 説明 |
| --- | --- |
| `npm run test:e2e` | Playwright E2E テスト実行 |
| `npm run test:e2e -- --project=chromium` | Chromium のみ（CI と同じ） |
| `npm run test:e2e -- --ui` | Playwright UI モード |
| `npm run test:unit` | Vitest で `tests/unit` を実行 |
| `npm run test:integration` | Vitest で `tests/integration` を実行 |
| `npm run test:vitest` | Vitest を既定設定で起動（例: `npm run test:vitest -- --watch` / `--ui` / `--coverage`） |
| `npm run test:report` | Playwright テストレポート表示 |

### コード品質
| コマンド | 説明 |
| --- | --- |
| `npm run lint` | Biome によるリントチェック |
| `npm run lint:fix` | Biome によるリント修正 |
| `npm run format` | Biome によるフォーマット |
| `npm run check` | Biome による一括チェック |
| `npm run check:fix` | Biome による一括コード修正 (Lint, Format, Imports) |
| `npm run knip` | 未使用コードの検出 |

### その他
| コマンド | 説明 |
| --- | --- |
| `npm run cf-typegen` | Cloudflare の型定義自動生成 |
