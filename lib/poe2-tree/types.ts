export type Poe2NodeRow = {
  id: string;
  x: number;
  y: number;
  kind: string;
  class?: string;
};

export type Poe2NodesRoot = {
  keystones: Poe2NodeRow[];
  notables: Poe2NodeRow[];
  smalls: Poe2NodeRow[];
  ascendancies: Poe2NodeRow[];
};

export type Poe2NodesDescRoot = Record<string, { name?: string; stats?: string[] }>;

export function flattenPoe2Nodes(data: Poe2NodesRoot): Poe2NodeRow[] {
  const keys: (keyof Poe2NodesRoot)[] = ['keystones', 'notables', 'smalls', 'ascendancies'];
  const out: Poe2NodeRow[] = [];
  for (const k of keys) {
    const arr = data[k];
    if (!Array.isArray(arr)) continue;
    for (const n of arr) {
      if (n?.id && typeof n.x === 'number' && typeof n.y === 'number') out.push(n);
    }
  }
  return out;
}

/** Ascendancy name з гайду → поле `class` у nodes.json (lowercase). */
export function ascendancyToClassId(ascendancy: string): string {
  return ascendancy.trim().toLowerCase().replace(/\s+/g, '');
}
