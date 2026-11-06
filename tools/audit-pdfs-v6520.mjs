import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const moduleRoot = process.env.CODEX_BUNDLED_NODE_MODULES ||
  'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const pdfjs = await import(pathToFileURL(path.join(moduleRoot, 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs')).href);

const [, , outputFile, ...inputFiles] = process.argv;
if (!outputFile || !inputFiles.length) {
  console.error('Usage: node tools/audit-pdfs-v6520.mjs <output.json> <input.pdf> [...]');
  process.exit(2);
}

const normalize = value => String(value || '')
  .replace(/\u00ad/g, '')
  .replace(/\s+([,.;:!?])/g, '$1')
  .replace(/\s+/g, ' ')
  .trim();

const results = [];
for (const inputFile of inputFiles) {
  const data = new Uint8Array(await fs.readFile(inputFile));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true, disableFontFace: true }).promise;
  const pages = [];
  let textCharacters = 0;
  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = normalize(content.items.map(item => item.str).join(' '));
    textCharacters += text.length;
    pages.push({ page: pageNumber, text });
  }
  results.push({
    file: path.resolve(inputFile),
    name: path.basename(inputFile),
    pages: doc.numPages,
    textCharacters,
    averageCharactersPerPage: Math.round(textCharacters / Math.max(1, doc.numPages)),
    pageText: pages,
  });
  console.error(`${path.basename(inputFile)}: ${doc.numPages} pages, ${textCharacters} text characters`);
}

await fs.mkdir(path.dirname(path.resolve(outputFile)), { recursive: true });
await fs.writeFile(outputFile, JSON.stringify({ generatedAt: new Date().toISOString(), files: results }, null, 2), 'utf8');
