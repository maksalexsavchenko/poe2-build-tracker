/**
 * Список всіх унікалок з poe2db. Простий MVP — без фільтрів і пагінації,
 * хоч і 402 рядки рендеряться як <a> з лазі-завантаженням іконок.
 *
 * Дані: public/data/poe2db/uniques.json (npm run vendor:poe2db).
 */
import Link from 'next/link';
import Image from 'next/image';
import { loadPoe2dbUniques } from '@/lib/poe2db/load';

export const metadata = { title: 'Унікалки · PoE2 Tracker' };

export default async function UniquesIndex() {
  const list = await loadPoe2dbUniques();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--gold)' }}>
        Унікалки PoE 2
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        {list.length} предметів · джерело: <a className="underline" href="https://poe2db.tw/us/Unique_item" target="_blank" rel="noopener noreferrer">poe2db.tw</a>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {list.map((u) => (
          <Link
            key={u.slug}
            href={`/wiki/uniques/${encodeURIComponent(u.slug)}`}
            className="flex flex-col items-center text-center rounded border p-3 transition"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            {u.icon && (
              <Image
                src={u.icon}
                alt={u.name}
                width={48}
                height={48}
                unoptimized
                loading="lazy"
                className="mb-2"
                style={{ height: 'auto' }}
              />
            )}
            <div className="text-sm" style={{ color: '#af6025' }}>{u.name}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.baseType}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
