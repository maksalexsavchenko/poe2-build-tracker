import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import './styles/poe2-planner-maxroll.css';
import Navbar from '@/components/Navbar';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'PoE2 Build Tracker',
  description: 'Build guides, .build export та прогрес-трекер для Path of Exile 2',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ background: 'var(--background)', color: 'var(--text)' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          PoE2 Build Tracker — не офіційний сайт. Path of Exile 2 © Grinding Gear Games.
        </footer>
      </body>
    </html>
  );
}
