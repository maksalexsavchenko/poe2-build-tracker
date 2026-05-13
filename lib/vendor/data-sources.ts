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
  /** MCP-сервер: геми, моди, пасиви в SQLite/JSON усередині репо — для AI або окремого бекенду. */
  poe2Mcp: {
    repo: "https://github.com/HivemindOverlord/poe2-mcp",
    docs: "https://github.com/HivemindOverlord/poe2-mcp#readme",
  },
  /**
   * RePoE (fork): витяг JSON з клієнта PoE2.
   * Локальна копія: public/data/repoe-poe2/ (див. scripts/vendor-external-poe-data.sh).
   * HTTP: GET /api/game/repoe/<відносний шлях> — наприклад mods.min.json або stat_translations/skill_stat_descriptions.min.json
   */
  repoePoe2: {
    browse: "https://repoe-fork.github.io/poe2/",
    repo: "https://github.com/repoe-fork/repoe-fork",
    rawFile: (name: string) => `https://repoe-fork.github.io/poe2/${name}`,
    passiveTreesIndex: "https://repoe-fork.github.io/poe2/passive_skill_trees/",
    /** Корінь: завжди качається vendor-скриптом */
    vendoredRoot: [
      "passive-tree-Default.min.json",
      "ascendancies.min.json",
      "skill_gems.min.json",
      "mods.min.json",
      "base_items.min.json",
      "uniques.min.json",
      "keywords.min.json",
      "stat_value_handlers.min.json",
    ] as const,
    /** Підкаталог: усі *.min.json з repoe …/stat_translations/ */
    vendoredStatTranslationsDir: "stat_translations" as const,
    /** Опційно: DOWNLOAD_REPOE_SKILLS=1 */
    optionalSkills: "skills.min.json" as const,
    /** Опційно: DOWNLOAD_REPOE_STATS_BY_FILE=1 */
    optionalStatsByFile: "stats_by_file.min.json" as const,
  },
} as const;

export const VENDORED_REPOE_POE2_DIR = "/data/repoe-poe2" as const;
