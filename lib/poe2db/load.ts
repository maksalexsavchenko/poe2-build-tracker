/**
 * Server-side loaders для вендорених poe2db даних.
 *
 * Дані лежать у `public/data/poe2db/*.json`, готує їх
 * `npm run vendor:poe2db` (scripts/vendor-poe2db.mjs).
 *
 * У runtime ми просто читаємо JSON один раз і тримаємо в пам'яті.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { PoeUnique, PoeGem, Poe2dbIndex } from './types';

const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'poe2db');

/** Lazy singleton: гарантує одне читання за час життя процесу. */
function memo<T>(loader: () => Promise<T>): () => Promise<T> {
  let cached: Promise<T> | null = null;
  return () => {
    if (!cached) cached = loader().catch((err) => { cached = null; throw err; });
    return cached;
  };
}

async function readJsonOrEmpty<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf8');
    return JSON.parse(raw) as T;
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException;
    if (e?.code === 'ENOENT') return fallback;
    throw err;
  }
}

export const loadPoe2dbUniques = memo(() => readJsonOrEmpty<PoeUnique[]>('uniques.json', []));
export const loadPoe2dbGems = memo(() => readJsonOrEmpty<PoeGem[]>('gems.json', []));
export const loadPoe2dbIndex = memo(() =>
  readJsonOrEmpty<Poe2dbIndex | null>('index.json', null)
);

/** Знайти унік за slug (case-insensitive). */
export async function findUnique(slug: string): Promise<PoeUnique | undefined> {
  const u = await loadPoe2dbUniques();
  const target = slug.toLowerCase();
  return u.find((x) => x.slug.toLowerCase() === target || x.name.toLowerCase() === target);
}

/** Знайти gem за slug / name (case-insensitive). */
export async function findGem(query: string): Promise<PoeGem | undefined> {
  const g = await loadPoe2dbGems();
  const t = query.toLowerCase();
  return g.find((x) => x.slug.toLowerCase() === t || x.name.toLowerCase() === t);
}
