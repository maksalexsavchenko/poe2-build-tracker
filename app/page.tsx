import Link from "next/link";

const CLASSES = [
  { name: "Witch", icon: "🔮", builds: 3 },
  { name: "Monk", icon: "👊", builds: 2 },
  { name: "Ranger", icon: "🏹", builds: 2 },
  { name: "Warrior", icon: "⚔️", builds: 1 },
  { name: "Sorceress", icon: "❄️", builds: 2 },
  { name: "Mercenary", icon: "🔫", builds: 1 },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 space-y-6">
        <h1 className="text-4xl md:text-5xl font-poe text-poe-highlight">
          PoE2 Build Tracker
        </h1>
        <p className="text-poe-text text-lg max-w-2xl mx-auto">
          Гайди для левелінгу, завантаження <code className="text-poe-gold">.build</code> файлів
          та відстеження прогресу твого персонажа відносно гайду.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/guides" className="poe-btn">
            Переглянути гайди
          </Link>
          <Link href="/tracker" className="poe-btn-outline">
            Прогрес-трекер
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "📥",
            title: "Завантаж .build",
            desc: "Скачай файл для in-game Build Planner та грай без alt-tab",
          },
          {
            icon: "📊",
            title: "Трекер прогресу",
            desc: "Підключи акаунт GGG і бачи свій прогрес відносно гайду",
          },
          {
            icon: "🎯",
            title: "Наступні кроки",
            desc: "Система рекомендацій: що взяти зараз, які геми додати",
          },
        ].map((f) => (
          <div key={f.title} className="poe-panel text-center space-y-3">
            <div className="text-4xl">{f.icon}</div>
            <h3 className="text-poe-highlight font-medium">{f.title}</h3>
            <p className="text-poe-text text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Classes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-poe text-poe-highlight">Гайди по класах</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CLASSES.map((cls) => (
            <Link
              key={cls.name}
              href={`/guides?class=${cls.name.toLowerCase()}`}
              className="poe-panel text-center hover:border-poe-gold transition-colors cursor-pointer space-y-2"
            >
              <div className="text-3xl">{cls.icon}</div>
              <div className="text-poe-highlight text-sm font-medium">{cls.name}</div>
              <div className="text-poe-text text-xs">{cls.builds} гайдів</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
