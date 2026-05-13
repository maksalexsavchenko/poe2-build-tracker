import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const ALLOWED = new Set(["nodes.json", "nodes_desc.json", "skills.json", "keywords.json"]);

/**
 * Віддає vendored JSON з public/data/poe2-tree (після npm run vendor:game-data).
 * Корисно, якщо потрібні заголовки кешу або єдиний entrypoint замість прямого static.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ file: string }> },
) {
  const { file } = await ctx.params;
  if (!ALLOWED.has(file)) {
    return NextResponse.json({ error: "Unknown file" }, { status: 404 });
  }
  const fp = path.join(process.cwd(), "public", "data", "poe2-tree", file);
  try {
    const buf = await readFile(fp);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Run npm run vendor:game-data to download poe2-tree JSON" },
      { status: 503 },
    );
  }
}
