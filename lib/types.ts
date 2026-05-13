export type GemColor = 'red' | 'green' | 'blue';
export type Priority = 'critical' | 'important' | 'optional';
export type Budget = 'ssf' | 'low' | 'mid' | 'high';
export type GemType = 'active' | 'support' | 'spirit';

export interface Gem {
  id: string;
  name: string;
  color: GemColor;
  type: GemType;
  minLevel?: number;
}

export interface SkillSetup {
  gem: Gem;
  supports: Gem[];
  slot: string;
  priority: Priority;
}

export interface GearRecommendation {
  slot: string;
  slotLabel: string;
  base?: string;
  keyMods: string[];
  budget: Budget;
  notes?: string;
}

export interface LevelingCheckpoint {
  level: number;
  label?: string;
  passives: number[];
  skills: SkillSetup[];
  gear: GearRecommendation[];
  notes?: string;
}

export interface Guide {
  id: string;
  title: string;
  class: string;
  ascendancy: string;
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: string;
  version: string;
  levelingPath: LevelingCheckpoint[];
  pros: string[];
  cons: string[];
  /**
   * Короткий id з URL Maxroll: `https://maxroll.gg/poe2/tree/{id}/0`
   * (як `data-poe2-profile` у їхньому embed). Якщо задано — показуємо кнопку «повне дерево на Maxroll».
   * У iframe з нашого домену їхній планер не відкриється (SAMEORIGIN), тільки посилання.
   */
  maxrollTreeProfile?: string;
}
