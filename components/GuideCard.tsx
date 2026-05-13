import Link from 'next/link';
import Image from 'next/image';
import { Guide } from '@/lib/types';
import { getAscendancy } from '@/lib/classes-data';

const difficultyLabel: Record<string, string> = {
  beginner: 'Початківець',
  intermediate: 'Середній',
  advanced: 'Просунутий',
};
const difficultyColor: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
};

interface Props {
  guide: Guide;
}

export default function GuideCard({ guide }: Props) {
  const asc = getAscendancy(guide.class, guide.ascendancy);

  return (
    <Link
      href={`/builds/${guide.id}`}
      className="rounded-xl border flex flex-col overflow-hidden transition-all hover:border-[#c8a84b55] hover:bg-[#1a1a20] group"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Portrait banner */}
      <div className="relative h-36 overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #2a1a3a 0%, #0d0d0f 70%)' }}>
        {asc?.portrait ? (
          <Image
            src={asc.portrait}
            alt={guide.ascendancy}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            style={{ filter: 'brightness(1.8) contrast(1.1)' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">⚔</div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] via-[#16161a66] to-transparent" />

        {/* Difficulty badge */}
        <div className="absolute top-2 right-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{
              background: (difficultyColor[guide.difficulty] ?? '#888') + '33',
              color: difficultyColor[guide.difficulty],
            }}
          >
            {difficultyLabel[guide.difficulty]}
          </span>
        </div>

        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-base leading-tight" style={{ color: 'var(--gold-light)' }}>
            {guide.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{guide.class}</span>
            <span>·</span>
            <span>{guide.ascendancy}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
          {guide.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {guide.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="flex items-center justify-between text-xs pt-2 border-t"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <span>{guide.levelingPath.length} checkpoints</span>
          <span className="font-medium group-hover:underline" style={{ color: 'var(--gold)' }}>
            Відкрити →
          </span>
        </div>
      </div>
    </Link>
  );
}
