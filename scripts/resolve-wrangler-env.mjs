import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = join(root, 'wrangler.jsonc');
const outputPath = join(root, '.wrangler', 'wrangler.resolved.jsonc');

for (const envFile of ['.env', '.env.local']) {
  try {
    loadEnvFile(join(root, envFile));
  } catch {
    // optional
  }
}

const source = readFileSync(sourcePath, 'utf8');
const resolved = source.replace(/\$\{([A-Z][A-Z0-9_]*)\}/g, (_, name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `環境変数 ${name} が未設定です。.env に設定してください（.env.example を参照）。`
    );
  }
  return value;
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, resolved);

console.log(`Wrangler config resolved: ${outputPath}`);
