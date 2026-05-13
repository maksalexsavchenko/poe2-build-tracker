import Link from "next/link";

export default function TrackerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-poe text-poe-highlight">Прогрес-Трекер</h1>
        <p className="text-poe-text mt-2">
          Порівняй свого персонажа з обраним гайдом
        </p>
      </div>
      <div className="poe-panel text-center py-16 space-y-4">
        <p className="text-poe-highlight text-lg">Потрібна авторизація</p>
        <p className="text-poe-text text-sm">
          Увійди через акаунт Path of Exile щоб підключити персонажа
        </p>
        <Link href="/login" className="poe-btn inline-block mt-4">
          Увійти через PoE
        </Link>
      </div>
    </div>
  );
}
