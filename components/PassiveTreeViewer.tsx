'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { processTree, type ComputedNode, type ProcessedTree, type RawTreeData } from '@/lib/poe2-tree/compute-positions';

type Props = {
  /** Real PoE2 passive node skill IDs that are allocated for this build. */
  allocatedNodes: number[];
  /**
   * Назва ascendancy цього білда (наприклад «Invoker»). Якщо задана — показуємо
   * лише ноди головного дерева + цієї ascendancy (як у PoB / maxroll). Без неї
   * показуємо все включно з усіма ascendancy.
   */
  ascendancyName?: string;
};

// ─── visual constants ─────────────────────────────────────────────────────────
const BG = '#000000';
const EDGE_DIM = 'rgba(120,120,170,0.75)';
const EDGE_ALLOC = '#e8b840';
const EDGE_ALLOC_GLOW = 'rgba(232,184,64,0.45)';

const NODE_COLOR = {
  allocFill: '#c8a84b',
  allocBorder: '#ffd700',
  keystoneBorder: '#7474b8',
  notableBorder: '#5a8a6a',
  ascBorder: '#9a5cc0',
  jewelBorder: '#a0a04a',
  smallBorder: '#5a5a78',
  dimFill: '#000000',
};

const RADIUS = { small: 5, notable: 9, keystone: 13, ascendancy: 8, jewel: 6 };
const MIN_ZOOM = 0.004;
const MAX_ZOOM = 0.6;
/**
 * Скільки відсотків ширини головного дерева включити у початковий вид.
 * Маленьке значення = ближче зум (видно деталі), велике (1) = вписане ціле дерево
 * (як «Reset view» в PoB). Емпірично — головна решітка займає ~75% ширини bbox,
 * 0.9 дає простір по краях.
 */
const FIT_PADDING = 0.92;

// orbit radii from tree.json constants — використовуються для group-glow та tooltip-ів
const ORBIT_RADII = [0, 82, 162, 335, 493, 662, 846, 251, 1080, 1322];

// ─── helpers ──────────────────────────────────────────────────────────────────
function nodeRadius(n: ComputedNode): number {
  if (n.isKeystone) return RADIUS.keystone;
  if (n.isNotable) return RADIUS.notable;
  if (n.isAscendancy) return RADIUS.ascendancy;
  if (n.isJewelSocket) return RADIUS.jewel;
  return RADIUS.small;
}

function nodeBorderColor(n: ComputedNode, alloc: boolean): string {
  if (alloc) return NODE_COLOR.allocBorder;
  if (n.isKeystone) return NODE_COLOR.keystoneBorder;
  if (n.isNotable) return NODE_COLOR.notableBorder;
  if (n.isAscendancy) return NODE_COLOR.ascBorder;
  if (n.isJewelSocket) return NODE_COLOR.jewelBorder;
  return NODE_COLOR.smallBorder;
}

// ─── image cache (module-level, survives re-renders) ─────────────────────────
const imgCache = new Map<string, HTMLImageElement | null>();

function getIcon(url: string): HTMLImageElement | null {
  if (imgCache.has(url)) return imgCache.get(url)!;
  imgCache.set(url, null); // mark as loading
  const img = new Image();
  img.src = url;
  img.onload = () => imgCache.set(url, img);
  img.onerror = () => imgCache.set(url, null);
  return null;
}

