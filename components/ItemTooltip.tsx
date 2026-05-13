import Image from 'next/image';
import { GearRecommendation } from '@/lib/types';
import { getItemIcon } from '@/lib/item-icons';

const budgetLabel: Record<string, string> = {
  ssf: 'SSF', low: 'Бюджет', mid: 'Середній', high: 'Топ',
};
const budgetColor: Record<string, string> = {
  ssf: '#6b7280', low: '#22c55e', mid: '#eab308', high: '#ef4444',
};

interface Props {
  item: GearRecommendation;
}

export default function ItemTooltip({ item }: Props) {
  const icon = getItemIcon(item.slot, item.base);

  return (
    <div
      className="rounded border-2 overflow-hidden text-sm"
      style={{
        background: 'linear-gradient(180deg, #0c0c10 0%, #08080c 100%)',
        borderColor: '#8a6a1a',
        boxShadow: '0 0 0 1px #1a1400, inset 0 0 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Item header */}
      <div
        className="px-3 pt-3 pb-2 text-center"
        style={{ background: 'linear-gradient(180deg, #1a1000 0%, transparent 100%)' }}
      >
        <div className="flex items-start gap-3">
          {/* Item icon */}
          {icon && (
            <div
              className="shrink-0 w-12 h-12 flex items-center justify-center rounded"
              style={{ background: 'rgba(0,0,0,0.4)' }}
            >
              <Image src={icon} alt={item.slotLabel} width={44} height={44} className="object-contain" />
            </div>
          )}

          <div className="flex-1 text-left">
            {/* Rarity line (yellow = rare target) */}
            <div className="font-bold leading-tight" style={{ color: '#c8a84b', fontFamily: 'serif' }}>
              {item.base ?? item.slotLabel}
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#a0a0b0' }}>
              {item.slotLabel}
            </div>
          </div>

          {/* Budget badge */}
          <span
            className="text-xs px-1.5 py-0.5 rounded font-semibold shrink-0"
            style={{ background: budgetColor[item.budget] + '22', color: budgetColor[item.budget] }}
          >
            {budgetLabel[item.budget]}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="relative h-px mx-2" style={{ background: 'linear-gradient(90deg, transparent, #8a6a1a, transparent)' }} />

      {/* Mods */}
      <div className="px-3 py-2 space-y-1">
        {item.keyMods.map((mod) => (
          <div key={mod} className="flex items-start gap-1.5 text-xs" style={{ color: '#8888ff' }}>
            <span style={{ color: '#5a5a8a' }} className="shrink-0 mt-0.5">◆</span>
            <span>{mod}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      {item.notes && (
        <>
          <div className="relative h-px mx-2" style={{ background: 'linear-gradient(90deg, transparent, #3a3a4a, transparent)' }} />
          <div className="px-3 py-2 text-xs italic" style={{ color: '#7a7a8a' }}>
            {item.notes}
          </div>
        </>
      )}
    </div>
  );
}
