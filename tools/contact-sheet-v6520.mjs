import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const moduleRoot = process.env.CODEX_BUNDLED_NODE_MODULES ||
  'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { default: sharp } = await import(pathToFileURL(path.join(moduleRoot, 'sharp', 'dist', 'index.mjs')).href);

const [, , outputFile, ...inputFiles] = process.argv;
if (!outputFile || !inputFiles.length) {
  console.error('Usage: node tools/contact-sheet-v6520.mjs <output.jpg> <input...>');
  process.exit(2);
}

const columns = 4;
const width = 360;
const height = 510;
const labelHeight = 34;
const gap = 12;
const rows = Math.ceil(inputFiles.length / columns);
const canvasWidth = columns * width + (columns + 1) * gap;
const canvasHeight = rows * (height + labelHeight) + (rows + 1) * gap;
const composites = [];

for (let index = 0; index < inputFiles.length; index += 1) {
  const file = inputFiles[index];
  const left = gap + (index % columns) * (width + gap);
  const top = gap + Math.floor(index / columns) * (height + labelHeight + gap);
  const image = await sharp(file).resize({ width, height, fit: 'contain', background: '#ffffff' }).jpeg({ quality: 82 }).toBuffer();
  const label = path.basename(file).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = Buffer.from(`<svg width="${width}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#15243a"/><text x="12" y="23" font-family="Arial" font-size="17" font-weight="700" fill="white">${label}</text></svg>`);
  composites.push({ input: image, left, top }, { input: svg, left, top: top + height });
}

await fs.mkdir(path.dirname(path.resolve(outputFile)), { recursive: true });
await sharp({ create: { width: canvasWidth, height: canvasHeight, channels: 3, background: '#dce4ef' } })
  .composite(composites)
  .jpeg({ quality: 88 })
  .toFile(outputFile);
