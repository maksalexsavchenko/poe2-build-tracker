import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-poe-border bg-poe-panel">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-poe-highlight font-poe text-xl hover:text-white transition-colors">
          PoE2 Build Tracker
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/guides" className="text-poe-text hover:text-poe-highlight transition-colors">
            Гайди
          </Link>
          <Link href="/tracker" className="text-poe-text hover:text-poe-highlight transition-colors">
            Трекер
          </Link>
          <Link href="/login" className="poe-btn text-xs py-1.5 px-3">
            Увійти через PoE
          </Link>
        </div>
      </div>
    </nav>
  );
}
