'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { SkillSetup } from '@/lib/types';
import { getGemIcon } from '@/lib/classes-data';
import { SkillGemHoverPopup } from '@/components/SkillGemHoverCard';

const MAX_SUPPORTS = 5;

type Props = {
  skills: SkillSetup[];
  stepTitle: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * Візуал як у Maxroll PoE2 planner: `local-docs/SkillGems.scss` + фон з CDN.
 * Стилі: `app/styles/poe2-planner-maxroll.css` (збирається `npm run build:planner-css`).
 */
export default function Poe2PlannerSkillFrame({
  skills,
  stepTitle,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="poe2planner-wrapper mx-auto" style={{ maxWidth: 430 }}>
      <div className="poe2-SkillGems">
        <div className="poe2-BkgStack">
          <div className="poe2-TitleBarBkg">
            <p className="poe2-TitleBar-Title">Skills</p>
          </div>
          <div className="poe2-SkillsBkg" />
        </div>

        <div className="poe2-step-title">
          <button type="button" className="poe2-step-title-btn" disabled={!canPrev} onClick={onPrev}>
            Prev
          </button>
          <span className="poe2-step-title-text">{stepTitle}</span>
          <button type="button" className="poe2-step-title-btn" disabled={!canNext} onClick={onNext}>
            Next
          </button>
        </div>

        <div className="poe2-body">
          <div className="poe2-skills">
            {skills.map((skill) => (
              <PlannerSkillSlot key={`${skill.gem.id}-${skill.slot}`} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlannerSkillSlot({ skill }: { skill: SkillSetup }) {
  const [hovered, setHovered] = useState(false);
  const mainUrl = getGemIcon(skill.gem.id);
  const supports = skill.supports.slice(0, MAX_SUPPORTS);

  return (
    <div
      className="poe2-skill-slot relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="poe2-gem-list-preview">
        <div className="poe2-SkillsMainBkg" aria-hidden />
        <div className="poe2-gem-list-main-skill">
          <div
            className="poe2-icon"
            style={mainUrl ? { backgroundImage: `url("${mainUrl}")` } : undefined}
          />
        </div>
        <div className="poe2-gem-list-main-skill-desc">{skill.gem.name}</div>
      </div>

      <div className="poe2-gem-list">
        <div className="poe2-gem poe2-gem-white">
          <div className="poe2-gem-mask">
            {mainUrl ? (
              <Image src={mainUrl} alt={skill.gem.name} width={48} height={48} unoptimized className="object-contain" />
            ) : (
              <span className="text-[10px] text-center w-full block opacity-60">?</span>
            )}
          </div>
        </div>
        {supports.map((sup) => {
          const url = getGemIcon(sup.id);
          return (
            <div key={sup.id} className="poe2-gem poe2-gem-white">
              <div className="poe2-gem-mask">
                {url ? (
                  <Image src={url} alt={sup.name} width={32} height={32} unoptimized className="object-contain" />
                ) : (
                  <span className="text-[8px] opacity-50">S</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hovered && <SkillGemHoverPopup skill={skill} />}
    </div>
  );
}
