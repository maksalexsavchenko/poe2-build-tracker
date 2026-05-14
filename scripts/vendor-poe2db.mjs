#!/usr/bin/env node
/**
 * Vendor poe2db.tw data → public/data/poe2db/*.json
 *
 * Підхід:
 *   1) Кожна сторінка предмета (унік / база / гем) на poe2db має inline JSON
 *      у форматі GGG trade-export (для уніків/базів) або markdown-таблиці
 *      per-level scaling (для гемів).
 *   2) Список усіх предметів збираємо зі сторінок-індексів:
 *        https://poe2db.tw/us/Unique_Item   (links → /us/<Slug>)
 *        https://poe2db.tw/us/Skill_Gems
 *        https://poe2db.tw/us/Support_Gems
 *        https://poe2db.tw/us/Equipment
 *   3) Між запитами тримаємо паузу (REQUEST_DELAY_MS, default 600 мс),
 *      кешуємо HTML у `.cache/poe2db/<slug>.html` — повторні запуски швидкі.
 *
 * Запуск (з кореня проекту):
 *   node scripts/vendor-poe2db.mjs            # повний прохід
 *   node scripts/vendor-poe2db.mjs --only uniques
 *   node scripts/vendor-poe2db.mjs --only gems
 *   node scripts/vendor-poe2db.mjs --limit 10   # обмежити для тестів
 *   node scripts/vendor-poe2db.mjs --no-cache    # ігнорувати .cache
 *
 * Environment:
 *   POE2DB_DELAY=400          override pause between requests (ms)
 *   POE2DB_USER_AGENT="..."   override UA (default: pos2-builder vendor)
 *
 * Вихід:
 *   public/data/poe2db/index.json       — counts + generatedAt
 *   public/data/poe2db/uniques.json     — масив PoeUnique
 *   public/data/poe2db/gems.json        — масив PoeGem (пишеться навіть якщо --only uniques)
 *
 * Цей файл не запускається у Docker build — вмикається вручну при оновленні
 * патчу (як scripts/vendor-pob-tree.mjs).
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'data', 'poe2db');
const CACHE_DIR = path.join(ROOT, '.cache', 'poe2db');

const BASE = 'https://poe2db.tw/us';
const UA = process.env.POE2DB_USER_AGENT
  ?? 'poe2-builder-vendor/0.1 (+https://poe2-build-tracker.online)';
const DELAY = Number(process.env.POE2DB_DELAY ?? 600);

const args = new Set(process.argv.slice(2));
const onlyArg = (() => {
  const i = process.argv.indexOf('--only');
  return i !== -1 ? process.argv[i + 1] : null;
})();
const limitArg = (() => {
  const i = process.argv.indexOf('--limit');
  return i !== -1 ? Number(process.argv[i + 1]) : Infinity;
})();
const useCache = !args.has('--no-cache');

// ─── tiny helpers ────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

function decodeSlug(slug) {
  try { return decodeURIComponent(slug); } catch { return slug; }
}

async function fetchHtml(slug) {
  const cacheFile = path.join(CACHE_DIR, `${slug.replace(/[/\\]/g, '_')}.html`);
  if (useCache) {
    try {
      const cached = await fs.readFile(cacheFile, 'utf8');
      return cached;
    } catch { /* miss */ }
  }
  const url = `${BASE}/${slug}`;
  let res;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' } });
      if (res.ok) break;
      if (res.status === 429 || res.status >= 500) {
        await sleep(1000 * attempt);
        continue;
      }
      throw new Error(`HTTP ${res.status} on ${url}`);
    } catch (err) {
      if (attempt === 4) throw err;
      await sleep(1000 * attempt);
    }
  }
  const text = await res.text();
  await ensureDir(CACHE_DIR);
  await fs.writeFile(cacheFile, text, 'utf8');
  await sleep(DELAY);
  return text;
}

// ─── parser: uniques ─────────────────────────────────────────────────────────

/** Перетворюємо HTML-фрагмент мода («Adds <span...>(10—14)</span> ...») у plain text
 *  з PoE-link синтаксисом «Adds (10—14) ... [Physical|Physical] Damage». Це той самий
 *  формат, що його використовує парсер у lib/poe2db/types.ts (parsePoeLinks). */
