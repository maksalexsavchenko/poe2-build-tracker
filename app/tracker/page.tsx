import Link from 'next/link';

export default function TrackerPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--gold-light)' }}>
          Прогрес-трекер
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Порівняй свого персонажа з обраним гайдом
        </p>
      </div>
      <div
        className="rounded-xl border text-center py-16 px-4 space-y-4"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <p className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>
          Потрібна авторизація
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Увійди через акаунт Path of Exile, щоб підключити персонажа
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--gold)', color: '#0d0d0f' }}
        >
          Увійти через PoE
        </Link>
      </div>
    </div>
  );
}
