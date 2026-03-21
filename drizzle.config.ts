import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/core/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/b955db992c1f4e11714c58fdca2fcfde49526e9122f6961fc6ea1118edaea5c3.sqlite',
  },
});