function htmlModToText(html) {
  // 1) <a href="..."> some [text] </a> → [slug|text]. slug беремо з href.
  let s = html.replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gis, (_, href, inner) => {
    const slug = href.replace(/^\/?(us\/)?/, '').replace(/[?#].*$/, '');
    const text = inner.replace(/<[^>]+>/g, '').trim();
    return `[${slug}|${text}]`;
  });
  // 2) <span class="ndash"> → — (U+2014)
  s = s.replace(/<span class="ndash">[^<]*<\/span>/g, '—');
  // 3) інші теги — викидаємо, лишаючи вміст
  s = s.replace(/<[^>]+>/g, '');
  // 4) HTML entities
  s = s.replace(/&nbsp;/g, ' ')
       .replace(/&amp;/g, '&')
       .replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>')
       .replace(/&#39;/g, "'")
       .replace(/&quot;/g, '"');
  return s.replace(/\s+/g, ' ').trim();
}

/** Дістати перший match групи з regex, або null. */
function pick(re, html) {
  const m = re.exec(html);
  return m ? m[1] : null;
}

/** Усі співпадіння — список значень першої групи. */
function pickAll(re, html) {
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return out;
}

/**
 * `Unique_item` index page: ОДИН HTTP-запит → ~400 уніків з повними даними.
 *
 * Структура одного «cell»:
 *   <a class="UniqueItems uniqueitem" ... href="Slug"><img src="...webp"/></a>
 *   <a class="uniqueitem" ... href="/us/Slug">
 *     <span class="uniqueName">Name</span>
 *     <span class="uniqueTypeLine">Wooden Club</span>
 *   </a>
 *   <div class="requirements">Requires: ...</div>
 *   <div class="explicitMod">...</div>* …
 *   <div class="flavourText">"…"</div>   (опційно)
 *
 * Парсимо суто regex'ами (Node 20 без cheerio), бо структура стабільна.
 */
async function runUniques() {
  console.log('• Тягну індекс уніків з /us/Unique_item…');
  const html = await fetchHtml('Unique_item');

  // Розбиваємо HTML на блоки за маркером `UniqueItems uniqueitem` (іконка-картка).
  const markers = [];
  const headerRe = /class="UniqueItems uniqueitem"/g;
  let hm;
  while ((hm = headerRe.exec(html)) !== null) markers.push(hm.index);
  console.log(`  знайдено ${markers.length} карток уніків`);

  const limit = Math.min(markers.length, limitArg);
  const out = [];
  for (let i = 0; i < limit; i++) {
    const blockStart = markers[i];
    const blockEnd = i + 1 < markers.length ? markers[i + 1] : Math.min(html.length, blockStart + 8000);
    const block = html.slice(blockStart, blockEnd);

    const slug = pick(/href="([^"#?]+)"/, block);
    if (!slug) continue;

    const icon = pick(/<img[^>]*src="(https?:\/\/[^"]+)"/, block) ?? '';
    const name = pick(/<span class="uniqueName">([^<]+)<\/span>/, block);
    const typeLine = pick(/<span class="uniqueTypeLine">([^<]+)<\/span>/, block);
    const requirementsHtml = pick(/<div class="requirements">([\s\S]*?)<\/div>/, block);
    const flavourHtml = pick(/<div class="flavourText">([\s\S]*?)<\/div>/, block);

    const implicitMods = pickAll(/<div class="implicitMod">([\s\S]*?)<\/div>/g, block).map(htmlModToText);
    const explicitMods = pickAll(/<div class="explicitMod">([\s\S]*?)<\/div>/g, block).map(htmlModToText);

    if (!name || explicitMods.length === 0) continue;

    /** @type {import('../lib/poe2db/types').PoeUnique} */
    const u = {
      slug: decodeSlug(slug.replace(/^\/?(us\/)?/, '')),
      name: name.replace(/&#39;/g, "'").trim(),
      baseType: typeLine?.trim() ?? '',
      rarity: 'Unique',
      w: 1, h: 1, // poe2db index не дає розмірів — лишаємо placeholder
      icon,
      implicitMods: implicitMods.length ? implicitMods : undefined,
      explicitMods,
      flavourText: flavourHtml ? [htmlModToText(flavourHtml)] : undefined,
      frameType: 3,
      requirements: requirementsHtml
        ? [{ name: 'Requires', values: [[htmlModToText(requirementsHtml).replace(/^Requires:\s*/, ''), 0]] }]
        : undefined,
    };
    out.push(u);
  }
  console.log(`  → ${out.length} уніків розпарсено`);
  return out;
}

// ─── high level runners ──────────────────────────────────────────────────────

async function runGems() {
  // Pilot: gems залишимо як заглушку. Реалізація — наступним кроком.
  console.log('• Gems vendor: skeleton — буде в наступному комміті');
  return [];
}

// ─── main ───────────────────────────────────────────────────────────────────

async function main() {
  await ensureDir(OUT_DIR);

  const wantUniques = !onlyArg || onlyArg === 'uniques';
  const wantGems = !onlyArg || onlyArg === 'gems';

  const result = {
    uniques: wantUniques ? await runUniques() : null,
    gems: wantGems ? await runGems() : null,
  };

  if (result.uniques) {
    await fs.writeFile(
      path.join(OUT_DIR, 'uniques.json'),
      JSON.stringify(result.uniques, null, 2),
      'utf8',
    );
    console.log(`✓ ${path.relative(ROOT, path.join(OUT_DIR, 'uniques.json'))}`);
  }
  if (result.gems) {
    await fs.writeFile(
      path.join(OUT_DIR, 'gems.json'),
      JSON.stringify(result.gems, null, 2),
      'utf8',
    );
    console.log(`✓ ${path.relative(ROOT, path.join(OUT_DIR, 'gems.json'))}`);
  }

  /** @type {import('../lib/poe2db/types').Poe2dbIndex} */
  const index = {
    generatedAt: new Date().toISOString(),
    counts: {
      uniques: result.uniques?.length ?? 0,
      gems: result.gems?.length ?? 0,
    },
  };
  await fs.writeFile(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
  console.log(`✓ index.json — uniques=${index.counts.uniques}, gems=${index.counts.gems}`);
}

main().catch((err) => {
  console.error('vendor-poe2db failed:', err);
  process.exit(1);
});
