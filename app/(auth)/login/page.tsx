import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="poe-panel space-y-6 text-center">
        <h1 className="text-2xl font-poe text-poe-highlight">Вхід</h1>
        <p className="text-poe-text text-sm">
          Авторизуйся через офіційний акаунт Path of Exile для доступу до трекера персонажів
        </p>
        <div className="space-y-3">
          {/* Буде підключено через NextAuth signIn("ggg") */}
          <button className="poe-btn w-full py-3">
            Увійти через Path of Exile
          </button>
          <p className="text-xs text-poe-text opacity-60">
            Використовує офіційний GGG OAuth 2.1
          </p>
        </div>
        <div className="border-t border-poe-border pt-4">
          <p className="text-xs text-poe-text opacity-50">
            Ще не підключено до GGG OAuth.{" "}
            <Link href="/" className="text-poe-gold hover:underline">
              На головну
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
