import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const moduleRoot = process.env.CODEX_BUNDLED_NODE_MODULES ||
  'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const require = createRequire(path.join(moduleRoot, '__codex_ocr__.cjs'));
const { createWorker, PSM } = require('tesseract.js');

const [, , outputFile, ...inputFiles] = process.argv;
if (!outputFile || !inputFiles.length) {
  console.error('Usage: node tools/ocr-images-v6520.mjs <output.json> <input-image> [...]');
  process.exit(2);
}

const worker = await createWorker('tur', undefined, {
  logger: status => {
    if (status.status === 'recognizing text' && status.progress === 1) return;
    if (status.status !== 'recognizing text') console.error(`${status.status}${status.progress != null ? ` ${Math.round(status.progress * 100)}%` : ''}`);
  },
});
await worker.setParameters({
  tessedit_pageseg_mode: PSM.AUTO,
  preserve_interword_spaces: '1',
});

const pages = [];
for (const inputFile of inputFiles) {
  const result = await worker.recognize(inputFile);
  pages.push({
    file: path.resolve(inputFile),
    name: path.basename(inputFile),
    confidence: result.data.confidence,
    text: result.data.text,
  });
  console.error(`${path.basename(inputFile)}: ${Math.round(result.data.confidence)}% confidence, ${result.data.text.length} chars`);
}
await worker.terminate();

await fs.mkdir(path.dirname(path.resolve(outputFile)), { recursive: true });
await fs.writeFile(outputFile, JSON.stringify({ generatedAt: new Date().toISOString(), pages }, null, 2), 'utf8');
