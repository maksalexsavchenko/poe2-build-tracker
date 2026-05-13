import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Poe2NodeRow } from '@/lib/poe2-tree/types';
import { buildPassiveHashPositions } from './build-hash-positions';
import { buildAscendancyDisplayNameToCode } from './ascendancy-name-to-code';
import type { RepoePassiveTreeRoot } from './passive-tree-schema';

async function readJson<T>(relativeFromPublic: string): Promise<T> {
  const fp = path.join(process.cwd(), 'public', relativeFromPublic);
  const raw = await readFile(fp, 'utf8');
  return JSON.parse(raw) as T;
}

function passiveKind(p: { is_keystone: boolean; is_notable: boolean }): string {
  if (p.is_keystone) return 'keystone';
  if (p.is_notable) return 'notable';
  return 'small';
}

function formatStats(stats: Record<string, number> | undefined): string[] {
  if (!stats || typeof stats !== 'object') return [];
  return Object.entries(stats).map(([k, v]) => `${k}: ${v}`);
}

/**
 * Ноди ascendancy з RePoE: координати нормалізовані в [0,1] у межах bounding box (рівномірний scale).
 */
export async function loadAscendancyFromRepoe(ascendancyDisplayName: string): Promise<{
  nodes: Poe2NodeRow[];
  descriptions: Record<string, { name?: string; stats?: string[] }>;
  edges: [string, string][];
}> {
  const [tree, ascRoot] = await Promise.all([
    readJson<RepoePassiveTreeRoot>('data/repoe-poe2/passive-tree-Default.min.json'),
    readJson<Record<string, { name?: string; disabled?: boolean }>>('data/repoe-poe2/ascendancies.min.json'),
  ]);

  const nameToCode = buildAscendancyDisplayNameToCode(ascRoot);
  const code = nameToCode.get(ascendancyDisplayName.trim());
  if (!code) {
    return { nodes: [], descriptions: {}, edges: [] };
  }

  const positions = buildPassiveHashPositions(tree);
  const hashes: number[] = [];

  for (const def of Object.values(tree.passives)) {
    if (!def || def.ascendancy !== code) continue;
    if (typeof def.hash === 'number' && Number.isFinite(def.hash)) hashes.push(def.hash);
  }

  if (hashes.length === 0) {
    return { nodes: [], descriptions: {}, edges: [] };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const h of hashes) {
    const pt = positions.get(h);
    if (!pt) continue;
    minX = Math.min(minX, pt.x);
    minY = Math.min(minY, pt.y);
    maxX = Math.max(maxX, pt.x);
    maxY = Math.max(maxY, pt.y);
  }

  const padFrac = 0.12;
  const span = Math.max(maxX - minX, maxY - minY, 1);
  const pad = span * padFrac;
  const side = span + 2 * pad;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  const norm = (x: number, y: number) => ({
    x: (x - (cx - side / 2)) / side,
    y: (y - (cy - side / 2)) / side,
  });

  const hashSet = new Set(hashes);
  const nodes: Poe2NodeRow[] = [];
  const descriptions: Record<string, { name?: string; stats?: string[] }> = {};
  const edges: [string, string][] = [];
  const edgeSeen = new Set<string>();

  for (const h of hashes) {
    const def = tree.passives[String(h)];
    const pt = positions.get(h);
    if (!def || !pt) continue;
    const id = String(h);
    const { x, y } = norm(pt.x, pt.y);
    nodes.push({
      id,
      x,
      y,
      kind: passiveKind(def),
      class: code,
    });
    descriptions[id] = {
      name: def.name,
      stats: formatStats(def.stats),
    };
  }

  for (const g of tree.groups) {
    for (const p of g.passives) {
      if (!hashSet.has(p.hash)) continue;
      for (const c of p.connections) {
        if (!hashSet.has(c)) continue;
        const a = String(Math.min(p.hash, c));
        const b = String(Math.max(p.hash, c));
        const ek = `${a}-${b}`;
        if (edgeSeen.has(ek)) continue;
        edgeSeen.add(ek);
        edges.push([String(p.hash), String(c)]);
      }
    }
  }

  return { nodes, descriptions, edges };
}
