import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  next: {
    entry: [
      'src/app/**/page.{js,jsx,ts,tsx}',
      'src/app/**/layout.{js,jsx,ts,tsx}',
      'src/app/**/route.{js,jsx,ts,tsx}',
      'src/middleware.ts',
    ],
  },
  ignore: [
    '**/*.d.ts',
    'open-next.config.ts',
    'src/db/core/types.ts',
    'src/db/core/schemas.zod.ts',
    'src/components/ui/primitives/**', // shadcn/ui のプリミティブは一式保持
  ],
  ignoreDependencies: [
    'concurrently',
    'postcss',
    'tailwindcss-animate',
    'tw-animate-css',
    '@radix-ui/*', // shadcn/ui が依存する Radix UI ライブラリ
  ],
};

export default config;
