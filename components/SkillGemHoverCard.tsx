'use client';

import Image from 'next/image';
import { Gem, SkillSetup } from '@/lib/types';
import { getGemIcon } from '@/lib/classes-data';

export const GEM_C = {
  red: { bg: '#1e0808', border: '#9a3030', glow: '#c44040', text: '#e87070', socket: '#3a1010' },
  green: { bg: '#081e08', border: '#2a7a2a', glow: '#3a9a3a', text: '#6abf6a', socket: '#103010' },
  blue: { bg: '#08082a', border: '#2a3a9a', glow: '#3a50c4', text: '#7090e8', socket: '#101040' },
} as const;

const PRIORITY_COLOR: Record<string, string> = {
  critical: '#ef4444',
  important: '#eab308',
  optional: '#22c55e',
};
const PRIORITY_LABEL: Record<string, string> = {
  critical: 'Критично',
  important: 'Важливо',
  optional: 'Бажано',
};

export function GemCircle({ gem, size = 40 }: { gem: Gem; size?: number }) {
  const icon = getGemIcon(gem.id);
  const c = GEM_C[gem.color];
  return (
    <div
      className="rounded-full shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${c.socket}, #050508)`,
        boxShadow: `0 0 0 2px ${c.border}, 0 0 8px ${c.glow}44, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      {icon ? (
        <Image src={icon} alt={gem.name} width={size - 4} height={size - 4} className="object-cover" />
      ) : (
        <span className="text-[9px] font-bold" style={{ color: c.text }}>
          {gem.type === 'support' ? 'S' : 'A'}
        </span>
      )}
    </div>
  );
}

export function SocketCircle({ gem }: { gem?: Gem }) {
  const icon = gem ? getGemIcon(gem.id) : null;
  const c = gem ? GEM_C[gem.color] : null;
  return (
    <div
      title={gem?.name}
      className="rounded-full shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        width: 28,
        height: 28,
        background: c ? `radial-gradient(circle at 35% 35%, ${c.socket}, #050508)` : 'transparent',
        boxShadow: c ? `0 0 0 1.5px ${c.border}, 0 0 6px ${c.glow}33` : 'none',
      }}
    >
      {icon && gem ? (
        <Image src={icon} alt={gem.name} width={26} height={26} className="object-cover" />
      ) : (
        <Image src="/images/ui/blankgem.webp" alt="empty" width={28} height={28} className="object-cover opacity-60" />
      )}
    </div>
  );
}

/** Hover-картка зліва від рядка скіла (як у класичному GuideContent). */
export function SkillGemHoverPopup({ skill }: { skill: SkillSetup }) {
  const c = GEM_C[skill.gem.color];
  return (
    <div
      className="absolute z-50 w-64 rounded-xl border text-sm pointer-events-none"
      style={{
        right: 'calc(100% + 10px)',
        top: 0,
        background: 'linear-gradient(160deg, #0e0e18 0%, #08080f 100%)',
        borderColor: c.border,
        boxShadow: `0 0 0 1px #06060c, 0 0 20px ${c.glow}22, 0 16px 40px rgba(0,0,0,0.9)`,
      }}
    >
      <div
        className="flex items-center gap-2.5 px-3 py-2.5"
        style={{ background: c.bg + 'cc', borderRadius: '11px 11px 0 0', borderBottom: `1px solid ${c.border}44` }}
      >
        <GemCircle gem={skill.gem} size={36} />
        <div className="flex-1 min-w-0">
          <div
            className="text-sm font-semibold uppercase tracking-wide leading-tight"
            style={{ color: '#e0d8c8', fontFamily: 'serif' }}
          >
            {skill.gem.name}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: '#5a5a7a' }}>
            {skill.slot}
          </div>
        </div>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0"
          style={{ background: PRIORITY_COLOR[skill.priority] + '22', color: PRIORITY_COLOR[skill.priority] }}
        >
          {PRIORITY_LABEL[skill.priority]}
        </span>
      </div>

      {skill.supports.length > 0 ? (
        <div className="px-3 py-2.5 space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#3a3a5a' }}>
            Підтримки
          </div>
          {skill.supports.map((sup) => {
            const sc = GEM_C[sup.color];
            const icon = getGemIcon(sup.id);
            return (
              <div key={sup.id} className="flex items-center gap-2">
                <div
                  className="rounded-full shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    width: 22,
                    height: 22,
                    background: `radial-gradient(circle at 35% 35%, ${sc.socket}, #050508)`,
                    boxShadow: `0 0 0 1px ${sc.border}`,
                  }}
                >
                  {icon && <Image src={icon} alt={sup.name} width={18} height={18} className="object-cover" />}
                </div>
                <span className="text-xs" style={{ color: sc.text }}>
                  {sup.name}
                </span>
                {sup.minLevel && (
                  <span className="ml-auto text-[10px]" style={{ color: '#2a2a4a' }}>
                    lv{sup.minLevel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-3 py-2 text-xs italic" style={{ color: '#2a2a4a' }}>
          Без підтримок
        </div>
      )}
    </div>
  );
}
