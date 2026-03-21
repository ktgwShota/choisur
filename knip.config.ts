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
    'src/components/shared/primitives/**',
    // 将来利用予定のコンポーネント・ストア
    'src/components/shared/dialogs/ErrorDialog.tsx',
    'src/components/shared/forms/DateTimePicker.tsx',
    'src/components/shared/others/LinkNotification.tsx',
    'src/components/shared/others/Tutorial.tsx',
    'src/stores/useTutorialStore.ts',
    'src/app/polls/[id]/components/shared/PasswordDialog.tsx',
  ],
  ignoreDependencies: [
    'concurrently',
    'postcss',
    'tailwindcss-animate',
    'tw-animate-css',
    '@radix-ui/*',
  ],
};

export default config;
