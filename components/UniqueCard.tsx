/**
 * Server component — рендерить унікалку «як у грі»:
 *   іконка | назва + baseType + список модів + flavour-курсив
 *
 * Дані тягнемо з public/data/poe2db/uniques.json (вендоринг —
 * `npm run vendor:poe2db`). Знаходження — за slug або name.
 *
 * PoE-link синтаксис у мод-рядках (`[Physical_Damage|Physical]`) парситься
 * helper-ом з lib/poe2db/types.ts і рендериться <a href="/wiki/Physical_Damage">.
 *
 * Якщо унік не знайдений — компонент тихо нічого не повертає; це безпечно
 * для guide-pages, які можуть посилатися на ще-не-вендорені/недоступні
 * предмети (унік міг бути перейменований у новому патчі).
 */
import Image from 'next/image';
import { findUnique } from '@/lib/poe2db/load';
import { parsePoeLinks } from '@/lib/poe2db/types';

type Props = {
  /** Канонічний slug із poe2db (напр. "Bramblejack") або повна назва. */
  slug: string;
  /** Якщо true — без рамки, лише іконка + назва (для inline-показу). */
  compact?: boolean;
};

function ModLine({ text }: { text: string }) {
  const tokens = parsePoeLinks(text);
  return (
    <p className="text-sm leading-snug" style={{ color: '#8888ff' }}>
      {tokens.map((t, i) => {
        if (t.kind === 'text') return <span key={i}>{t.text}</span>;
        return (
          <a
            key={i}
            href={`https://poe2db.tw/us/${t.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted"
            style={{ color: '#a0a0ff', textDecorationColor: 'rgba(160,160,255,0.4)' }}
          >
            {t.text}
          </a>
        );
      })}
    </p>
  );
}

export async function UniqueCard({ slug, compact = false }: Props) {
  const u = await findUnique(slug);
  if (!u) return null;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 align-middle">
        {u.icon && (
          <Image
            src={u.icon}
            alt={u.name}
            width={24}
            height={24}
            unoptimized
            className="inline-block"
          />
        )}
        <span style={{ color: '#af6025' }}>{u.name}</span>
      </span>
    );
  }

  return (
    <div
      className="inline-flex flex-col items-stretch rounded border max-w-md"
      style={{
        background: 'rgba(0,0,0,0.85)',
        borderColor: '#73482b',
        color: '#c8c8d8',
      }}
    >
      <div
        className="flex items-center justify-center px-4 py-2 border-b text-center"
        style={{ borderColor: '#73482b', background: 'rgba(115,72,43,0.15)' }}
      >
        <div>
          <div className="text-base font-semibold" style={{ color: '#af6025' }}>{u.name}</div>
          {u.baseType && (
            <div className="text-xs" style={{ color: '#af6025', opacity: 0.85 }}>{u.baseType}</div>
          )}
        </div>
      </div>

      <div className="flex gap-3 px-4 py-3">
        {u.icon && (
          <Image
            src={u.icon}
            alt={u.name}
            width={u.w * 47}
            height={u.h * 47}
            unoptimized
            className="flex-shrink-0"
            style={{ height: 'fit-content' }}
          />
        )}
        <div className="flex flex-col gap-1 min-w-0">
          {u.itemClass && (
            <p className="text-xs" style={{ color: '#7f7f7f' }}>{u.itemClass}</p>
          )}
          {u.requirements?.map((r, i) => (
            <p key={`req-${i}`} className="text-xs" style={{ color: '#7f7f7f' }}>
              {r.values.map((v) => v[0]).join(', ')}
            </p>
          ))}
          {(u.implicitMods?.length ?? 0) > 0 && (
            <div className="border-t border-b py-1 my-1" style={{ borderColor: 'rgba(115,72,43,0.3)' }}>
              {u.implicitMods!.map((m, i) => <ModLine key={`imp-${i}`} text={m} />)}
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            {u.explicitMods.map((m, i) => <ModLine key={`exp-${i}`} text={m} />)}
          </div>
          {u.flavourText?.map((f, i) => (
            <p key={`flv-${i}`} className="text-sm italic mt-1" style={{ color: '#a38d6d' }}>
              {f}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
