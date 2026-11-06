import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const moduleRoot = process.env.CODEX_BUNDLED_NODE_MODULES ||
  'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { default: sharp } = await import(pathToFileURL(path.join(moduleRoot, 'sharp', 'dist', 'index.mjs')).href);
const [, , input, outputDir, rowsText = '4', colsText = '2'] = process.argv;
if (!input || !outputDir) process.exit(2);
const rows = Number(rowsText), cols = Number(colsText), meta = await sharp(input).metadata();
await fs.mkdir(outputDir, { recursive: true });
for (let row = 0; row < rows; row += 1) {
  for (let col = 0; col < cols; col += 1) {
    const left = Math.floor((meta.width * col) / cols), top = Math.floor((meta.height * row) / rows);
    const right = Math.floor((meta.width * (col + 1)) / cols), bottom = Math.floor((meta.height * (row + 1)) / rows);
    await sharp(input).extract({ left, top, width: right - left, height: bottom - top }).png()
      .toFile(path.join(outputDir, `${path.parse(input).name}-r${row + 1}-c${col + 1}.png`));
  }
}
