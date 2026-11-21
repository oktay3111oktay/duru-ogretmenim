const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const stop = new Set('acaba ama ancak artık aynı başka bazı belki ben beni benim bir birçok biri biz bize bizim bu bütün çünkü da daha de değil diye en fakat gibi göre hem her hiç için ile ise kendi kadar ki kim mı mi mu mü nasıl ne neden o olan olarak oldu onun önce sen siz sonra şu tüm ve veya ya yani çok'.split(' '));
const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

(async () => {
  const pdfjs = await import(pathToFileURL(path.join(modules, 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs')).href);
  for (const filePath of process.argv.slice(2)) {
    const bytes = fs.readFileSync(filePath), document = await pdfjs.getDocument({data: new Uint8Array(bytes), disableWorker: true}).promise;
    const text = [];
    for (let pageNo = 1; pageNo <= document.numPages; pageNo += 1) {
      const page = await document.getPage(pageNo), content = await page.getTextContent();
      text.push(content.items.map(item => item.str || '').join(' '));
    }
    const normalized = normalize(text.join(' ')), counts = new Map();
    normalized.split(' ').filter(word => word.length > 3 && !stop.has(word) && !/^\d+$/.test(word)).forEach(word => counts.set(word, (counts.get(word) || 0) + 1));
    const topics = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr')).slice(0, 36).map(([word]) => word);
    process.stdout.write(JSON.stringify({name:path.basename(filePath),size:bytes.length,fileHash:digest(bytes),contentHash:digest(normalized),topics}) + '\n');
  }
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
