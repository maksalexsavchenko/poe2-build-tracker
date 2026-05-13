import Link from 'next/link';
import { guides } from '@/lib/guides-data';
import GuideCard from '@/components/GuideCard';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <section className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--gold-light)' }}>
          Path of Exile 2<br />Build Tracker
        </h1>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Гайди з левелінгу, .build файли для in-game planner та прогрес-трекер вашого персонажа.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/builds"
            className="px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--gold)', color: '#0d0d0f' }}
          >
            Переглянути гайди →
          </Link>
          <a
            href="#how"
            className="px-6 py-3 rounded-lg font-semibold border transition-colors hover:bg-white/5"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            Як це працює?
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mb-14">
        <h2 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--gold)' }}>
          Як це працює
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '📖', title: 'Обери гайд', desc: 'Знайди білд під свій клас та стиль гри.' },
            { icon: '⬇️', title: 'Скачай .build', desc: 'Завантаж файл і імпортуй прямо в гру через Build Planner.' },
            { icon: '📊', title: 'Слідкуй за прогресом', desc: 'Підключи персонажа і дивись що робити далі. (незабаром)' },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-xl p-6 border text-center"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--gold)' }}>{step.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Builds list */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--gold)' }}>
            Популярні гайди
          </h2>
          <Link href="/builds" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
            Всі гайди →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </section>
    </div>
  );
}
