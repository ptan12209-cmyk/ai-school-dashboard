#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const TEST_GLOBS = [/_\.test\.(t|j)sx?$/, /_\.spec\.(t|j)sx?$/];

const walk = async (dir, acc=[]) => {
  try {
    const ents = await fs.readdir(dir, { withFileTypes: true });
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p, acc);
      else acc.push(p);
    }
  } catch {}
  return acc;
};

const looksLikeTest = f => TEST_GLOBS.some(re => re.test(f));
const isCode = f => /\.(t|j)sx?$/.test(f);

const parseImports = (code) => {
  const imps = [];
  const re1 = /import\s+(?:[\w*\s{},]+)\s+from\s+['"]([^'"]+)['"]/g;
  const re2 = /const\s+{?[\w\s,]*}?\s*=\s*require\(['"]([^'"]+)['"]\)/g;
  let m; while ((m = re1.exec(code))) imps.push(m[1]);
  while ((m = re2.exec(code))) imps.push(m[1]);
  return imps;
};

const parseNamedUsages = (code) => {
  const names = new Set();
  const re = /\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  let m; while ((m = re.exec(code))) names.add(m[1]);
  ['describe','it','test','expect','beforeAll','beforeEach','afterAll','afterEach','jest','console'].forEach(n => names.delete(n));
  return Array.from(names);
};

const getExports = async (file) => {
  const code = await fs.readFile(file, 'utf8').catch(()=> '');
  if (!code) return { named: [], hasDefault: false };
  const named = new Set();
  const reNamed = /export\s+(?:const|function|class)\s+([A-Za-z0-9_]+)/g;
  const reNamedList = /export\s*\{\s*([^}]+)\s*\}/g;
  let m;
  while ((m = reNamed.exec(code))) named.add(m[1]);
  while ((m = reNamedList.exec(code))) {
    m[1].split(',').map(s=>s.trim().split(/\s+as\s+/)[0]).forEach(n => named.add(n));
  }
  const hasDefault = /export\s+default\s+/.test(code);
  return { named: Array.from(named), hasDefault };
};

const main = async () => {
  const roots = ['backend','server','api','frontend','client','web'];
  const files = (await Promise.all(roots.map(r => walk(r)))).flat().filter(Boolean);

  const testFiles = files.filter(f => looksLikeTest(f));
  const problems = [];

  for (const tf of testFiles) {
    const tcode = await fs.readFile(tf, 'utf8').catch(()=> '');
    if (!tcode) continue;

    const imports = parseImports(tcode);
    const usages = parseNamedUsages(tcode);

    for (const spec of imports) {
      if (!spec.startsWith('.')) continue;

      let impl = null;
      const base1 = path.resolve(path.dirname(tf), spec);
      const candidates = [
        base1,
        base1 + '/index'
      ];
      for (const base of candidates) {
        for (const ext of ['.ts','.tsx','.js','.jsx','.mjs','.cjs']) {
          const cand = base + ext;
          try { const s = await fs.stat(cand); if (s.isFile()) { impl = cand; break; } } catch {}
        }
        if (impl) break;
      }

      if (!impl) {
        problems.push({ type: 'MISSING_IMPL', test: tf, import: spec, msg: 'Không tìm thấy file triển khai tương ứng' });
        continue;
      }

      const { named } = await getExports(impl);
      const missingNames = usages.filter(u => !named.includes(u));
      if (missingNames.length) {
        problems.push({ type: 'MISSING_EXPORTS', test: tf, impl, names: missingNames });
      }
    }
  }

  const lines = [];
  lines.push('# Test Reference Report');
  if (!problems.length) {
    lines.push('\n✅ Không phát hiện test tham chiếu sai.\n');
  } else {
    for (const p of problems) {
      if (p.type === 'MISSING_IMPL') {
        lines.push(`- ❌ **${p.test}** → import \`${p.import}\`: ${p.msg}`);
      } else if (p.type === 'MISSING_EXPORTS') {
        lines.push(`- ❌ **${p.test}** → \`${p.impl}\` thiếu exports: ${p.names.map(n=>`\`${n}\``).join(', ')}`);
      }
    }
  }
  await fs.mkdir('reports', { recursive: true });
  await fs.writeFile('reports/test-reference-report.md', lines.join('\n'), 'utf8');
  console.log('Wrote reports/test-reference-report.md');
};

main().catch(e => { console.error(e); process.exit(1); });
