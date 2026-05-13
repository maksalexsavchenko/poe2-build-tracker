import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Віддає vendored JSON з public/data/repoe-poe2/** (після npm run vendor:game-data).
 * Приклади: /api/game/repoe/mods.min.json
 *            /api/game/repoe/stat_translations/passive_skill_stat_descriptions.min.json
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path?: string[] }> },
) {
  const { path: segments } = await ctx.params;
  const parts = segments ?? [];
  if (parts.length === 0) {
    return NextResponse.json(
      { error: "Вкажи шлях до файлу, наприклад mods.min.json або stat_translations/skill_stat_descriptions.min.json" },
      { status: 400 },
    );
  }

  const joined = parts.join("/");
  if (!joined || joined.includes("..") || path.isAbsolute(joined)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  if (!joined.endsWith(".json")) {
    return NextResponse.json({ error: "Only JSON files" }, { status: 400 });
  }

  const root = path.join(process.cwd(), "public", "data", "repoe-poe2");
  const rootResolved = path.resolve(root);
  const target = path.resolve(path.join(root, ...parts));

  const underRoot =
    target === rootResolved || target.startsWith(rootResolved + path.sep);
  if (!underRoot) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const buf = await readFile(target);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Файл не знайдено. Запусти npm run vendor:game-data." },
      { status: 503 },
    );
  }
}
