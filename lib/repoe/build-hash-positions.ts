import type { RepoePassiveTreeRoot } from './passive-tree-schema';

/** Світові координати ноди на дереві (як у клієнті PoE2). */
export function buildPassiveHashPositions(tree: RepoePassiveTreeRoot): Map<number, { x: number; y: number }> {
  const { groups, orbit_radii, skills_per_orbit } = tree;
  const out = new Map<number, { x: number; y: number }>();

  for (const g of groups) {
    for (const p of g.passives) {
      const oi = p.radius;
      const r = orbit_radii[oi] ?? 0;
      const n = skills_per_orbit[oi] ?? 1;
      const angle = (2 * Math.PI * p.position_clockwise) / n;
      const x = g.x + Math.cos(angle) * r;
      const y = g.y + Math.sin(angle) * r;
      out.set(p.hash, { x, y });
    }
  }
  return out;
}
