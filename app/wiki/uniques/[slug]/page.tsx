/**
 * Сторінка одного унікa: показуємо UniqueCard на повний розмір.
 *
 * Дані beсь час з public/data/poe2db/uniques.json. Якщо slug немає —
 * показуємо 404.
 */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadPoe2dbUniques } from '@/lib/poe2db/load';
import { UniqueCard } from '@/components/UniqueCard';

export async function generateStaticParams() {
  const list = await loadPoe2dbUniques();
  return list.map((u) => ({ slug: u.slug }));
}

export default async function UniquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const all = await loadPoe2dbUniques();
  const found = all.some((u) => u.slug === decoded || u.name === decoded);
  if (!found) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/wiki/uniques" className="text-sm mb-6 inline-block hover:underline" style={{ color: 'var(--text-muted)' }}>
        ← Усі унікалки
      </Link>
      <UniqueCard slug={decoded} />
      <p className="text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
        Дані з{' '}
        <a className="underline" href={`https://poe2db.tw/us/${slug}`} target="_blank" rel="noopener noreferrer">
          poe2db.tw/us/{decoded}
        </a>
      </p>
    </div>
  );
}