// ─── main component ───────────────────────────────────────────────────────────
export function PassiveTreeViewer({ allocatedNodes, ascendancyName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ node: ComputedNode; cx: number; cy: number } | null>(null);

  const treeRef = useRef<ProcessedTree | null>(null);
  /** Bounds головного дерева (без ascendancy кластерів) — для fit-to-view. */
  const mainBoundsRef = useRef<{ minX: number; maxX: number; minY: number; maxY: number } | null>(null);
  const iconLookupRef = useRef<Record<string, string>>({});
  const nodeIconRef = useRef<Map<number, string>>(new Map());
  /** Видимі ноди (id) — головне дерево + лише обрана ascendancy. */
  const visibleNodesRef = useRef<Set<number>>(new Set());
  // edges on the shortest path connecting all allocated nodes (format: "minId:maxId")
  const pathEdgeSetRef = useRef<Set<string>>(new Set());
  // all node IDs on the path (allocated + intermediate)
  const pathNodeSetRef = useRef<Set<number>>(new Set());

  const allocSet = useMemo(() => new Set(allocatedNodes), [allocatedNodes]);

  const tfRef = useRef({ scale: 0.015, panX: 0, panY: 0 });
  const drag = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const rafId = useRef(0);

  // ── load tree.json + icon-lookup.json ─────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch('/data/poe2-tree/tree.json').then((r) => r.json()),
      fetch('/data/poe2-tree/icon-lookup.json').then((r) => r.json()).catch(() => ({})),
    ]).then(([raw, lookup]: [RawTreeData, Record<string, string>]) => {
      const tree = processTree(raw);
      treeRef.current = tree;
      iconLookupRef.current = lookup;

      const nodeIconMap = new Map<number, string>();
      const ascNameById = new Map<number, string | undefined>();
      const rawNodes = raw.nodes as Record<
        string,
        { skill: number; icon?: string; group: number; orbit: number; ascendancyName?: string }
      >;
      for (const rn of Object.values(rawNodes)) {
        if (rn.icon && lookup[rn.icon]) nodeIconMap.set(rn.skill, lookup[rn.icon]);
        ascNameById.set(rn.skill, rn.ascendancyName);
      }
      nodeIconRef.current = nodeIconMap;

      // ── Filter: main tree + only the player's ascendancy.
      // Так само робить PoB (`PassiveTree:Init`) і maxroll — ascendancy
      // інших класів не повинна засмічувати головний вид.
      const asc = ascendancyName?.trim() ?? '';
      const visible = new Set<number>();
      for (const n of tree.nodes) {
        const a = ascNameById.get(n.id);
        if (!a) {
          visible.add(n.id); // main tree
        } else if (asc && a === asc) {
          visible.add(n.id); // own ascendancy
        }
      }
      visibleNodesRef.current = visible;

      // bounds для зорового центрування — рахуємо ЛИШЕ по головному дереву,
      // інакше «острівець» ascendancy в кутку розтягує bbox і fit-zoom стає
      // надто далеким.
      let mnX = Infinity, mnY = Infinity, mxX = -Infinity, mxY = -Infinity;
      for (const n of tree.nodes) {
        if (ascNameById.get(n.id)) continue;
        if (n.x < mnX) mnX = n.x;
        if (n.y < mnY) mnY = n.y;
        if (n.x > mxX) mxX = n.x;
        if (n.y > mxY) mxY = n.y;
      }
      mainBoundsRef.current = { minX: mnX, maxX: mxX, minY: mnY, maxY: mxY };

      // Mark edges where both endpoints are allocated — these are the "active" connections.
      // This matches how PoB renders the path: direct edge highlight when both ends are taken.
      const allocSet2 = new Set(allocatedNodes);
      const pathEdges = new Set<string>();
      for (const [a, b] of tree.edges) {
        if (allocSet2.has(a) && allocSet2.has(b)) {
          const key = a < b ? `${a}:${b}` : `${b}:${a}`;
          pathEdges.add(key);
        }
      }
      pathEdgeSetRef.current = pathEdges;
      // all allocated node IDs are "on path" (highlighted)
      const pathNodeSet = new Set<number>(allocatedNodes.filter(id => tree.nodeById.has(id)));
      pathNodeSetRef.current = pathNodeSet;

      setLoading(false);
    }).catch((e) => setErr(String(e)));
  }, [allocatedNodes, ascendancyName]);

  // ── draw ──────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const tree = treeRef.current;
    if (!canvas || !tree) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }

    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ── background ────────────────────────────────────────────────────────
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    // very subtle vignette — nearly pure black everywhere
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.65);
    bgGrad.addColorStop(0, 'rgba(8,10,20,0.25)');
    bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const { scale, panX, panY } = tfRef.current;
    const tx = (x: number) => x * scale + panX + W / 2;
    const ty = (y: number) => y * scale + panY + H / 2;
    // sizes scale continuously with zoom — no hard thresholds
    const showIconsAll = scale > 0.05;    // all nodes get sprites
    const showIconsBig = scale > 0.022;   // notables + keystones get sprites
    const showSmall = scale > 0.005;
    // base stroke for edges — purely linear with scale
    const strokeBase = Math.min(7, Math.max(0.35, scale * 65));
    const margin = 60;

    // helper — чи має група хоч одну видиму ноду (для фільтра ascendancy)
    const visibleNodesEarly = visibleNodesRef.current;
    const groupVisible = (g: { nodes?: number[] } | null) => {
      if (!g) return false;
      if (visibleNodesEarly.size === 0) return true;
      const ns = g.nodes ?? [];
      for (let i = 0; i < ns.length; i++) if (visibleNodesEarly.has(ns[i])) return true;
      return false;
    };

    // ── group glows (drawn once per group, before rings) ─────────────────
    // only visible when moderately zoomed in — not at overview
    if (scale > 0.04) {
      for (let gi = 0; gi < tree.groups.length; gi++) {
        const g = tree.groups[gi];
        if (!groupVisible(g)) continue;
        const gx = tx(g!.x), gy = ty(g!.y);
        // use largest orbit radius in this group for the glow size
        const maxOrbit = Math.max(...(g!.orbits ?? [0]));
        const glowR = Math.max(20, (ORBIT_RADII[maxOrbit] ?? 60) * scale * 0.7);
        if (gx + glowR < -margin || gx - glowR > W + margin ||
            gy + glowR < -margin || gy - glowR > H + margin) continue;
        const glowAlpha = Math.min(0.22, scale * 2.5);
        const glowGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
        glowGrad.addColorStop(0, `rgba(25,60,140,${glowAlpha})`);
        glowGrad.addColorStop(0.5, `rgba(10,30,80,${glowAlpha * 0.4})`);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(gx, gy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }
    }

    // ── orbit rings: ПРИБРАНО ────────────────────────────────────────────
    // Декоративні PNG-кільця (normalN.png / activeN.png) накладалися на
    // ноди як хаотичні «дужки». Maxroll/PoB‑viewer теж їх не малюють.

    // ── edges ─────────────────────────────────────────────────────────────
    const visibleNodes = visibleNodesRef.current;

    for (const [aId, bId] of tree.edges) {
      // hide edges між невидимими нодами (інші ascendancy)
      if (visibleNodes.size > 0 && (!visibleNodes.has(aId) || !visibleNodes.has(bId))) continue;
      const a = tree.nodeById.get(aId);
      const b = tree.nodeById.get(bId);
      if (!a || !b) continue;

      const ax = tx(a.x), ay = ty(a.y);
      const bx = tx(b.x), by = ty(b.y);

      if (Math.max(ax, bx) < -margin || Math.min(ax, bx) > W + margin ||
          Math.max(ay, by) < -margin || Math.min(ay, by) > H + margin) continue;

      const edgeKey = aId < bId ? `${aId}:${bId}` : `${bId}:${aId}`;
      const isAllocEdge = pathEdgeSetRef.current.has(edgeKey);

      // straight edge
      if (isAllocEdge) {
        if (scale > 0.025) {
          ctx.beginPath();
          ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
          ctx.strokeStyle = 'rgba(232,160,40,0.15)';
          ctx.lineWidth = strokeBase * 4;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = EDGE_ALLOC_GLOW;
        ctx.lineWidth = Math.max(0.6, strokeBase * (scale > 0.025 ? 2 : 1));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = EDGE_ALLOC;
        ctx.lineWidth = strokeBase;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = EDGE_DIM;
        ctx.lineWidth = Math.max(0.5, strokeBase * 0.4);
        ctx.stroke();
      }
    }

    // ── nodes ─────────────────────────────────────────────────────────────
    const iconNodeMap = nodeIconRef.current;

    for (const n of tree.nodes) {
      if (visibleNodes.size > 0 && !visibleNodes.has(n.id)) continue;
      const sx = tx(n.x), sy = ty(n.y);
      if (sx < -36 || sx > W + 36 || sy < -36 || sy > H + 36) continue;

      const onPath = pathNodeSetRef.current.has(n.id); // on the BFS path (includes intermediate)
      const alloc = allocSet.has(n.id);                // actually in the build's allocated set
      if (!n.isKeystone && !n.isNotable && !n.isAscendancy && !alloc && !showSmall) continue;

      const baseR = nodeRadius(n);
      // Continuous linear scaling, але з помітнішим мінімальним розміром —
      // інакше при «Reset view» дерево виглядає як ледь видимий пил.
      const minR = n.isKeystone ? 2.4 : n.isNotable ? 1.8 : n.isAscendancy ? 1.6 : 1.0;
      const displayR = Math.min(baseR * 3, Math.max(minR, baseR * scale * 12));
      const borderColor = nodeBorderColor(n, onPath);
      // unallocated також має бути добре видимий навіть на overview
      const nodeAlpha = onPath ? 1 : Math.min(1, 0.55 + scale * 20);

      // strong glow only for explicitly allocated notables/keystones; subtle for path intermediates
      if (onPath && displayR > 3) {
        const glowIntensity = alloc ? 0.45 : 0.15;
        const glowR = alloc ? displayR * 2.5 : displayR * 1.6;
        const glowGrad = ctx.createRadialGradient(sx, sy, displayR * 0.3, sx, sy, glowR);
        glowGrad.addColorStop(0, `rgba(200,168,75,${glowIntensity})`);
        glowGrad.addColorStop(1, 'rgba(200,168,75,0)');
        ctx.beginPath();
        ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      const iconUrl = iconNodeMap.get(n.id);
      const wantsIcon = showIconsAll || (showIconsBig && (n.isKeystone || n.isNotable || n.isAscendancy));
      const iconImg = wantsIcon && iconUrl ? getIcon(iconUrl) : null;

      if (n.isKeystone) {
        const d = displayR * 1.4;
        ctx.save();
        ctx.globalAlpha = nodeAlpha;
        ctx.beginPath();
        ctx.moveTo(sx, sy - d); ctx.lineTo(sx + d, sy);
        ctx.lineTo(sx, sy + d); ctx.lineTo(sx - d, sy);
        ctx.closePath();

        if (iconImg) {
          ctx.fillStyle = onPath ? '#120e04' : '#000000';
          ctx.fill();
          ctx.clip();
          ctx.drawImage(iconImg, sx - d, sy - d, d * 2, d * 2);
          ctx.restore();
          ctx.save();
          ctx.globalAlpha = nodeAlpha;
          ctx.beginPath();
          ctx.moveTo(sx, sy - d); ctx.lineTo(sx + d, sy);
          ctx.lineTo(sx, sy + d); ctx.lineTo(sx - d, sy);
          ctx.closePath();
        } else {
          ctx.fillStyle = onPath ? '#1a2a1a' : '#000000';
          ctx.fill();
        }
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = alloc ? 2.5 : (onPath ? 1.8 : 1.5);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = nodeAlpha;
        ctx.beginPath();
        ctx.arc(sx, sy, displayR, 0, Math.PI * 2);

        if (iconImg) {
          // dark background disc so icon has a frame
          ctx.fillStyle = onPath ? '#120e04' : '#000000';
          ctx.fill();
          ctx.clip();
          ctx.drawImage(iconImg, sx - displayR, sy - displayR, displayR * 2, displayR * 2);
          ctx.restore();
          ctx.save();
          ctx.globalAlpha = nodeAlpha;
          ctx.beginPath();
          ctx.arc(sx, sy, displayR, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = onPath ? '#1c1508' : (n.isAscendancy ? '#0a0010' : '#000000');
          ctx.fill();
        }

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = alloc ? 2.5 : (onPath ? 1.8 : (n.isNotable || n.isAscendancy ? 2 : 1.2));
        ctx.stroke();
        ctx.restore();

        if (onPath && n.isNotable && displayR > 6) {
          ctx.beginPath();
          ctx.arc(sx, sy, displayR + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255,215,0,0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Підписи нод прибрано — назви видно в тултіпі при наведенні.
    }

    // progressive reload while icons still loading
    if (showIconsBig || showIconsAll) {
      let needsRedraw = false;
      if (showIconsBig || showIconsAll) {
        for (const n of tree.nodes) {
          const sx = tx(n.x), sy = ty(n.y);
          if (sx < -36 || sx > W + 36 || sy < -36 || sy > H + 36) continue;
          const iconUrl = iconNodeMap.get(n.id);
          if (iconUrl && imgCache.get(iconUrl) === null) { needsRedraw = true; break; }
        }
      }
      if (imgCache.get('/data/poe2-tree/background.png') === null) needsRedraw = true;
      if (needsRedraw) {
        setTimeout(() => { rafId.current = requestAnimationFrame(draw); }, 80);
      }
    }
  }, [allocSet]);

  // ── animation loop ────────────────────────────────────────────────────────
  const requestDraw = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => { if (!loading) requestDraw(); }, [loading, requestDraw]);

  // ── resize ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => requestDraw());
    ro.observe(el);
    return () => ro.disconnect();
  }, [requestDraw]);

  // ── center on load ────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const W = canvas.clientWidth || 810;
    const H = canvas.clientHeight || 560;
    const tree = treeRef.current;
    if (!tree) return;
    // bounds головного дерева (без ascendancy кутиків) дають коректний центр
    const b = mainBoundsRef.current ?? tree.bounds;
    const tw = b.maxX - b.minX;
    const th = b.maxY - b.minY;
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    const scale = Math.min(W / tw, H / th) * FIT_PADDING;
    tfRef.current = { scale, panX: -cx * scale, panY: -cy * scale };
    requestDraw();
  }, [loading, requestDraw]);

  // ── wheel zoom ────────────────────────────────────────────────────────────
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left - canvas.clientWidth / 2;
    const my = e.clientY - rect.top - canvas.clientHeight / 2;
    const { scale, panX, panY } = tfRef.current;
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale * factor));
    const ratio = newScale / scale;
    tfRef.current = { scale: newScale, panX: mx - (mx - panX) * ratio, panY: my - (my - panY) * ratio };
    requestDraw();
    setTooltip(null);
  }, [requestDraw]);

  // ── drag pan ──────────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    drag.current = { sx: e.clientX, sy: e.clientY, px: tfRef.current.panX, py: tfRef.current.panY };
    setTooltip(null);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (drag.current) {
      tfRef.current.panX = drag.current.px + (e.clientX - drag.current.sx);
      tfRef.current.panY = drag.current.py + (e.clientY - drag.current.sy);
      requestDraw();
      return;
    }

    const canvas = canvasRef.current;
    const tree = treeRef.current;
    if (!canvas || !tree) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const { scale, panX, panY } = tfRef.current;
    const tx = (x: number) => x * scale + panX + W / 2;
    const ty = (y: number) => y * scale + panY + H / 2;
    const HIT = 16;
    let found: ComputedNode | null = null;
    for (const n of tree.nodes) {
      const dx = tx(n.x) - mx, dy = ty(n.y) - my;
      if (dx * dx + dy * dy < HIT * HIT) { found = n; break; }
    }
    setTooltip(found ? { node: found, cx: tx(found.x), cy: ty(found.y) } : null);
  }, [requestDraw]);

  const onMouseUp = useCallback(() => { drag.current = null; }, []);
  const onMouseLeave = useCallback(() => { drag.current = null; setTooltip(null); }, []);

  // ── reset view ────────────────────────────────────────────────────────────
  const resetView = useCallback(() => {
    const canvas = canvasRef.current;
    const tree = treeRef.current;
    if (!canvas || !tree) return;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    const b = mainBoundsRef.current ?? tree.bounds;
    const tw = b.maxX - b.minX;
    const th = b.maxY - b.minY;
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    const scale = Math.min(W / tw, H / th) * FIT_PADDING;
    tfRef.current = { scale, panX: -cx * scale, panY: -cy * scale };
    requestDraw();
  }, [requestDraw]);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-xl border overflow-hidden mb-6"
      style={{ background: '#000000', borderColor: 'var(--border)' }}
    >
      {/* header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between gap-2 flex-wrap"
        style={{ borderColor: 'var(--border)' }}
      >
        <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>
          Пасивне дерево
        </h2>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>Scroll — zoom · Drag — pan</span>
          <button
            onClick={resetView}
            className="px-2 py-0.5 rounded border text-xs hover:opacity-80 transition-opacity"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            Reset view
          </button>
        </div>
      </div>

      {/* canvas */}
      <div className="relative" style={{ height: '600px' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            <span className="text-sm animate-pulse">Завантаження дерева…</span>
          </div>
        )}
        {err && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center" style={{ color: '#f87171' }}>
            <span className="text-sm">Помилка: {err}</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ cursor: drag.current ? 'grabbing' : 'crosshair', display: loading || err ? 'none' : 'block' }}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        />

        {/* tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none rounded-lg border px-3 py-2 text-xs max-w-[260px] z-10"
            style={{
              left: Math.min(tooltip.cx + 14, (canvasRef.current?.clientWidth ?? 800) - 280),
              top: Math.max(8, tooltip.cy - 70),
              background: 'rgba(8,8,20,0.97)',
              borderColor: '#c8a84b',
              color: '#c8c8d8',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div className="font-semibold mb-0.5" style={{ color: allocSet.has(tooltip.node.id) ? '#ffd700' : '#c8a84b' }}>
              {tooltip.node.name}
            </div>
            {tooltip.node.isKeystone && <div className="text-[10px] opacity-50 mb-1">Keystone</div>}
            {tooltip.node.isNotable && !tooltip.node.isAscendancy && <div className="text-[10px] opacity-50 mb-1">Notable</div>}
            {tooltip.node.ascendancyName && <div className="text-[10px] opacity-50 mb-1">{tooltip.node.ascendancyName} Ascendancy</div>}
            {tooltip.node.stats.map((s, i) => (
              <div key={i} className="leading-snug" style={{ color: '#8ac0e8' }}>{s}</div>
            ))}
            {allocSet.has(tooltip.node.id) && (
              <div className="mt-1 text-[10px] opacity-50">✓ Allocated</div>
            )}
          </div>
        )}
      </div>

      {/* legend */}
      <div
        className="px-4 py-2 border-t flex flex-wrap gap-x-4 gap-y-1 text-[11px]"
        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        <span className="flex items-center gap-1.5">
          <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:'#c8a84b', border:'1.5px solid #ffd700', boxShadow:'0 0 6px rgba(255,215,0,0.5)' }} />
          Allocated
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ display:'inline-block', width:11, height:11, background:'#08080f', border:'1.5px solid #6060d8', transform:'rotate(45deg)' }} />
          Keystone
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:'#08080f', border:'1.5px solid #5a8a5a' }} />
          Notable
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ display:'inline-block', width:9, height:9, borderRadius:'50%', background:'#15052a', border:'1.5px solid #9a4ad0' }} />
          Ascendancy
        </span>
        <span className="ml-auto opacity-50">
          Sprites: PathOfBuilding PoE2 · Дерево: GGG tree.json
        </span>
      </div>
    </div>
  );
}
