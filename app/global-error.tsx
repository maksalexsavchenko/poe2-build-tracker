'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uk">
      <body style={{ background: '#0d0d0f', color: '#e8e8f0', fontFamily: 'system-ui', padding: 24 }}>
        <h2 style={{ color: '#e5c97a' }}>Щось пішло не так</h2>
        <p style={{ opacity: 0.8 }}>{error.message}</p>
        <button type="button" onClick={() => reset()} style={{ marginTop: 16, padding: '8px 16px' }}>
          Спробувати знову
        </button>
      </body>
    </html>
  );
}
