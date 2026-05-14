'use client';

import { useState } from 'react';
import { Guide } from '@/lib/types';
import ItemTooltip from './ItemTooltip';
import Poe2PlannerSkillFrame from './Poe2PlannerSkillFrame';

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

        {/* Right: skills — Maxroll-style frame (local-docs/SkillGems.scss) */}
        {checkpoint.skills.length > 0 && (
          <Poe2PlannerSkillFrame
            skills={checkpoint.skills}
            stepTitle={
              checkpoint.label
                ? `${checkpoint.label} · рів. ${checkpoint.level}`
                : `Рівень ${checkpoint.level}`
            }
            canPrev={activeIdx > 0}
            canNext={activeIdx < guide.levelingPath.length - 1}
            onPrev={() => setActiveIdx((i) => Math.max(0, i - 1))}
            onNext={() => setActiveIdx((i) => Math.min(guide.levelingPath.length - 1, i + 1))}
          />
        )}
      </div>
    </div>
  );
}
