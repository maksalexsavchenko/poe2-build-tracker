/**
 * Офіційні та community джерела даних PoE / PoE2.
 * Оновлення файлів: npm run vendor:game-data
 *
 * Ланцюжок даних PoE2 для цього проєкту:
 * 1) клієнт PoE2 (Content.ggpk) → 2) екосистема ggpk-exposed (розпаковка / індексатори) →
 * 3) repoe-fork зливає витяг у JSON на GitHub Pages → 4) vendor-external-poe-data.sh
 *    копіює потрібні файли в public/data/repoe-poe2/.
 */

export const DATA_SOURCES = {
  /** PoE1 passive JSON (~6MB). Гілка master. Не плутати з PoE2. */
  poe1SkilltreeExport: {
    repo: "https://github.com/grindinggear/skilltree-export",
    branch: "master",
    rawDataJson:
      "https://raw.githubusercontent.com/grindinggear/skilltree-export/master/data.json",
  },
  /**
   * Інструменти для роботи з Content.ggpk клієнта Path of Exile / PoE2 (розпаковка, індекси CDN).
   * Готові JSON-дампи для сайту беремо з repoe-fork (repoePoe2), а не збираємо ggpk у CI.
   */
  ggpkExposed: {
    org: "https://github.com/ggpk-exposed",
    /** Приклади репозиторіїв у організації */
    repos: {
      exposer: "https://github.com/ggpk-exposed/exposer",
      ggpker: "https://github.com/ggpk-exposed/ggpker",
      ggpkIndexServer: "https://github.com/ggpk-exposed/ggpk-index-server",
      poecdnBundleIndex: "https://github.com/ggpk-exposed/poecdn-bundle-index",
    },
  },
  /** MCP-сервер: геми, моди, пасиви в SQLite/JSON усередині репо — для AI або окремого бекенду. */
  poe2Mcp: {
    repo: "https://github.com/HivemindOverlord/poe2-mcp",
    docs: "https://github.com/HivemindOverlord/poe2-mcp#readme",
  },
  /**
   * RePoE (fork): JSON з клієнта, зібрані та викладені на GitHub Pages.
   * PoE1 (корінь каталогу): browsePoe1. PoE2: browse — саме звідси тягне npm run vendor:game-data.
   */
  repoePoe2: {
    browsePoe1: "https://repoe-fork.github.io/",
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
