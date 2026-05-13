import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div
        className="rounded-xl border p-8 space-y-6 text-center"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h1 className="text-2xl font-bold" style={{ color: 'var(--gold-light)' }}>
          Вхід
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Авторизуйся через офіційний акаунт Path of Exile для доступу до трекера персонажів
        </p>
        <div className="space-y-3">
          <button
            type="button"
            className="w-full px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--gold)', color: '#0d0d0f' }}
          >
            Увійти через Path of Exile
          </button>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Використовує офіційний GGG OAuth 2.1
          </p>
        </div>
        <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs opacity-70" style={{ color: 'var(--text-muted)' }}>
            Ще не підключено до GGG OAuth.{' '}
            <Link href="/" className="underline" style={{ color: 'var(--gold)' }}>
              На головну
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
