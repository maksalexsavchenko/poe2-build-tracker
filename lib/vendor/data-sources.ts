/**
 * Офіційні та community джерела даних PoE / PoE2.
 * Оновлення файлів: npm run vendor:game-data
 */

export const DATA_SOURCES = {
  /** PoE1 passive JSON (~6MB). Гілка master. Не плутати з PoE2. */
  poe1SkilltreeExport: {
    repo: "https://github.com/grindinggear/skilltree-export",
    branch: "master",
    rawDataJson:
      "https://raw.githubusercontent.com/grindinggear/skilltree-export/master/data.json",
  },
  /** PoE2 passive tree (community): граф нод + описи. */
  poe2Tree: {
    repo: "https://github.com/marcoaaguiar/poe2-tree",
    branch: "main",
    rawBase:
      "https://raw.githubusercontent.com/marcoaaguiar/poe2-tree/main/src/lib/data",
    files: ["nodes.json", "nodes_desc.json", "skills.json", "keywords.json"] as const,
  },
  /** MCP-сервер: геми, моди, пасиви в SQLite/JSON усередині репо — для AI або окремого бекенду. */
  poe2Mcp: {
    repo: "https://github.com/HivemindOverlord/poe2-mcp",
    docs: "https://github.com/HivemindOverlord/poe2-mcp#readme",
  },
} as const;

export const VENDORED_POE2_TREE_DIR = "/data/poe2-tree" as const;
