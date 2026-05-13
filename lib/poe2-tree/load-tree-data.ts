import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Poe2NodesDescRoot, Poe2NodesRoot, Poe2NodeRow } from './types';
import { ascendancyToClassId, flattenPoe2Nodes } from './types';

async function readJson<T>(relativeFromPublic: string): Promise<T> {
  const fp = path.join(process.cwd(), 'public', relativeFromPublic);
  const raw = await readFile(fp, 'utf8');
  return JSON.parse(raw) as T;
}

export async function loadPoe2TreeBundle(): Promise<{
  nodes: Poe2NodesRoot;
  descriptions: Poe2NodesDescRoot;
}> {
  const [nodes, descriptions] = await Promise.all([
    readJson<Poe2NodesRoot>('data/poe2-tree/nodes.json'),
    readJson<Poe2NodesDescRoot>('data/poe2-tree/nodes_desc.json'),
  ]);
  return { nodes, descriptions };
}

/** Ноди ascension-дерева для класу (invoker, stormweaver, …). */
export async function loadAscendancyTreeNodes(ascendancyDisplayName: string): Promise<{
  nodes: Poe2NodeRow[];
  descriptions: Poe2NodesDescRoot;
}> {
  const classId = ascendancyToClassId(ascendancyDisplayName);
  const { nodes: root, descriptions } = await loadPoe2TreeBundle();
  const asc = root.ascendancies ?? [];
  const matched = asc.filter((n) => n.class === classId);
  const desc: Poe2NodesDescRoot = {};
  for (const n of matched) {
    const d = descriptions[n.id];
    if (d) desc[n.id] = d;
  }
  return { nodes: matched, descriptions: desc };
}

/** Усі ноди (для майбутнього повного дерева). */
export async function loadAllFlatNodes(): Promise<Poe2NodeRow[]> {
  const { nodes } = await loadPoe2TreeBundle();
  return flattenPoe2Nodes(nodes);
}
