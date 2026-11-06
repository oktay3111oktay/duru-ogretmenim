import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const moduleRoot = process.env.CODEX_BUNDLED_NODE_MODULES ||
  'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { default: sharp } = await import(pathToFileURL(path.join(moduleRoot, 'sharp', 'dist', 'index.mjs')).href);

const [, , outputDirectory, heightText, ...inputFiles] = process.argv;
const cropHeight = Math.max(1, Number(heightText) || 240);
if (!outputDirectory || !inputFiles.length) {
  console.error('Usage: node tools/crop-bottom-v6520.mjs <output-dir> <height> <input...>');
  process.exit(2);
}
await fs.mkdir(outputDirectory, { recursive: true });
for (const inputFile of inputFiles) {
  const meta = await sharp(inputFile).metadata();
  const height = Math.min(cropHeight, meta.height || cropHeight);
  const output = path.join(outputDirectory, `${path.parse(inputFile).name}-bottom.png`);
  await sharp(inputFile).extract({ left: 0, top: Math.max(0, (meta.height || height) - height), width: meta.width, height }).png().toFile(output);
}
