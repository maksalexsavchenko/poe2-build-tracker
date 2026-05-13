'use client';

import { useState } from 'react';
import type { Poe2NodeRow } from '@/lib/poe2-tree/types';

type Props = {
  ascendancyName: string;
  /** Для зовнішнього посилання на marcoaaguiar/poe2-tree (?a=). */
  classId: string;
  nodes: Poe2NodeRow[];
  descriptions: Record<string, { name?: string; stats?: string[] }>;
  /** Ребра між hash-id (RePoE `connections` у межах ascendancy). */
  edges: [string, string][];
};

function strokeFor(kind: string): string {
  if (kind === 'keystone') return '#5fd35f';
  if (kind === 'notable') return '#c8a84b';
  return '#9a9ab8';
}

function radiusFor(kind: string): number {
  if (kind === 'keystone') return 0.022;
  if (kind === 'notable') return 0.018;
  return 0.012;
}

export function AscendancyPassiveMap({ ascendancyName, classId, nodes, descriptions, edges }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);

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
          Для «{ascendancyName}» не знайдено нод у vendored RePoE (
          <a
            href="https://repoe-fork.github.io/poe2/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            repoe-fork.github.io/poe2
          </a>
          ). Запусти <code className="text-xs">npm run vendor:game-data</code> — мають з’явитися{' '}
          <code className="text-xs">public/data/repoe-poe2/</code>.
        </p>
      </div>
    );
  }

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const hovered = hoverId ? descriptions[hoverId] : null;
  const hoveredNode = hoverId ? nodes.find((n) => n.id === hoverId) : undefined;

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
        <span className="text-xs text-right max-w-[min(100%,20rem)]" style={{ color: 'var(--text-muted)' }}>
          Дані та геометрія з{' '}
          <a href="https://repoe-fork.github.io/poe2/" className="underline" target="_blank" rel="noreferrer">
            RePoE PoE2
          </a>
          {' · '}
          <a
            href={`https://marcoaaguiar.github.io/poe2-tree/?a=${encodeURIComponent(classId)}`}
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            інтерактив (poe2-tree)
          </a>
        </span>
      </div>

      <div
        className="relative w-full aspect-[16/10] max-h-[min(520px,62vh)] min-h-[260px] select-none"
        style={{ background: '#0d0d14' }}
      >
        <svg
          viewBox="0 0 1 1"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Ascendancy passive tree for ${ascendancyName}`}
        >
          <rect width={1} height={1} fill="#0a0a12" />
          {edges.map(([a, b], i) => {
            const na = byId.get(a);
            const nb = byId.get(b);
            if (!na || !nb) return null;
            return (
              <line
                key={`${a}-${b}-${i}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="#3d3d55"
                strokeWidth={0.004}
                strokeLinecap="round"
              />
            );
          })}
          {nodes.map((n) => {
            const r = radiusFor(n.kind);
            const d = descriptions[n.id];
            const tip = d?.name ? `${d.name}${d.stats?.length ? '\n' + d.stats.join('\n') : ''}` : n.id;
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r * 2.2}
                  fill="transparent"
                  className="cursor-default"
                  onMouseEnter={() => setHoverId(n.id)}
                  onMouseLeave={() => setHoverId((cur) => (cur === n.id ? null : cur))}
                >
                  <title>{tip}</title>
                </circle>
                <circle cx={n.x} cy={n.y} r={r} fill={strokeFor(n.kind)} opacity={0.9} pointerEvents="none" />
              </g>
            );
          })}
        </svg>
      </div>

      <div
        className="text-xs px-4 py-2 border-t min-h-[2.75rem]"
        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        {hovered?.name ? (
          <div>
            <span className="font-medium" style={{ color: 'var(--gold)' }}>
              {hovered.name}
            </span>
            {hovered.stats?.length ? (
              <div className="mt-1 space-y-0.5 font-mono text-[11px] leading-snug opacity-90">
                {hovered.stats.slice(0, 8).map((s) => (
                  <div key={s}>{s}</div>
                ))}
                {hovered.stats.length > 8 ? <div>…</div> : null}
              </div>
            ) : null}
            {hoveredNode ? (
              <div className="mt-1 opacity-70">
                hash: {hoveredNode.id} · {hoveredNode.kind}
              </div>
            ) : null}
          </div>
        ) : (
          <span>
            Наведи на ноду — підказка та сирі stat-id з RePoE (повний переклад — через{' '}
            <code className="text-[11px]">stat_translations</code> у тому ж каталозі).
          </span>
        )}
      </div>
    </div>
  );
}
