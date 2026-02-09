#!/usr/bin/env node

import { promises as fs } from 'fs';

import path from 'path';

import { fileURLToPath } from 'url';



const ROOT = process.cwd();

const FE_METHODS = ['GET','POST','PUT','PATCH','DELETE'];



const isCode = f => /\.(t|j)sx?$/.test(f);

const walk = async (dir, acc=[]) => {

  try {

    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const e of entries) {

      const p = path.join(dir, e.name);

      if (e.isDirectory()) await walk(p, acc);

      else if (isCode(p)) acc.push(p);

    }

  } catch {}

  return acc;

};



const read = f => fs.readFile(f, 'utf8');



const normalizePath = (p) => {

  if (!p) return '';

  p = p.replace(/^https?:\/\/[^/]+/,'');

  if (!p.startsWith('/')) p = '/' + p;

  p = p.replace(/\/+/g,'/');

  if (p.length>1) p = p.replace(/\/$/,'');

  return p;

};



const extractBaseUrls = (code) => {

  const urls = [];

  const re = /axios\.create\s*\(\s*\{[\s\S]*?baseURL\s*:\s*['"`]([^'"`]+)['"`][\s\S]*?\}\s*\)/gmi;

  let m; while ((m = re.exec(code))) urls.push(m[1]);

  return urls.length ? urls : ['/api'];

};



const extractFrontendCalls = (code, baseUrls=['/api']) => {

  const results = [];

  const reAxios = /\b(?:axios|api)\.(get|post|put|patch|delete)\s*\(\s*(['"`])([^'"`]+)\2/gi;

  let m;

  while ((m = reAxios.exec(code))) {

    const method = m[1].toUpperCase();

    let p = m[3];

    for (const base of baseUrls) if (p.startsWith(base)) p = p.slice(base.length);

    results.push({method, path: normalizePath(p)});

  }

  const reFetch = /\bfetch\s*\(\s*(['"`])([^'"`]+)\1\s*(?:,\s*\{[\s\S]*?method\s*:\s*(['"`])([A-Za-z]+)\3)?/gi;

  while ((m = reFetch.exec(code))) {

    const raw = m[2];

    const method = (m[4] ? m[4] : 'GET').toUpperCase();

    let p = raw;

    for (const base of baseUrls) if (p.startsWith(base)) p = p.slice(base.length);

    results.push({method, path: normalizePath(p)});

  }

  return results;

};



const extractMounts = (code) => {

  const mounts = [];

  const re = /\bapp\.use\s*\(\s*(['"`])([^'"`]+)\1\s*,\s*([A-Za-z0-9_]+)\s*\)/g;

  let m; while ((m = re.exec(code))) mounts.push({prefix: normalizePath(m[2]), var: m[3]});

  return mounts;

};



const extractRouterVars = (code) => {

  const vars = new Set();

  const re = /\bconst\s+([A-Za-z0-9_]+)\s*=\s*(?:express\.)?Router\s*\(\s*\)/g;

  let m; while ((m = re.exec(code))) vars.add(m[1]);

  return vars;

};



const extractBackendRoutes = (code, methodOwner='router') => {

  const routes = [];

  const re = new RegExp(`\\b${methodOwner}\\.(get|post|put|patch|delete)\\s*\\(\\s*(['\"\`])([^'\"\`]+)\\2`, 'gi');

  let m; while ((m = re.exec(code))) {

    routes.push({method: m[1].toUpperCase(), path: normalizePath(m[3])});

  }

  return routes;

};



const uniqueKey = r => `${r.method} ${r.path}`;



const main = async () => {

  const feRoots = [];

  for (const d of ['frontend','client','web']) {

    const p = path.join(ROOT, d);

    try { const s = await fs.stat(p); if (s.isDirectory()) feRoots.push(p); } catch {}

  }

  const beRoots = [];

  for (const d of ['backend','server','api']) {

    const p = path.join(ROOT, d);

    try { const s = await fs.stat(p); if (s.isDirectory()) beRoots.push(p); } catch {}

  }



  const feFiles = (await Promise.all(feRoots.map(r => walk(r)))).flat();

  const beFiles = (await Promise.all(beRoots.map(r => walk(r)))).flat();



  let baseUrls = ['/api'];

  const apiFile = feFiles.find(f => /(^|\/)(api|http|request)\.(t|j)s$/.test(f));

  if (apiFile) {

    const code = await read(apiFile);

    baseUrls = extractBaseUrls(code);

  }



  const feSet = new Map();

  for (const f of feFiles) {

    const code = await read(f).catch(() => '');

    if (!code) continue;

    const calls = extractFrontendCalls(code, baseUrls);

    for (const c of calls) feSet.set(uniqueKey(c), c);

  }



  const beSet = new Map();

  const routerVarToPrefix = {};

  for (const f of beFiles) {

    const code = await read(f).catch(() => '');

    if (!code) continue;



    const mounts = extractMounts(code);

    for (const m of mounts) routerVarToPrefix[m.var] = m.prefix;



    for (const r of extractBackendRoutes(code, 'app')) {

      beSet.set(uniqueKey(r), r);

    }

    for (const r of extractBackendRoutes(code, 'router')) {

      beSet.set(uniqueKey(r), r); // raw

    }

  }



  for (const f of beFiles) {

    const code = await read(f).catch(() => '');

    if (!code) continue;



    const exported = [];

    const reES = /export\s+default\s+([A-Za-z0-9_]+)/g;

    const reCJS = /module\.exports\s*=\s*([A-Za-z0-9_]+)/g;

    let m;

    while ((m = reES.exec(code))) exported.push(m[1]);

    while ((m = reCJS.exec(code))) exported.push(m[1]);



    const rawRoutes = extractBackendRoutes(code, 'router');

    if (!rawRoutes.length || !exported.length) continue;



    const prefixes = exported.map(v => routerVarToPrefix[v]).filter(Boolean);

    for (const pref of prefixes) {

      for (const r of rawRoutes) {

        const withPrefix = { method: r.method, path: normalizePath(pref + r.path) };

        beSet.set(uniqueKey(withPrefix), withPrefix);

      }

    }

  }



  const feList = Array.from(feSet.values());

  const beList = Array.from(beSet.values());



  const beKeys = new Set(beList.map(uniqueKey));

  const feKeys = new Set(feList.map(uniqueKey));



  const missingInBE = feList.filter(x => !beKeys.has(uniqueKey(x)));

  const unusedInFE  = beList.filter(x => !feKeys.has(uniqueKey(x)));



  const lines = [];

  lines.push('# Route Parity Report\n');

  lines.push('## A. FE gọi nhưng BE **không có**\n');

  lines.push('| Method | Path |');

  lines.push('|--------|------|');

  if (missingInBE.length === 0) lines.push('| — | — |');

  else for (const r of missingInBE.sort((a,b)=>a.path.localeCompare(b.path))) {

    lines.push(`| ${r.method} | \`${r.path}\` |`);

  }

  lines.push('\n## B. BE **có** nhưng FE **không dùng**\n');

  lines.push('| Method | Path |');

  lines.push('|--------|------|');

  if (unusedInFE.length === 0) lines.push('| — | — |');

  else for (const r of unusedInFE.sort((a,b)=>a.path.localeCompare(b.path))) {

    lines.push(`| ${r.method} | \`${r.path}\` |`);

  }



  await fs.mkdir('reports', { recursive: true });

  const out = path.join('reports', 'route-parity.md');

  await fs.writeFile(out, lines.join('\n'), 'utf8');

  console.log(`Wrote ${out}`);

};



main().catch(e => { console.error(e); process.exit(1); });
