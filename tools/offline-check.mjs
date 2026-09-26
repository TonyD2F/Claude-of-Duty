#!/usr/bin/env node
/**
 * Offline gate: fail if the production build references the network.
 *
 * Scans dist/ for remote URLs (http(s)://, protocol-relative //host, @import
 * url(...)) and for absolute-root asset paths (src="/...") that break
 * file:// / sub-path hosting. XML namespace constants (w3.org) and sourcemap
 * data URIs are not network fetches and are allow-listed.
 *
 *   npm run build && npm run check:offline
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DIST = resolve(process.argv[2] ?? 'dist');
const ALLOW = /w3\.org|sourceMappingURL|w\.org\/2000\/svg/i;

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|js|css)$/.test(f)) files.push(p);
  }
};
try {
  walk(DIST);
} catch {
  console.error(`offline-check: ${DIST} not found — run \`npm run build\` first.`);
  process.exit(2);
}

let failures = 0;
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (ALLOW.test(line)) return;
    const m = line.match(/https?:\/\/[^'"\s)]+|\/\/[a-z0-9-]+\.[a-z]{2,}\/|@import\s+url\(|url\(\s*https?:/i);
    if (m) {
      console.error(`${f}:${i + 1}: remote reference: ${m[0].slice(0, 120)}`);
      failures++;
    }
    const abs = line.match(/(?:src|href)=["']\/[^"']*["']/);
    if (abs && f.endsWith('.html')) {
      console.error(`${f}:${i + 1}: absolute-root asset path (breaks offline sub-path): ${abs[0].slice(0, 120)}`);
      failures++;
    }
  });
}

if (failures) {
  console.error(`\noffline-check: FAIL — ${failures} network/rooted reference(s) in ${DIST}`);
  process.exit(1);
}
console.log(`offline-check: PASS — ${files.length} file(s) in ${DIST}, zero remote references.`);
