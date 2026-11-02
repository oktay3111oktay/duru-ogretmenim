const fs = require('node:fs');
const path = require('node:path');
const modules = process.env.CODEX_BUNDLED_NODE_MODULES || 'C:\\Users\\oktay\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const {chromium} = require(path.join(modules, 'playwright'));
const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf8');
const manifest = JSON.parse(html.match(/const SCHOOL_MANIFEST=(\{.*?\});\s*let manifest=/s)[1]);
const sources = new Map(manifest.sources.map(source => [source.id, source]));
const paths = new Set();
for (const rows of Object.values(manifest.mappings)) for (const row of rows) {
  const source = sources.get(row.sourceId);
  for (const page of row.pages) paths.add(source.pagePattern.replace('{page}', page));
}
for (const rows of Object.values(manifest.schoolQuestions)) for (const q of rows) {
  if (!q.privateSource) continue;
  const source = sources.get(q.privateSource.sourceId);
  paths.add(source.pagePattern.replace('{page}', q.privateSource.page));
}
for (const rows of Object.values(manifest.exactQuestions)) for (const q of rows) {
  const source = sources.get(q.privateSource.sourceId);
  paths.add(source.url);
}

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = process.env.QA_URL || 'https://oktay3111oktay.github.io/duru-ogretmenim/';
  const response = await page.goto(base, {waitUntil:'domcontentloaded', timeout:120000});
  if (!response?.ok()) throw new Error(`Uygulama HTTP ${response?.status()}`);
  const results = [];
  const all = [...paths].sort();
  for (let offset = 0; offset < all.length; offset += 20) {
    const batch = await Promise.all(all.slice(offset, offset + 20).map(async asset => {
      try {
        const response = await page.request.head(new URL(asset, base).href, {timeout:30000});
        return {asset, status:response.status(), type:response.headers()['content-type'] || ''};
      } catch (error) {return {asset, status:0, type:String(error)}}
    }));
    results.push(...batch);
  }
  const failed = results.filter(item => item.status !== 200 || !item.type.includes('image/'));
  console.log(JSON.stringify({url:base,checked:results.length,failed,pageErrors:errors}, null, 2));
  await browser.close();
  if (failed.length || errors.length) process.exitCode = 1;
})().catch(error => {console.error(error.stack || error);process.exitCode = 1});
