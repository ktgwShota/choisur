# ディレクトリ構成と命名規則

## 1. コンポーネントの配置 (Colocation)

「機能単位のコロケーション」を推奨する。

### 特定機能/ページ専用
`src/app/(機能ディレクトリ)/components/`
- その機能でしか使わないコンポーネントは、使用するページの近くに配置する

### 全社共通
`src/components/`
- アプリ全体で汎用的に使われる独自コンポーネント（Shadcnラッパー含む）はここに配置する
- Shadcnラッパーの命名は、Shadcnの元コンポーネント名と被らないようにする
  - 例: Shadcnの `Button` に対し、ラッパーは `AppButton` や機能名プレフィックス付きなど、明確に区別可能な名称にする

## 2. ファイル分割と初期化

- `src/lib/`: 外部ライブラリの初期化コード、設定ファイルなどを配置
- `src/utils/`: 純粋な関数（ロジックのみ、副作用なし）を配置

## 3. 命名規則

- **Component File**: `PascalCase.tsx` (例: `DateSelector.tsx`)
- **Hook File**: `useCamelCase.ts` (例: `useDateSelection.ts`)
- **Utility File**: `kebab-case.ts` (例: `date-utils.ts`)
