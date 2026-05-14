/**
 * Compiles `local-docs/SkillGems.scss` + `Paperdoll.scss` → `app/styles/poe2-planner-maxroll.css`
 * Run: npm run build:planner-css
 */

import * as sass from 'sass';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOCAL_DOCS = path.join(ROOT, 'local-docs');
const OUT_FILE = path.join(ROOT, 'app', 'styles', 'poe2-planner-maxroll.css');
const CDN = 'https://assets-ng.maxroll.gg/poe2planner/static/media/';

function processScss(name) {
  const src = readFileSync(path.join(LOCAL_DOCS, name), 'utf8');
  return src.replace(/url\(~assets\/ui\//g, `url(${CDN}`);
}

mkdirSync(path.dirname(OUT_FILE), { recursive: true });

const pieces = [];
for (const name of ['SkillGems.scss', 'Paperdoll.scss']) {
  const result = sass.compileString(processScss(name), {
    loadPaths: [LOCAL_DOCS],
    style: 'compressed',
    silenceDeprecations: ['import'],
  });
  pieces.push(result.css);
}

const banner = '/* Auto-generated: local-docs/SkillGems.scss + Paperdoll.scss — npm run build:planner-css */\n';
writeFileSync(OUT_FILE, banner + pieces.join('\n'));
console.log('Wrote', path.relative(ROOT, OUT_FILE));
