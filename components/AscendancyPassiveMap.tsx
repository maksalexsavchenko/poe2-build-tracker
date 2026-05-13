import type { Poe2NodeRow } from '@/lib/poe2-tree/types';

type Props = {
  ascendancyName: string;
  nodes: Poe2NodeRow[];
  descriptions: Record<string, { name?: string; stats?: string[] }>;
};

function strokeFor(kind: string): string {
  if (kind === 'notable') return '#c8a84b';
  if (kind === 'small') return '#6b6b82';
  return '#888888';
}

function radiusFor(kind: string): number {
  if (kind === 'notable') return 0.008;
  if (kind === 'small') return 0.0045;
  return 0.005;
}

export function AscendancyPassiveMap({ ascendancyName, nodes, descriptions }: Props) {
  if (nodes.length === 0) {
    return (
      <div
        className="rounded-xl border p-6 mb-6 text-sm"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--gold)' }}>
          Пасивне дерево (ascendancy)
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Для «{ascendancyName}» не знайдено нод у vendored{' '}
          <a
            href="https://github.com/marcoaaguiar/poe2-tree"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            poe2-tree
          </a>
          . Запусти <code className="text-xs">npm run vendor:game-data</code>.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border overflow-hidden mb-6"
      style={{ background: '#08080f', borderColor: 'var(--border)' }}
    >
      <div
        className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>
          Пасивне дерево — {ascendancyName}
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Координати та ноди з{' '}
          <a
            href="https://github.com/marcoaaguiar/poe2-tree"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            marcoaaguiar/poe2-tree
          </a>
        </span>
      </div>
      <div className="relative w-full aspect-[16/10] max-h-[min(420px,50vh)]">
        <svg
          viewBox="0 0 1 1"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Ascendancy passive layout for ${ascendancyName}`}
        >
          <rect width="1" height="1" fill="#0d0d14" />
          {nodes.map((n) => {
            const d = descriptions[n.id];
            const tip = d?.name
              ? `${d.name}${d.stats?.length ? '\n' + d.stats.join('\n') : ''}`
              : n.id;
            const r = radiusFor(n.kind);
            return (
              <g key={n.id}>
                <title>{tip}</title>
                <circle cx={n.x} cy={n.y} r={r} fill={strokeFor(n.kind)} opacity={0.92} />
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs px-4 py-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        Наведи курсор на крапку — підказка з назвою та статами (SVG title).
      </p>
    </div>
  );
}
