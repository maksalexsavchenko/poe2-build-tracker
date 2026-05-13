#!/usr/bin/env bash
# Завантажує відкриті JSON-дані PoE2 для інтеграції в сайт (без сабмодуля).
#
# Джерело: RePoE (fork) — https://repoe-fork.github.io/poe2/
#
# Завжди: дерево пасивів, ascendancies, геми, моди, базові предмети, унікальні, keywords,
#         stat_value_handlers, усі stat_translations/*.min.json (~20 файлів).
#
# Опційно (великі):
#   DOWNLOAD_REPOE_SKILLS=1          → skills.min.json (~12 MB)
#   DOWNLOAD_REPOE_STATS_BY_FILE=1  → stats_by_file.min.json (~8.6 MB)
#
# PoE1: DOWNLOAD_POE1_SKILLTREE=1 — skilltree-export data.json
#
# PoE2 MCP: https://github.com/HivemindOverlord/poe2-mcp — окремо.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPOE_OUT="$ROOT/public/data/repoe-poe2"
POE1_OUT="$ROOT/public/data/poe1-skilltree-export"

rm -rf "$ROOT/public/data/poe2-tree"

mkdir -p "$REPOE_OUT/stat_translations" "$POE1_OUT"

REPOE="https://repoe-fork.github.io/poe2"

echo "Fetching RePoE: passive tree Default (~3MB) → passive-tree-Default.min.json"
curl -fsSL "$REPOE/passive_skill_trees/Default.min.json" -o "$REPOE_OUT/passive-tree-Default.min.json"

echo "Fetching RePoE: ascendancies.min.json"
curl -fsSL "$REPOE/ascendancies.min.json" -o "$REPOE_OUT/ascendancies.min.json"

echo "Fetching RePoE: skill_gems.min.json"
curl -fsSL "$REPOE/skill_gems.min.json" -o "$REPOE_OUT/skill_gems.min.json"

echo "Fetching RePoE: mods.min.json (~7.3MB)"
curl -fsSL "$REPOE/mods.min.json" -o "$REPOE_OUT/mods.min.json"

echo "Fetching RePoE: base_items.min.json (~2.1MB)"
curl -fsSL "$REPOE/base_items.min.json" -o "$REPOE_OUT/base_items.min.json"

echo "Fetching RePoE: uniques.min.json"
curl -fsSL "$REPOE/uniques.min.json" -o "$REPOE_OUT/uniques.min.json"

echo "Fetching RePoE: keywords.min.json"
curl -fsSL "$REPOE/keywords.min.json" -o "$REPOE_OUT/keywords.min.json"

echo "Fetching RePoE: stat_value_handlers.min.json"
curl -fsSL "$REPOE/stat_value_handlers.min.json" -o "$REPOE_OUT/stat_value_handlers.min.json"

echo "Fetching RePoE: stat_translations/*.min.json"
curl -fsSL "$REPOE/stat_translations/" | sed -n 's/.*href="\.\/\([^"]*\.min\.json\)".*/\1/p' | while IFS= read -r stf; do
  [[ -z "$stf" ]] && continue
  echo "  → stat_translations/$stf"
  curl -fsSL "$REPOE/stat_translations/$stf" -o "$REPOE_OUT/stat_translations/$stf"
done

if [[ "${DOWNLOAD_REPOE_SKILLS:-}" == "1" ]]; then
  echo "Fetching RePoE: skills.min.json (~12MB) [DOWNLOAD_REPOE_SKILLS=1]"
  curl -fsSL "$REPOE/skills.min.json" -o "$REPOE_OUT/skills.min.json"
else
  echo "Skip skills.min.json (set DOWNLOAD_REPOE_SKILLS=1 for ~12MB)"
fi

if [[ "${DOWNLOAD_REPOE_STATS_BY_FILE:-}" == "1" ]]; then
  echo "Fetching RePoE: stats_by_file.min.json (~8.2MB) [DOWNLOAD_REPOE_STATS_BY_FILE=1]"
  curl -fsSL "$REPOE/stats_by_file.min.json" -o "$REPOE_OUT/stats_by_file.min.json"
else
  echo "Skip stats_by_file.min.json (set DOWNLOAD_REPOE_STATS_BY_FILE=1 for ~8.2MB)"
fi

if [[ "${DOWNLOAD_POE1_SKILLTREE:-}" == "1" ]]; then
  echo "Fetching grindinggear/skilltree-export data.json (PoE1, large)..."
  curl -fsSL "https://raw.githubusercontent.com/grindinggear/skilltree-export/master/data.json" -o "$POE1_OUT/data.json"
else
  echo "Skip PoE1 skilltree-export (set DOWNLOAD_POE1_SKILLTREE=1 to download ~6.4MB data.json)"
fi

echo "Done. RePoE → public/data/repoe-poe2/ (API: /api/game/repoe/…)."
