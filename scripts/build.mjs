import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const srcDir = resolve(root, 'src');
const distDir = resolve(root, 'dist');

if (!existsSync(srcDir)) {
  console.error('No existe la carpeta src/.');
  process.exit(1);
}

if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

mkdirSync(distDir, { recursive: true });
cpSync(srcDir, distDir, { recursive: true });

console.log('Build completado: src/ copiado a dist/.');
