import type { Guide } from '@/lib/types';
import { DATA_SOURCES } from '@/lib/vendor/data-sources';

const POB_POE2 = 'https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2';
const REPOE = DATA_SOURCES.repoePoe2.browse;
const REPOE_TREES = DATA_SOURCES.repoePoe2.passiveTreesIndex;

type Props = {
  guide: Guide;
  ascendancyClassId: string;
};

export function GuidePlannerLinks({ guide, ascendancyClassId }: Props) {
  const maxrollUrl = guide.maxrollTreeProfile
    ? `https://maxroll.gg/poe2/tree/${guide.maxrollTreeProfile}/0`
    : null;
  const marcoUrl = `https://marcoaaguiar.github.io/poe2-tree/?a=${encodeURIComponent(ascendancyClassId)}`;

  return (
    <div
      className="rounded-xl border p-4 mb-6 text-sm space-y-3"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <h3 className="text-base font-semibold" style={{ color: 'var(--gold)' }}>
        Дерево пасивок і планери
      </h3>
      <p className="text-xs leading-relaxed -mt-1" style={{ color: 'var(--text-muted)' }}>
        Пасивне дерево ascendancy на сторінці гайда будується з vendored RePoE (
        <code className="text-[11px]">passive-tree-Default.min.json</code>). Повний каталог гри (моди, uniques,
        інші дерева) — на{' '}
        <a href={REPOE} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--gold-light)' }}>
          repoe-fork.github.io/poe2
        </a>
        ; індекс дерев:{' '}
        <a href={REPOE_TREES} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--gold-light)' }}>
          passive_skill_trees
        </a>
        . Після <code className="text-[11px]">npm run vendor:game-data</code> ті самі JSON доступні з сайту як{' '}
        <code className="text-[11px]">/api/game/repoe/mods.min.json</code>,{' '}
        <code className="text-[11px]">/api/game/repoe/stat_translations/passive_skill_stat_descriptions.min.json</code> тощо.
      </p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Сирі бандли клієнта зазвичай розпаковують інструментами з{' '}
        <a
          href={DATA_SOURCES.ggpkExposed.org}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: 'var(--gold-light)' }}
        >
          github.com/ggpk-exposed
        </a>
        ; каталог PoE1 (інший ігровий клієнт) —{' '}
        <a
          href={DATA_SOURCES.repoePoe2.browsePoe1}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: 'var(--gold-light)' }}
        >
          repoe-fork.github.io
        </a>
        .
      </p>

      {maxrollUrl ? (
        <div className="space-y-2">
          <p style={{ color: 'var(--text-muted)' }}>
            На Maxroll.gg дерево з canvas (як у їхніх гайдах) працює лише на їхньому сайті — через{' '}
            <code className="text-xs px-1 rounded" style={{ background: 'var(--surface-2)' }}>
              X-Frame-Options: SAMEORIGIN
            </code>{' '}
            ми не можемо вставити той самий віджет у iframe на poe2-builder. Натомість — пряме посилання на
            твій build у їхньому планері.
          </p>
          <a
            href={maxrollUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
            style={{
              borderColor: 'var(--gold)',
              color: 'var(--gold-light)',
              background: 'var(--surface-2)',
            }}
          >
            Відкрити повне дерево на Maxroll.gg
            <span aria-hidden>↗</span>
          </a>
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)' }}>
          Щоб додати кнопку на Maxroll (як у їхніх embed із{' '}
          <code className="text-xs px-1 rounded" style={{ background: 'var(--surface-2)' }}>
            data-poe2-profile
          </code>
          ), вкажи у даних гайда поле <code className="text-xs">maxrollTreeProfile</code> — id з URL{' '}
          <code className="text-xs">/poe2/tree/<em>ось-тут</em>/0</code>.
        </p>
      )}

      <ul className="list-disc list-inside space-y-1 pt-1" style={{ color: 'var(--text-muted)' }}>
        <li>
          <a
            href={marcoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--gold-light)' }}
          >
            Інтерактивне дерево (community, marcoaaguiar/poe2-tree)
          </a>{' '}
          — альтернативний переглядач; координати там не збігаються 1:1 з RePoE на нашому сайті.
        </li>
        <li>
          <a href={POB_POE2} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--gold-light)' }}>
            Path of Building — PoE2
          </a>{' '}
          (десктоп): імпорт .build, повний калькулятор —{' '}
          <a
            href={`${POB_POE2}/releases`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--gold-light)' }}
          >
            релізи
          </a>
          .
        </li>
      </ul>
    </div>
  );
}
