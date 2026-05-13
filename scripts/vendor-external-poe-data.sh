#!/usr/bin/env bash
# Завантажує відкриті JSON-дані для інтеграції в сайт (без сабмодуля).
#
# PoE2 passive (community): https://github.com/marcoaaguiar/poe2-tree
#   → nodes.json, nodes_desc.json, skills.json, keywords.json
#
# PoE1 official passive export (НЕ PoE2): https://github.com/grindinggear/skilltree-export
#   → data.json ~6.4MB — опційно, лише якщо потрібен PoE1 / порівняння.
#   Увімкни:  DOWNLOAD_POE1_SKILLTREE=1 ./scripts/vendor-external-poe-data.sh
#
# PoE2 MCP (геми/моди, ~4975 nodes / 14269 mods у БД проєкту): https://github.com/HivemindOverlord/poe2-mcp
#   Це Python MCP-сервер, не статичні JSON у цьому скрипті.
#   Варіанти: pip install poe2-mcp + launch.py у Cursor/Claude MCP;
#   або окремий Docker-сервіс з репо (дані в data/ всередині того репо, ~100MB+).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/data/poe2-tree"
POE1_OUT="$ROOT/public/data/poe1-skilltree-export"

mkdir -p "$OUT" "$POE1_OUT"

BASE_POE2="https://raw.githubusercontent.com/marcoaaguiar/poe2-tree/main/src/lib/data"
for f in nodes.json nodes_desc.json skills.json keywords.json; do
  echo "Fetching poe2-tree: $f"
  curl -fsSL "$BASE_POE2/$f" -o "$OUT/$f"
done

if [[ "${DOWNLOAD_POE1_SKILLTREE:-}" == "1" ]]; then
  echo "Fetching grindinggear/skilltree-export data.json (PoE1, large)..."
  curl -fsSL "https://raw.githubusercontent.com/grindinggear/skilltree-export/master/data.json" -o "$POE1_OUT/data.json"
else
  echo "Skip PoE1 skilltree-export (set DOWNLOAD_POE1_SKILLTREE=1 to download ~6.4MB data.json)"
fi

echo "Done. Files under public/data/ — доступні як /data/poe2-tree/*.json"
