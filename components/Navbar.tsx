'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Головна' },
  { href: '/builds', label: 'Гайди' },
  { href: '/tracker', label: 'Трекер' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b sticky top-0 z-50" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-wide text-gold shrink-0">
          <span className="text-2xl">⚔</span>
          <span>PoE2 Tracker</span>
        </Link>

        <nav className="flex items-center gap-1 flex-wrap justify-end">
          {links.map((link) => {
            const active =
              pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  active
                    ? 'text-gold bg-[#1e1a0f]'
                    : 'text-muted hover:text-gold hover:bg-[#1a1a20]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="px-3 py-1.5 rounded text-sm font-semibold transition-opacity hover:opacity-90 ml-1"
            style={{ background: 'var(--gold)', color: '#0d0d0f' }}
          >
            Увійти через PoE
          </Link>
        </nav>
      </div>
    </header>
  );
}
