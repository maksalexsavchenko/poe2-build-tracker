import { Guide } from './types';

export const guides: Guide[] = [
  {
    id: 'invoker-fireball',
    title: 'Fireball Invoker',
    class: 'Monk',
    ascendancy: 'Invoker',
    description:
      'Потужний Monk/Invoker білд на базі Fireball. Елементальний тригер-кастер — автоматичний cast через Invoker механіку. Відмінний для зачистки мап.',
    tags: ['beginner', 'ssf-viable', 'fire', 'spell'],
    difficulty: 'beginner',
    author: 'poe2tracker',
    version: '0.2.0',
    pros: [
      'Дуже простий у левелінгу',
      'Не потребує дорогого gear',
      'SSF-viable',
      'Великий AoE для зачистки мап',
    ],
    cons: [
      'Середній single-target DPS',
      'Потрібна хороша зброя в ендгеймі',
    ],
    levelingPath: [
      {
        level: 12,
        label: 'Акт 1',
        notes:
          'Завершуємо Act 1. Купуємо Fireball у торговця після вбивства Hillock. Flame Wall — хороший другий скіл для синергії.',
        // TODO(passives): підставити справжні skill-id, дотичні до Monk start (44683).
        // Зараз — порожньо, бо попередній набір був випадковим (ноди по всьому дереву).
        passives: [],
        skills: [
          {
            gem: { id: 'fireball', name: 'Fireball', color: 'red', type: 'active' },
            supports: [
              { id: 'added_fire', name: 'Added Fire Damage', color: 'red', type: 'support' },
            ],
            slot: 'BodyArmour',
            priority: 'critical',
          },
          {
            gem: { id: 'flame_wall', name: 'Flame Wall', color: 'red', type: 'active' },
            supports: [],
            slot: 'Helm',
            priority: 'important',
          },
        ],
        gear: [
          {
            slot: 'Weapon',
            slotLabel: 'Зброя',
            base: 'Driftwood Wand',
            keyMods: ['+1 to Level of Socketed Spell Gems'],
            budget: 'ssf',
            notes: 'Магічна або рідкісна. +1 gems — найвищий пріоритет.',
          },
          {
            slot: 'BodyArmour',
            slotLabel: 'Броня',
            keyMods: ['+Life', '+Energy Shield'],
            budget: 'ssf',
          },
        ],
      },
      {
        level: 28,
        label: 'Акт 2',
        notes:
          'Пройшли Act 2. Додаємо Spell Echo — величезний DPS бусt. Починаємо шукати нормальну зброю.',
        // TODO(passives): підставити коректний шлях до елементальних/fire нот для Act 2
        passives: [],
        skills: [
          {
            gem: { id: 'fireball', name: 'Fireball', color: 'red', type: 'active' },
            supports: [
              { id: 'spell_echo', name: 'Spell Echo', color: 'blue', type: 'support', minLevel: 18 },
              { id: 'added_fire', name: 'Added Fire Damage', color: 'red', type: 'support' },
              { id: 'controlled_destruction', name: 'Controlled Destruction', color: 'blue', type: 'support' },
            ],
            slot: 'BodyArmour',
            priority: 'critical',
          },
          {
            gem: { id: 'flame_wall', name: 'Flame Wall', color: 'red', type: 'active' },
            supports: [
              { id: 'intensify', name: 'Intensify', color: 'blue', type: 'support' },
            ],
            slot: 'Helm',
            priority: 'important',
          },
          {
            gem: { id: 'frost_blink', name: 'Frost Blink', color: 'blue', type: 'active' },
            supports: [],
            slot: 'Gloves',
            priority: 'important',
          },
        ],
        gear: [
          {
            slot: 'Weapon',
            slotLabel: 'Зброя',
            base: 'Imbued Wand',
            keyMods: ['+1 to Level of Socketed Spell Gems', '% increased Spell Damage'],
            budget: 'low',
            notes: 'Ключово: +1 gems. Все інше вторинне.',
          },
          {
            slot: 'BodyArmour',
            slotLabel: 'Броня',
            base: 'Simple Robe',
            keyMods: ['+Life', '+Energy Shield', 'Resistances'],
            budget: 'ssf',
          },
          {
            slot: 'Helm',
            slotLabel: 'Шолом',
            keyMods: ['+Life', 'Resistances'],
            budget: 'ssf',
          },
        ],
      },
      {
        level: 45,
        label: 'Ранні мапи',
        notes:
          'Середина гри. Додаємо Flammability як curse для Boss боїв. Час серйозно зайнятись шоломом та чоботами.',
        // TODO(passives): запозичити правильний ендгейм-набір з maxroll/PoB build-share.
        // Пуста — щоб не малювати випадкові ноди по всьому дереву.
        passives: [],
        skills: [
          {
            gem: { id: 'fireball', name: 'Fireball', color: 'red', type: 'active' },
            supports: [
              { id: 'spell_echo', name: 'Spell Echo', color: 'blue', type: 'support' },
              { id: 'added_fire', name: 'Added Fire Damage', color: 'red', type: 'support' },
              { id: 'controlled_destruction', name: 'Controlled Destruction', color: 'blue', type: 'support' },
              { id: 'fire_penetration', name: 'Fire Penetration', color: 'red', type: 'support' },
            ],
            slot: 'BodyArmour',
            priority: 'critical',
          },
          {
            gem: { id: 'flammability', name: 'Flammability', color: 'red', type: 'active' },
            supports: [
              { id: 'hextouch', name: 'Hextouch', color: 'blue', type: 'support' },
            ],
            slot: 'Gloves',
            priority: 'important',
          },
          {
            gem: { id: 'frost_blink', name: 'Frost Blink', color: 'blue', type: 'active' },
            supports: [],
            slot: 'Boots',
            priority: 'important',
          },
        ],
        gear: [
          {
            slot: 'Weapon',
            slotLabel: 'Зброя',
            base: 'Imbued Wand',
            keyMods: ['+1 to Level of Socketed Spell Gems', '% increased Fire Damage', '% increased Cast Speed'],
            budget: 'mid',
            notes: 'Ідеально: +1 gems + fire damage + cast speed.',
          },
          {
            slot: 'BodyArmour',
            slotLabel: 'Броня',
            base: 'Vaal Regalia',
            keyMods: ['+80 to maximum Life', '+Energy Shield', 'All Resistances'],
            budget: 'mid',
          },
          {
            slot: 'Boots',
            slotLabel: 'Чоботи',
            keyMods: ['Movement Speed', '+Life', 'Resistances'],
            budget: 'low',
            notes: '25%+ Movement Speed — обов\'язково.',
          },
        ],
      },
    ],
  },
  {
    id: 'monk-stormweaver',
    title: 'Storm Weaver Monk',
    class: 'Monk',
    ascendancy: 'Stormweaver',
    description:
      'Швидкий і динамічний білд для Monk. Відмінний для фарму мап завдяки високій швидкості руху та Chain Lightning.',
    tags: ['intermediate', 'lightning', 'melee-range', 'fast'],
    difficulty: 'intermediate',
    author: 'poe2tracker',
    version: '0.2.0',
    pros: [
      'Висока швидкість руху',
      'Відмінний AoE через Chain Lightning',
      'Приємний геймплей',
    ],
    cons: [
      'Складніший у левелінгу ніж Witch',
      'Потребує хорошого positioning',
      'Менш SSF-friendly',
    ],
    levelingPath: [
      {
        level: 15,
        label: 'Акт 1',
        notes: 'Act 1. Фокус на Storm Strike як головний скіл.',
        // TODO(passives): підставити справжні skill-id для Stormweaver на Monk-старті
        passives: [],
        skills: [
          {
            gem: { id: 'storm_strike', name: 'Storm Strike', color: 'blue', type: 'active' },
            supports: [
              { id: 'added_lightning', name: 'Added Lightning Damage', color: 'blue', type: 'support' },
            ],
            slot: 'Weapon',
            priority: 'critical',
          },
        ],
        gear: [
          {
            slot: 'Weapon',
            slotLabel: 'Зброя',
            base: 'Quarterstaff',
            keyMods: ['% increased Attack Speed', '+Lightning Damage'],
            budget: 'ssf',
          },
        ],
      },
      {
        level: 35,
        label: 'Акт 2–3',
        notes: 'Act 2-3. Chain Lightning для зачистки. Починаємо будувати defensives.',
        passives: [],
        skills: [
          {
            gem: { id: 'storm_strike', name: 'Storm Strike', color: 'blue', type: 'active' },
            supports: [
              { id: 'added_lightning', name: 'Added Lightning Damage', color: 'blue', type: 'support' },
              { id: 'melee_physical', name: 'Melee Physical Damage', color: 'red', type: 'support' },
            ],
            slot: 'Weapon',
            priority: 'critical',
          },
          {
            gem: { id: 'chain_lightning', name: 'Chain Lightning', color: 'blue', type: 'active' },
            supports: [
              { id: 'chain', name: 'Chain', color: 'green', type: 'support' },
            ],
            slot: 'BodyArmour',
            priority: 'important',
          },
        ],
        gear: [
          {
            slot: 'Weapon',
            slotLabel: 'Зброя',
            base: 'Composite Staff',
            keyMods: ['% increased Attack Speed', '+Lightning Damage to Attacks'],
            budget: 'low',
          },
          {
            slot: 'BodyArmour',
            slotLabel: 'Броня',
            keyMods: ['+Life', 'Evasion', 'Resistances'],
            budget: 'ssf',
          },
        ],
      },
    ],
  },
  {
    id: 'ranger-deadeye',
    title: 'Tornado Shot Deadeye',
    class: 'Ranger',
    ascendancy: 'Deadeye',
    description:
      'Класичний bow білд. Tornado Shot покриває весь екран. Відмінний для фарму але потребує хорошого bow в ендгеймі.',
    tags: ['intermediate', 'bow', 'physical', 'mapping'],
    difficulty: 'intermediate',
    author: 'poe2tracker',
    version: '0.2.0',
    pros: [
      'Найкраща зачистка мап серед bow білдів',
      'Великий дальній бій — безпечно',
      'Відмінний для фарму',
    ],
    cons: [
      'Дорогий bow в ендгеймі',
      'Слабший проти боссів',
      'Не SSF-friendly',
    ],
    levelingPath: [
      {
        level: 20,
        label: 'Акт 1–2',
        notes: 'Левелімось на Split Arrow до Tornado Shot.',
        // TODO(passives): підставити справжні skill-id для Deadeye стартового шляху
        passives: [],
        skills: [
          {
            gem: { id: 'split_arrow', name: 'Split Arrow', color: 'green', type: 'active' },
            supports: [
              { id: 'faster_attacks', name: 'Faster Attacks', color: 'green', type: 'support' },
              { id: 'added_cold', name: 'Added Cold Damage', color: 'blue', type: 'support' },
            ],
            slot: 'Weapon',
            priority: 'critical',
          },
        ],
        gear: [
          {
            slot: 'Weapon',
            slotLabel: 'Лук',
            base: 'Short Bow',
            keyMods: ['% increased Physical Damage', '% increased Attack Speed'],
            budget: 'ssf',
          },
        ],
      },
    ],
  },
];

export function getGuideById(id: string): Guide | undefined {
  return guides.find((g) => g.id === id);
}
