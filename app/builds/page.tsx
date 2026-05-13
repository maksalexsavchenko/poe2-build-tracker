'use client';
import { useState } from 'react';
import { guides } from '@/lib/guides-data';
import { CLASSES } from '@/lib/classes-data';
import GuideCard from '@/components/GuideCard';
import Image from 'next/image';

export default function BuildsPage() {
  const [activeClass, setActiveClass] = useState<string | null>(null);

  const filtered = activeClass
    ? guides.filter((g) => g.class.toLowerCase() === activeClass)
    : guides;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--gold-light)' }}>
          Гайди та Білди
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {guides.length} гайдів доступно. Кожен включає leveling path та .build файл для in-game planner.
        </p>
      </div>

      {/* Class filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveClass(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
          style={{
            background: activeClass === null ? 'var(--gold)' : 'var(--surface)',
            borderColor: activeClass === null ? 'var(--gold)' : 'var(--border)',
            color: activeClass === null ? '#0d0d0f' : 'var(--text-muted)',
          }}
        >
          Всі класи
        </button>
        {CLASSES.map((cls) => {
          const isActive = activeClass === cls.id;
          const portrait = cls.ascendancies[0]?.portrait;
          return (
            <button
              key={cls.id}
              onClick={() => setActiveClass(isActive ? null : cls.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
              style={{
                background: isActive ? cls.color + '22' : 'var(--surface)',
                borderColor: isActive ? cls.color : 'var(--border)',
                color: isActive ? cls.color : 'var(--text-muted)',
              }}
            >
              {portrait && (
                <div className="w-5 h-5 rounded-full overflow-hidden shrink-0" style={{ background: cls.color + '33' }}>
                  <Image src={portrait} alt={cls.name} width={20} height={20} className="object-cover object-top" />
                </div>
              )}
              {cls.name}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
          <div className="text-4xl mb-3">🔍</div>
          <p>Гайдів для цього класу ще немає.</p>
          <p className="text-sm mt-1">Скоро додамо!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
}
