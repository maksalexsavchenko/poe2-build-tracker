import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getGuideById, guides } from '@/lib/guides-data';
import DownloadBuildButton from '@/components/DownloadBuildButton';
import GuideContent from '@/components/GuideContent';
import { GuidePlannerLinks } from '@/components/GuidePlannerLinks';
import { AscendancyPassiveMap } from '@/components/AscendancyPassiveMap';
import { getAscendancy } from '@/lib/classes-data';
import { loadAscendancyFromRepoe } from '@/lib/repoe/load-ascendancy-from-repoe';
import { ascendancyToClassId } from '@/lib/poe2-tree/types';

export function generateStaticParams() {
  return guides.map((g) => ({ id: g.id }));
}

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guide = getGuideById(id);
  if (!guide) notFound();

  const asc = getAscendancy(guide.class, guide.ascendancy);
  const { nodes: ascTreeNodes, descriptions: ascTreeDesc, edges: ascTreeEdges } = await loadAscendancyFromRepoe(
    guide.ascendancy,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/builds"
        className="inline-flex items-center gap-1 text-sm mb-6 hover:underline"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Всі гайди
      </Link>

      {/* Header with portrait */}
      <div
        className="rounded-xl border overflow-hidden mb-6"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {asc?.portrait && (
          <div className="relative h-52 overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #2a1a3a 0%, #0d0d0f 70%)' }}>
            <Image
              src={asc.portrait}
              alt={guide.ascendancy}
              fill
              className="object-cover object-center"
              style={{ filter: 'brightness(1.8) contrast(1.1)' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-[#16161a66] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl font-bold" style={{ color: 'var(--gold-light)' }}>
                {guide.title}
              </h1>
              <div className="flex items-center gap-2 text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>{guide.class}</span>
                <span>·</span>
                <span>{guide.ascendancy}</span>
                <span>·</span>
                <span>v{guide.version}</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <p style={{ color: 'var(--text-muted)' }}>{guide.description}</p>
            <DownloadBuildButton guide={guide} />
          </div>

          {/* Pros / Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#22c55e' }}>
                Плюси
              </div>
              <ul className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
                {guide.pros.map((p) => (
                  <li key={p} className="flex items-start gap-1.5">
                    <span style={{ color: '#22c55e' }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#ef4444' }}>
                Мінуси
              </div>
              <ul className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
                {guide.cons.map((c) => (
                  <li key={c} className="flex items-start gap-1.5">
                    <span style={{ color: '#ef4444' }}>✗</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How to use .build */}
      <div
        className="rounded-xl border p-4 mb-6 text-sm"
        style={{ background: '#1a1500', borderColor: '#c8a84b44' }}
      >
        <div className="font-semibold mb-1" style={{ color: 'var(--gold)' }}>
          💡 Як використати .build файл
        </div>
        <ol className="list-decimal list-inside space-y-0.5" style={{ color: 'var(--text-muted)' }}>
          <li>Натисни <strong style={{ color: 'var(--text)' }}>«Скачати .build»</strong> вище</li>
          <li>
            Скопіюй файл у{' '}
            <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--surface-2)' }}>
              Documents\My Games\Path of Exile 2\BuildPlanner\
            </code>
          </li>
          <li>В грі відкрий Build Planner → Import → обери файл</li>
        </ol>
      </div>

      <GuidePlannerLinks guide={guide} ascendancyClassId={ascendancyToClassId(guide.ascendancy)} />

      <AscendancyPassiveMap
        ascendancyName={guide.ascendancy}
        classId={ascendancyToClassId(guide.ascendancy)}
        nodes={ascTreeNodes}
        descriptions={ascTreeDesc}
        edges={ascTreeEdges}
      />

      {/* Leveling path — tabbed + skills panel */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--gold)' }}>
          Leveling Path
        </h2>
        <GuideContent guide={guide} />
      </div>
    </div>
  );
}
