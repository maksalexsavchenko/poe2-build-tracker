import type { RepoeAscendancyEntry } from './passive-tree-schema';

/**
 * Відображення відображуваної назви ascendancy (як у гайді) → поле `ascendancy` у passives RePoE (Monk2, …).
 */
export function buildAscendancyDisplayNameToCode(
  ascendancies: Record<string, RepoeAscendancyEntry>,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const [code, row] of Object.entries(ascendancies)) {
    if (!row?.name || row.disabled) continue;
    if (!map.has(row.name)) map.set(row.name, code);
  }
  return map;
}
