import { deflateSync } from 'zlib';
import { Guide } from './types';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildXml(guide: Guide): string {
  const lastCheckpoint = guide.levelingPath.at(-1);
  const maxLevel = lastCheckpoint?.level ?? 60;

  const notesLines = guide.levelingPath
    .map((cp) => `[Level ${cp.level}] ${cp.notes ?? ''}`)
    .join('\n');

  const skillsXml = guide.levelingPath
    .flatMap((cp) => cp.skills)
    .filter((s, i, arr) => arr.findIndex((x) => x.gem.id === s.gem.id) === i)
    .map((s) => {
      const gemsXml = [
        `<Gem nameSpec="${escapeXml(s.gem.name)}" level="1" quality="0" enabled="true"/>`,
        ...s.supports.map(
          (sup) =>
            `<Gem nameSpec="${escapeXml(sup.name)}" level="1" quality="0" enabled="true" skillId="Support${sup.id.replace(/_/g, '')}"/>`
        ),
      ].join('\n        ');
      return `    <Skill slot="${escapeXml(s.slot)}" enabled="true" mainActiveSkillCalcs="1">
      ${gemsXml}
    </Skill>`;
    })
    .join('\n');

  const specXml = guide.levelingPath
    .map(
      (cp) =>
        `    <Spec title="Level ${cp.level}" nodes="${cp.passives.join(',')}"/>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<PathOfBuilding>
  <Build level="${maxLevel}" targetVersion="2_0" class="${escapeXml(guide.class)}" ascendClassName="${escapeXml(guide.ascendancy)}">
    <Notes>${escapeXml(guide.title + '\n\n' + guide.description + '\n\n' + notesLines)}</Notes>
  </Build>
  <Skills activeSkillSet="1">
    <SkillSet id="1">
${skillsXml}
    </SkillSet>
  </Skills>
  <Tree activeSpec="1">
${specXml}
  </Tree>
</PathOfBuilding>`;
}

export function generateBuildCode(guide: Guide): string {
  const xml = buildXml(guide);
  const compressed = deflateSync(Buffer.from(xml, 'utf-8'));
  return compressed
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function generateBuildXml(guide: Guide): string {
  return buildXml(guide);
}
