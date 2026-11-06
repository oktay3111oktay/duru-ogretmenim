import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const moduleRoot = process.env.CODEX_BUNDLED_NODE_MODULES ||
  'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const poppler = 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\native\\poppler\\Library\\bin\\pdftoppm.exe';
const { default: sharp } = await import(pathToFileURL(path.join(moduleRoot, 'sharp', 'dist', 'index.mjs')).href);

const repo = path.resolve(import.meta.dirname, '..');
const output = path.join(repo, 'dist', 'assets');
const temp = path.join(repo, 'tmp', 'render-v6520');
const materialRoot = 'C:\\Users\\oktay\\Desktop\\DURU\\OKUL MATERYALİ';
const sources = [
  ['Türkçe Derin Öğrenme EÇK.pdf', 'school-turkish-deep-v6520'],
  ['Nokta-Virgül.pdf', 'school-turkish-nokta-virgul-v6520'],
  ['Büyük Harflerin Kullanımı.pdf', 'school-turkish-buyuk-harf-v6520'],
  ['Deyim-Atasözü.pdf', 'school-turkish-deyim-atasozu-v6520'],
  ['İkilemeler-Pekiştirmeler.pdf', 'school-turkish-ikileme-pekistirme-v6520'],
  ['İsim - Fiil Ayrımı.pdf', 'school-turkish-isim-fiil-v6520']
];

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let error = '';
    child.stderr.on('data', chunk => { error += chunk; });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}: ${error}`)));
  });
}

await fs.mkdir(output, { recursive: true });
await fs.mkdir(temp, { recursive: true });
const manifest = [];

for (const [fileName, slug] of sources) {
  const pdf = path.join(materialRoot, fileName);
  await fs.access(pdf);
  const prefix = path.join(temp, slug);
  await run(poppler, ['-jpeg', '-r', '115', '-jpegopt', 'quality=82', pdf, prefix]);
  const rendered = (await fs.readdir(temp))
    .filter(name => name.startsWith(`${slug}-`) && name.endsWith('.jpg'))
    .sort((a, b) => Number(a.match(/-(\d+)\.jpg$/)?.[1]) - Number(b.match(/-(\d+)\.jpg$/)?.[1]));
  for (let index = 0; index < rendered.length; index += 1) {
    const page = index + 1;
    const input = path.join(temp, rendered[index]);
    const target = path.join(output, `${slug}-p-${page}.webp`);
    await sharp(input).resize({ width: 1050, withoutEnlargement: true }).webp({ quality: 72, effort: 5 }).toFile(target);
  }
  manifest.push({ fileName, slug, pages: rendered.length });
}

await fs.writeFile(path.join(repo, 'tmp', 'school-assets-v6520.json'), JSON.stringify(manifest, null, 2));
process.stdout.write(`${JSON.stringify(manifest)}\n`);
