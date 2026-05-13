/** Мінімальні типи для nodes.json (poe2-tree); розшир за потреби. */

export type Poe2TreeNode = {
  id: string;
  x: number;
  y: number;
  out: string[];
  in: string[];
};

export type Poe2NodesFile = Record<string, Poe2TreeNode>;

export type Poe2NodeDescEntry = {
  name?: string;
  stats?: string[];
};

export type Poe2NodesDescFile = Record<string, Poe2NodeDescEntry>;
