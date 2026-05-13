export interface AscendancyInfo {
  id: string;
  name: string;
  class: string;
  portrait: string;
  description: string;
  playstyle: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  color: string;
  ascendancies: AscendancyInfo[];
}

export const GEM_ICONS: Record<string, string> = {
  fireball: '/images/gems2/fireball.webp',
  flame_wall: '/images/gems2/flame_wall.webp',
  frost_blink: '/images/gems2/frost_blink.webp',
  flammability: '/images/gems2/flammability.webp',
  spark: '/images/gems2/spark.webp',
  storm_strike: '/images/gems2/storm_strike.webp',
  chain_lightning: '/images/gems2/chain_lightning.webp',
  split_arrow: '/images/gems2/split_arrow.webp',
  tornado_shot: '/images/gems2/tornado_shot.webp',
  spell_echo: '/images/gems2/spell_echo.webp',
  added_fire_damage: '/images/gems2/added_fire.webp',
  added_fire: '/images/gems2/added_fire.webp',
  controlled_destruction: '/images/gems2/controlled_destruction.webp',
  fire_penetration: '/images/gems2/fire_penetration.webp',
  hextouch: '/images/gems2/hextouch.webp',
  intensify: '/images/gems2/intensify.webp',
  faster_attacks: '/images/gems2/faster_attacks.webp',
  added_cold_damage: '/images/gems2/added_cold.webp',
  added_cold: '/images/gems2/added_cold.webp',
  added_lightning_damage: '/images/gems2/added_lightning.webp',
  added_lightning: '/images/gems2/added_lightning.webp',
  chain: '/images/gems2/chain.webp',
  melee_physical_damage: '/images/gems2/melee_physical.webp',
  melee_physical: '/images/gems2/melee_physical.webp',
};

export function getGemIcon(gemId: string): string {
  const key = gemId.toLowerCase().replace(/-/g, '_');
  return GEM_ICONS[key] ?? '';
}

export const CLASSES: ClassInfo[] = [
  {
    id: 'witch',
    name: 'Witch',
    color: '#9333ea',
    ascendancies: [
      {
        id: 'invoker',
        name: 'Invoker',
        class: 'Witch',
        portrait: '/images/ascendancies/Invoker.webp',
        description: 'Майстер духовної енергії та елементальної магії. Перетворює Spirit на потужні здібності.',
        playstyle: 'Caster / Spirit',
      },
      {
        id: 'blood_mage',
        name: 'Blood Mage',
        class: 'Witch',
        portrait: '/images/ascendancies/BloodMage.webp',
        description: 'Жертвує власним життям заради непоборної магічної сили.',
        playstyle: 'Caster / Life-based',
      },
      {
        id: 'infernalist',
        name: 'Infernalist',
        class: 'Witch',
        portrait: '/images/ascendancies/Infernalist.webp',
        description: 'Укладає пакт з пекельними силами, отримуючи руйнівні вогняні здібності.',
        playstyle: 'Fire / Minions',
      },
    ],
  },
  {
    id: 'monk',
    name: 'Monk',
    color: '#3b82f6',
    ascendancies: [
      {
        id: 'stormweaver',
        name: 'Stormweaver',
        class: 'Monk',
        portrait: '/images/ascendancies/Stormweaver.webp',
        description: 'Плете блискавку у смертоносні шторми, поєднуючи швидкість та електричну міць.',
        playstyle: 'Lightning / Fast',
      },
      {
        id: 'chronomancer',
        name: 'Chronomancer',
        class: 'Monk',
        portrait: '/images/ascendancies/Chronomancer.webp',
        description: 'Маніпулює часом, уповільнюючи ворогів та прискорюючи власні дії.',
        playstyle: 'Time Manipulation',
      },
    ],
  },
  {
    id: 'ranger',
    name: 'Ranger',
    color: '#22c55e',
    ascendancies: [
      {
        id: 'deadeye',
        name: 'Deadeye',
        class: 'Ranger',
        portrait: '/images/ascendancies/Deadeye.webp',
        description: 'Ніколи не промахується. Стріли пронизують ворогів та рикошетять між ними.',
        playstyle: 'Bow / Projectile',
      },
      {
        id: 'pathfinder',
        name: 'Pathfinder',
        class: 'Ranger',
        portrait: '/images/ascendancies/Pathfinder.webp',
        description: 'Майстер зілій та природних отрут. Постійно підсилює союзників.',
        playstyle: 'Flasks / Poison',
      },
    ],
  },
  {
    id: 'warrior',
    name: 'Warrior',
    color: '#ef4444',
    ascendancies: [
      {
        id: 'titan',
        name: 'Titan',
        class: 'Warrior',
        portrait: '/images/ascendancies/Titan.webp',
        description: 'Незламний колос. Використовує вагу та силу для нищівних ударів.',
        playstyle: 'Melee / Tank',
      },
      {
        id: 'warbringer',
        name: 'Warbringer',
        class: 'Warrior',
        portrait: '/images/ascendancies/Warbringer.webp',
        description: 'Призиває духів воїнів та збирає силу в горнилі бою.',
        playstyle: 'Melee / Minions',
      },
    ],
  },
  {
    id: 'mercenary',
    name: 'Mercenary',
    color: '#f59e0b',
    ascendancies: [
      {
        id: 'witchhunter',
        name: 'Witchhunter',
        class: 'Mercenary',
        portrait: '/images/ascendancies/Witchhunter.webp',
        description: 'Спеціаліст з ліквідації магічних загроз. Ігнорує щити та регенерацію ворогів.',
        playstyle: 'Crossbow / Anti-magic',
      },
      {
        id: 'gemling_legionnaire',
        name: 'Gemling Legionnaire',
        class: 'Mercenary',
        portrait: '/images/ascendancies/Witchhunter.webp',
        description: 'Вживляє геми прямо в тіло, отримуючи надлюдські здібності.',
        playstyle: 'Hybrid / Gems',
      },
    ],
  },
  {
    id: 'sorceress',
    name: 'Sorceress',
    color: '#60a5fa',
    ascendancies: [
      {
        id: 'oracle',
        name: 'Oracle',
        class: 'Sorceress',
        portrait: '/images/ascendancies/Oracle.webp',
        description: 'Бачить майбутнє і маніпулює долями ворогів через передбачення.',
        playstyle: 'Spell / Utility',
      },
    ],
  },
  {
    id: 'huntress',
    name: 'Huntress',
    color: '#10b981',
    ascendancies: [
      {
        id: 'shaman',
        name: 'Shaman',
        class: 'Huntress',
        portrait: '/images/ascendancies/Shaman.webp',
        description: "Зв'язується з духами природи, викликаючи тотеми та стихійні сили.",
        playstyle: 'Totem / Nature',
      },
    ],
  },
];

export function getClassByName(name: string): ClassInfo | undefined {
  return CLASSES.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function getAscendancy(className: string, ascName: string): AscendancyInfo | undefined {
  const cls = getClassByName(className);
  return cls?.ascendancies.find(
    (a) => a.name.toLowerCase() === ascName.toLowerCase() || a.id === ascName.toLowerCase()
  );
}
