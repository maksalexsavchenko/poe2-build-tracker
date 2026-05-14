/**
 * Типи для даних, що вендоряться з https://poe2db.tw/us/.
 *
 * Джерело: HTML сторінка кожного предмета містить inline JSON у форматі
 * GGG trade-export (унікалки/бази) + markdown-таблиці per-level scaling (геми).
 *
 * Цей файл — лише типи + utility, без runtime fetch.
 * Дані виробляються build-time скриптом `scripts/vendor-poe2db.mjs` і
 * лежать у `public/data/poe2db/*.json`.
 */

/** Розряд предмета у trade-export. Узгоджено з GGG API. */
export type FrameType =
  | 0  // normal
  | 1  // magic
  | 2  // rare
  | 3  // unique
  | 4  // gem
  | 5  // currency
  | 6  // divination card
  | 7  // quest item
  | 8  // prophecy
  | 9  // relic
  | 10 // foil
  | 11; // supporter foil

/** Властивість предмета (Armour, Energy Shield, Cast Time, ...). */
export type ItemProperty = {
  name: string;
  /** Кожне value: [text, displayType]. displayType=0 — звичайний, 1 — augmented. */
  values: [string, number][];
  displayMode?: number;
  type?: number;
};

/** Unique item — береться з inline JSON poe2db (поле trade-style). */
export type PoeUnique = {
  /** Slug сторінки poe2db: `Bramblejack`, `Wanderlust` … */
  slug: string;
  /** Канонічна назва (Bramblejack). */
  name: string;
  /** Базовий тип (Rusted Cuirass, Wool Shoes …). */
  baseType: string;
  /** Item class (`Body Armour`, `Wand`, `Boots`, …). У JSON може бути в `properties[0].name`. */
  itemClass?: string;
  rarity: 'Unique';
  /** Item level / drop level. */
  ilvl?: number;
  /** Розміри в інвентарі (важливо для UI-grid). */
  w: number;
  h: number;
  /** Готовий https://web.poecdn.com/gen/image/... URL з poe2db. */
  icon: string;
  /** League, в якій додано (Standard, Settlers, ...). */
  league?: string;
  /** Implicit mods (рідкі для уніків). */
  implicitMods?: string[];
  /** Explicit mod-рядки, як показує гра. Можуть містити PoE-link синтаксис `[Name|Display]`. */
  explicitMods: string[];
  /** Описові «curio» рядки (italic flavour text). */
  flavourText?: string[];
  /** Properties (Armour, Movement Speed, …). */
  properties?: ItemProperty[];
  /** Mod requirements (Level, Str, Dex, Int). */
  requirements?: ItemProperty[];
  /** Permanent identifier у клієнті PoE (Metadata/Items/Armours/...). Може бути відсутнім. */
  metadataId?: string;
  /** frameType з GGG API (3 для уніків, але буває 9 relic / 10 foil). */
  frameType: FrameType;
  /** Версія патчу, в якому востаннє оновлено poe2db (за історією версій). */
  lastSeenPatch?: string;
};

/** Per-level row у Skill-Gem effect table. */
export type GemLevelRow = {
  level: number;
  requiresLevel?: number;
  attribute?: number;
  cost?: number;
  damageEffectiveness?: number;
  /** Інше поле з оригінальної таблиці (Base Damage / Spirit / Cooldown / ...). */
  extras: Record<string, string | number>;
};

/** Skill або support gem з poe2db. */
export type PoeGem = {
  slug: string;
  /** «Fireball», «Greater Lightning Bolt» тощо. */
  name: string;
  /** Tier (1..5). */
  tier?: number;
  /** active | support | meta. */
  gemType: 'active' | 'support' | 'meta';
  /** Skill tags (Spell, Projectile, Fire, AreaSpell, …). */
  tags: string[];
  /** Опис («Launch a large ball of [Fire]…»). PoE-link синтаксис збережений. */
  description?: string;
  /** Cost / Cast Time / CritChance / тощо — те, що йде у hero-блоці до tabs. */
  heroStats?: Record<string, string>;
  /** Один або кілька прикладних effects (Projectile / Explosion / Firebolts …). */
  effects?: { section: string; lines: string[] }[];
  /** Per-level scaling 1..40. */
  levels: GemLevelRow[];
  /** Metadata/Items/Gem/SkillGemFireball — щоб з'єднати з RePoE по item_id. */
  metadataId?: string;
  /** Готовий https://cdn.poe2db.tw/image/... URL. */
  icon?: string;
  /** Tier ascendancy / class restriction, якщо є. */
  classRestriction?: string;
};

/** Будь-який запис у data/poe2db/index.json. */
export type Poe2dbIndex = {
  generatedAt: string;
  /** Назва патчу, на якому збиралось (наприклад '0.4'). */
  patch?: string;
  counts: {
    uniques: number;
    gems: number;
    bases?: number;
  };
};

/**
 * Маленький helper: перетворити PoE-link синтаксис `[Fire|Fire Damage]` на
 * або plain text «Fire Damage», або об'єкт з token+href.
 *
 * Корисно і UI-рендеру (tooltip).
 */
export type ParsedToken =
  | { kind: 'text'; text: string }
  | { kind: 'link'; text: string; slug: string };

export function parsePoeLinks(s: string): ParsedToken[] {
  const out: ParsedToken[] = [];
  const re = /\[([^\]|]+)(?:\|([^\]]+))?\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push({ kind: 'text', text: s.slice(last, m.index) });
    const slug = m[1].trim();
    const text = (m[2] ?? slug).trim();
    out.push({ kind: 'link', text, slug });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ kind: 'text', text: s.slice(last) });
  return out;
}

/** Pure-text serialization без подальшого рендеру: «[Fire|Fire Damage]» → «Fire Damage». */
export function plainText(s: string): string {
  return parsePoeLinks(s).map((t) => t.text).join('');
}
