import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "PoE2 Build Tracker",
  description: "Гайди та прогрес-трекер для Path of Exile 2. UA/RU спільнота.",
  keywords: ["Path of Exile 2", "PoE2", "build guide", "левелінг", "трекер"],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-poe-dark">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-poe-border mt-16 py-6 text-center text-sm text-poe-text opacity-60">
          <p>PoE2 Build Tracker — не офіційний продукт Grinding Gear Games</p>
        </footer>
      </body>
    </html>
  );
}
