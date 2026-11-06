import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const moduleRoot = process.env.CODEX_BUNDLED_NODE_MODULES ||
  'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const poppler = 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\native\\poppler\\Library\\bin\\pdftoppm.exe';
const { default: sharp } = await import(pathToFileURL(path.join(moduleRoot, 'sharp', 'dist', 'index.mjs')).href);

const repo = path.resolve(import.meta.dirname, '..');
const pdf = 'C:\\Users\\oktay\\Desktop\\DURU\\Türkçe\\Türkçe - 2.pdf';
const temp = path.join(repo, 'tmp', 'meb-turkish-v6520');
const prefix = path.join(temp, 'book2-page104');
const target = path.join(repo, 'dist', 'assets', 'meb-turkish-v6520-b2-p-104.webp');

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let error = '';
    child.stderr.on('data', chunk => { error += chunk; });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}: ${error}`)));
  });
}

await fs.mkdir(temp, { recursive: true });
// The PDF has one unnumbered front page, so printed page 104 is physical page 105.
await run(poppler, ['-f', '105', '-l', '105', '-singlefile', '-jpeg', '-r', '140', '-jpegopt', 'quality=88', pdf, prefix]);
await sharp(`${prefix}.jpg`).resize({ width: 1050, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(target);
process.stdout.write(`${target}\n`);
