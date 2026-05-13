/** Фрагменти `passive_skill_trees/Default*.json` з RePoE (repoe-fork.github.io/poe2). */

export type RepoePassiveInGroup = {
  connections: number[];
  hash: number;
  position_clockwise: number;
  radius: number;
  splines: number[];
};

export type RepoeGroup = {
  flag: number;
  passives: RepoePassiveInGroup[];
  x: number;
  y: number;
};

export type RepoePassiveDef = {
  ascendancy?: string;
  hash: number;
  id: string;
  is_keystone: boolean;
  is_notable: boolean;
  name: string;
  stats: Record<string, number>;
};

export type RepoePassiveTreeRoot = {
  groups: RepoeGroup[];
  orbit_radii: number[];
  skills_per_orbit: number[];
  passives: Record<string, RepoePassiveDef>;
};

export type RepoeAscendancyEntry = {
  name?: string;
  disabled?: boolean;
};
