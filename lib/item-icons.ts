export const SLOT_ITEM_ICONS: Record<string, string> = {
  Weapon: '/images/items/wand_driftwood.webp',
  Offhand: '/images/items/wand_driftwood.webp',
  Helm: '/images/items/helm.webp',
  Boots: '/images/items/boots.webp',
  Gloves: '/images/items/gloves.webp',
  Bow: '/images/items/bow.webp',
  Staff: '/images/items/staff.webp',
};

export const BASE_ICONS: Record<string, string> = {
  'Driftwood Wand':   '/images/items/wand_driftwood.webp',
  'Imbued Wand':      '/images/items/wand_imbued.webp',
  'Short Bow':        '/images/items/bow.webp',
  'Composite Staff':  '/images/items/staff.webp',
  'Quarterstaff':     '/images/items/staff.webp',
};

export function getItemIcon(slot: string, base?: string): string {
  if (base && BASE_ICONS[base]) return BASE_ICONS[base];
  return SLOT_ITEM_ICONS[slot] ?? '';
}
