'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Guide, SkillSetup, Gem } from '@/lib/types';
import { getGemIcon } from '@/lib/classes-data';
import ItemTooltip from './ItemTooltip';

const GEM_C = {
  red:   { bg: '#1e0808', border: '#9a3030', glow: '#c44040', text: '#e87070', socket: '#3a1010' },
  green: { bg: '#081e08', border: '#2a7a2a', glow: '#3a9a3a', text: '#6abf6a', socket: '#103010' },
  blue:  { bg: '#08082a', border: '#2a3a9a', glow: '#3a50c4', text: '#7090e8', socket: '#101040' },
} as const;

const PRIORITY_COLOR: Record<string, string> = {
  critical: '#ef4444', important: '#eab308', optional: '#22c55e',
};
const PRIORITY_LABEL: Record<string, string> = {
  critical: 'Критично', important: 'Важливо', optional: 'Бажано',
};

/* Round gem icon — like PoE2 skill icon */
function GemCircle({ gem, size = 40 }: { gem: Gem; size?: number }) {
  const icon = getGemIcon(gem.id);
  const c = GEM_C[gem.color];
  return (
    <div
      className="rounded-full shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        width: size, height: size,
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

/* Support socket — small circle, filled if gem present */
function SocketCircle({ gem }: { gem?: Gem }) {
  const icon = gem ? getGemIcon(gem.id) : null;
  const c = gem ? GEM_C[gem.color] : null;
  return (
    <div
      title={gem?.name}
      className="rounded-full shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        width: 28, height: 28,
        background: c
          ? `radial-gradient(circle at 35% 35%, ${c.socket}, #050508)`
          : 'transparent',
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

/* Hover popup — appears left of the skills panel */
function SkillPopup({ skill }: { skill: SkillSetup }) {
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
          <div className="text-sm font-semibold uppercase tracking-wide leading-tight" style={{ color: '#e0d8c8', fontFamily: 'serif' }}>
            {skill.gem.name}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: '#5a5a7a' }}>{skill.slot}</div>
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
                    width: 22, height: 22,
                    background: `radial-gradient(circle at 35% 35%, ${sc.socket}, #050508)`,
                    boxShadow: `0 0 0 1px ${sc.border}`,
                  }}
                >
                  {icon && <Image src={icon} alt={sup.name} width={18} height={18} className="object-cover" />}
                </div>
                <span className="text-xs" style={{ color: sc.text }}>{sup.name}</span>
                {sup.minLevel && (
                  <span className="ml-auto text-[10px]" style={{ color: '#2a2a4a' }}>lv{sup.minLevel}</span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-3 py-2 text-xs italic" style={{ color: '#2a2a4a' }}>Без підтримок</div>
      )}
    </div>
  );
}

const MAX_SOCKETS = 6;

function SkillRow({ skill, isLast }: { skill: SkillSetup; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  const sockets = Array.from({ length: MAX_SOCKETS }, (_, i) => skill.supports[i] as Gem | undefined);
  const c = GEM_C[skill.gem.color];

  return (
    <div
      className="relative flex items-center gap-3 px-4 py-3 cursor-default"
      style={{
        borderBottom: isLast ? 'none' : '1px solid #14141e',
        background: hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        transition: 'background 0.15s',
        overflow: 'visible',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Round skill icon */}
      <GemCircle gem={skill.gem} size={42} />

      {/* Name + sockets */}
      <div className="flex-1 min-w-0">
        {/* Name row */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-sm font-semibold uppercase tracking-wide leading-none"
            style={{ color: '#d8d0c0', fontFamily: 'serif', letterSpacing: '0.06em' }}
          >
            {skill.gem.name}
          </span>
          {/* Level indicator bar (decorative) */}
          <div className="flex-1 h-px" style={{ background: '#1a1a28' }}>
            <div className="h-px" style={{ width: '12%', background: c.border }} />
          </div>
        </div>

        {/* Support sockets */}
        <div className="flex gap-1.5">
          {sockets.map((sup, i) => (
            <SocketCircle key={i} gem={sup} />
          ))}
        </div>
      </div>

      {hovered && <SkillPopup skill={skill} />}
    </div>
  );
}

interface Props {
  guide: Guide;
}

export default function GuideContent({ guide }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const checkpoint = guide.levelingPath[activeIdx];

  return (
    <div>
      {/* Phase tabs */}
      <div className="flex gap-0.5 border-b mb-6" style={{ borderColor: '#22223a' }}>
        {guide.levelingPath.map((cp, i) => {
          const isActive = activeIdx === i;
          return (
            <button
              key={cp.level}
              onClick={() => setActiveIdx(i)}
              className="relative px-5 py-2.5 text-sm font-medium transition-colors"
              style={{
                color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                background: isActive ? 'rgba(200,168,75,0.07)' : 'transparent',
                borderRadius: '6px 6px 0 0',
                fontFamily: isActive ? 'serif' : undefined,
              }}
            >
              {cp.label ?? `Рівень ${cp.level}`}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t" style={{ background: 'var(--gold)' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Split: left = notes + gear, right = SKILLS panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* Left */}
        <div className="flex flex-col gap-5">
          {checkpoint.notes && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {checkpoint.notes}
            </p>
          )}

          {checkpoint.gear.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#3a3a5a' }}>
                Gear
              </div>
              <div className="flex flex-col gap-2">
                {checkpoint.gear.map((item) => (
                  <ItemTooltip key={item.slot} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: SKILLS panel */}
        {checkpoint.skills.length > 0 && (
          <div
            className="rounded-xl"
            style={{
              background: 'linear-gradient(180deg, #0c0c16 0%, #080810 100%)',
              border: '1px solid #1e1e32',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              overflow: 'visible',
            }}
          >
            {/* "SKILLS" titlebar image */}
            <div
              className="w-full"
              style={{
                backgroundImage: 'url(/images/ui/skills_titlebar.webp)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                aspectRatio: '972 / 156',
              }}
            />

            {/* Skill rows */}
            <div style={{ overflow: 'visible' }}>
              {checkpoint.skills.map((skill, i) => (
                <SkillRow
                  key={skill.gem.id}
                  skill={skill}
                  isLast={i === checkpoint.skills.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
