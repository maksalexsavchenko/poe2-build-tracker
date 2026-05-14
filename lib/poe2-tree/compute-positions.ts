/** Compute pixel-space x/y for every node from PoB/GGG tree.json. */

export type RawNode = {
  skill: number;
  name: string;
  stats?: string[];
  icon?: string;
  group: number;
  orbit: number;
  orbitIndex: number;
  connections: { orbit: number; id: number }[];
  isKeystone?: boolean;
  isNotable?: boolean;
  ascendancyName?: string;
  isJewelSocket?: boolean;
  /** Список класів-стартів, до яких належить ця нода (наприклад ['Monk','Shadow']). */
  classesStart?: string[];
  /** PoB позначає такі ноди як "лише картинка" — без edges. */
  isOnlyImage?: boolean;
};

export type RawGroup = { x: number; y: number; nodes: number[]; orbits: number[] } | null;

export type RawTreeData = {
  nodes: Record<string, RawNode>;
  groups: RawGroup[];
  constants: {
    orbitAnglesByOrbit: number[][];
    orbitRadii: number[];
  };
  min_x: number;
  max_x: number;
  min_y: number;
  max_y: number;
  classes: {
    name: string;
    base_str: number;
    base_dex: number;
    base_int: number;
    ascendancies: { id: string; name: string; internalId: string }[];
  }[];
};

export type ComputedNode = {
  id: number;
  x: number;
  y: number;
  name: string;
  stats: string[];
  isKeystone: boolean;
  isNotable: boolean;
  isAscendancy: boolean;
  ascendancyName?: string;
  isJewelSocket: boolean;
  connections: number[];
  /** index into raw.groups */
  group: number;
  /** orbit index (0 = center) */
  orbit: number;
};

export type ProcessedTree = {
  nodes: ComputedNode[];
  nodeById: Map<number, ComputedNode>;
  edges: [number, number][]; // pairs of node IDs
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  groups: RawGroup[]; // raw group data (some entries may be null)
};

/**
 * tree.json з PoB‑PoE2 експортується з Lua, де таблиці 1‑індексовані. Тому
 * `node.group` посилається на групу за 1-індексованим індексом, а в JS-масиві
 * вона знаходиться під `groups[group - 1]` (індекс 0 — `null`, бо в Lua з 1).
 * Без цієї поправки 100% нод дістають чужу позицію, і дерево виглядає як
 * хаос вертикальних ліній.
 *
 * Зберігаємо fallback на `groups[idx]` на випадок якщо колись зайде версія
 * tree.json з нормальним 0-індексуванням.
 */
function lookupGroup(groups: RawGroup[], idx: number): RawGroup {
  return groups[idx - 1] ?? groups[idx] ?? null;
}

export function processTree(raw: RawTreeData): ProcessedTree {
  const { orbitAnglesByOrbit, orbitRadii } = raw.constants;
  const nodeById = new Map<number, ComputedNode>();
  const nodes: ComputedNode[] = [];
  /** raw lookup для перевірки classesStart / isOnlyImage під час фільтра ребер. */
  const rawById = new Map<number, RawNode>();

  for (const raw_node of Object.values(raw.nodes)) {
    const g = lookupGroup(raw.groups, raw_node.group);
    if (!g) continue;

    const angles = orbitAnglesByOrbit[raw_node.orbit];
    const radius = orbitRadii[raw_node.orbit] ?? 0;
    const angle = angles?.[raw_node.orbitIndex] ?? 0;

    // PoE2 tree: angle 0 = top, going clockwise → sin for X, -cos for Y
    const x = g.x + radius * Math.sin(angle);
    const y = g.y - radius * Math.cos(angle);

    const computed: ComputedNode = {
      id: raw_node.skill,
      x,
      y,
      name: raw_node.name,
      stats: raw_node.stats ?? [],
      isKeystone: raw_node.isKeystone ?? false,
      isNotable: raw_node.isNotable ?? false,
      isAscendancy: !!raw_node.ascendancyName,
      ascendancyName: raw_node.ascendancyName,
      isJewelSocket: raw_node.isJewelSocket ?? false,
      connections: raw_node.connections.map((c) => c.id),
      group: raw_node.group,
      orbit: raw_node.orbit,
    };

    nodes.push(computed);
    nodeById.set(raw_node.skill, computed);
    rawById.set(raw_node.skill, raw_node);
  }

  // Build de-duplicated edge list із тими ж фільтрами, що в PoB
  // (`src/Classes/PassiveTree.lua → PassiveTree:Init`):
  //   • ноди типу OnlyImage не дають ребер
  //   • не з’єднуємо ноди з різними ascendancyName (включно з main↔ascendancy)
  //   • ноди-стартери класу (classesStart) мають сирі connections до сусідніх
  //     класів — у грі ці ребра не малюються, тому пропускаємо обидві сторони.
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const n of nodes) {
    const a = rawById.get(n.id);
    if (!a || a.isOnlyImage) continue;
    if (a.classesStart && a.classesStart.length > 0) continue;
    for (const otherId of n.connections) {
      if (otherId === n.id) continue;
      const b = rawById.get(otherId);
      if (!b || b.isOnlyImage) continue;
      if (b.classesStart && b.classesStart.length > 0) continue;
      if ((a.ascendancyName ?? '') !== (b.ascendancyName ?? '')) continue;
      const key = n.id < otherId ? `${n.id}:${otherId}` : `${otherId}:${n.id}`;
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      edges.push([n.id, otherId]);
    }
  }

  return {
    nodes,
    nodeById,
    edges,
    bounds: {
      minX: raw.min_x,
      maxX: raw.max_x,
      minY: raw.min_y,
      maxY: raw.max_y,
    },
    groups: raw.groups,
  };
}
