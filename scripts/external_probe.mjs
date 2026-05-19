import fs from 'node:fs';
import path from 'node:path';

const LINKS_DIR = 'reports/links';
fs.mkdirSync(LINKS_DIR, { recursive: true });

const ext = JSON.parse(fs.readFileSync(path.join(LINKS_DIR, 'external_links.json'), 'utf8'));
const out = [];
const concurrency = 12;
let idx = 0;

async function probe(href) {
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), 8000);
  try {
    let res = await fetch(href, {method:'HEAD', redirect:'follow', signal: ctrl.signal, headers:{'User-Agent':'Mozilla/5.0 (compatible; mycalcfinance-link-audit/1.0)'}});
    if (res.status >= 400 || res.status === 405) {
      // retry with GET
      const ctrl2 = new AbortController();
      const t2 = setTimeout(()=>ctrl2.abort(), 8000);
      try {
        res = await fetch(href, {method:'GET', redirect:'follow', signal: ctrl2.signal, headers:{'User-Agent':'Mozilla/5.0 (compatible; mycalcfinance-link-audit/1.0)'}});
      } finally { clearTimeout(t2); }
    }
    return {href, status: res.status, finalUrl: res.url};
  } catch (e) {
    return {href, status: 'ERR', error: e.name + ':' + (e.message||'')};
  } finally { clearTimeout(t); }
}

async function worker() {
  while (idx < ext.length) {
    const i = idx++;
    const r = await probe(ext[i].href);
    r.files = ext[i].files;
    out.push(r);
    process.stdout.write(`\r${out.length}/${ext.length}`);
  }
}
const start = Date.now();
await Promise.all(Array.from({length:concurrency}, worker));
console.log('\nelapsed:', ((Date.now()-start)/1000).toFixed(1), 's');
fs.writeFileSync(path.join(LINKS_DIR, 'external_results.json'), JSON.stringify(out, null, 2));
