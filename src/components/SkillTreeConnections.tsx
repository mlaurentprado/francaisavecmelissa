import React, { useId, useLayoutEffect, useRef, useState } from 'react';

/**
 * Desenho da árvore em SVG.
 * O tronco é uma forma orgânica (com raízes), cada galho sai do tronco numa
 * curva longa até o seu quadro, e dentro do quadro um galho curvo pendura as
 * folhas. As posições são medidas no layout real, então tudo se ajusta em
 * qualquer largura de tela. Nada aqui altera regra de negócio.
 */

const TRUNK_X = 16;
const TRUNK_TOP_HALF = 5;
const TRUNK_BOTTOM_HALF = 7;
const ROOT_HEIGHT = 90;

type BranchAnchor = { x: number; y: number; color: string; complete: boolean };

/** Tronco: forma fechada, mais estreita na copa e com raízes no pé. */
function trunkShape(height: number): string {
  if (height <= 0) return '';
  const x = TRUNK_X;
  const top = -28;
  const bottom = height;
  const rootTop = Math.max(bottom - ROOT_HEIGHT, top + 60);
  const midA = top + (bottom - top) * 0.3;
  const midB = top + (bottom - top) * 0.62;

  return [
    `M ${x - TRUNK_TOP_HALF} ${top}`,
    `C ${x - TRUNK_TOP_HALF - 5} ${midA}, ${x - TRUNK_BOTTOM_HALF + 4} ${midB}, ${x - TRUNK_BOTTOM_HALF} ${rootTop}`,
    `C ${x - TRUNK_BOTTOM_HALF - 9} ${rootTop + 38}, ${x - 15} ${bottom - 18}, ${x - 24} ${bottom}`,
    `L ${x + 24} ${bottom}`,
    `C ${x + 15} ${bottom - 18}, ${x + TRUNK_BOTTOM_HALF + 9} ${rootTop + 38}, ${x + TRUNK_BOTTOM_HALF} ${rootTop}`,
    `C ${x + TRUNK_BOTTOM_HALF - 4} ${midB}, ${x + TRUNK_TOP_HALF + 5} ${midA}, ${x + TRUNK_TOP_HALF} ${top}`,
    'Z',
  ].join(' ');
}

type Point = { x: number; y: number };

/** Pontos de controle do galho — a mesma curva serve para desenhar e ramificar. */
function branchCurve(anchor: BranchAnchor): [Point, Point, Point, Point] {
  const startX = TRUNK_X + TRUNK_TOP_HALF - 1;
  const gap = Math.max(anchor.x - startX, 26);
  const startY = Math.max(anchor.y - gap * 0.55, 2);
  return [
    { x: startX, y: startY },
    { x: startX + gap * 0.45, y: startY },
    { x: startX + gap * 0.78, y: anchor.y - gap * 0.14 },
    { x: anchor.x, y: anchor.y },
  ];
}

function pointOnCurve([p0, p1, p2, p3]: [Point, Point, Point, Point], t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

/** Galho: sai do tronco acima do quadro e desce em curva até ele. */
function branchPath(anchor: BranchAnchor): string {
  const [p0, c1, c2, p3] = branchCurve(anchor);
  return `M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p3.x} ${p3.y}`;
}

/** Galhinho secundário com uma folha na ponta (só quando há folga). */
function branchTwig(anchor: BranchAnchor): { d: string; tip: Point } | null {
  const curve = branchCurve(anchor);
  const gap = anchor.x - curve[0].x;
  if (gap < 46) return null;
  const attach = pointOnCurve(curve, 0.55);
  const tip = { x: attach.x + gap * 0.18, y: attach.y - Math.min(26, gap * 0.36) };
  return {
    d: `M ${attach.x} ${attach.y} C ${attach.x + 5} ${attach.y - 9}, ${tip.x - 6} ${tip.y + 7}, ${tip.x} ${tip.y}`,
    tip,
  };
}

/** Container do tronco: mede os quadros e desenha tronco + galhos. */
export const TreeTrunkCanvas: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const lastSig = useRef('');
  const gradientId = useId().replace(/:/g, '');
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [anchors, setAnchors] = useState<BranchAnchor[]>([]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const box = el.getBoundingClientRect();
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-branch-card]'));
      const nextAnchors: BranchAnchor[] = cards.map((card) => {
        const r = card.getBoundingClientRect();
        return {
          x: Math.round(r.left - box.left),
          y: Math.round(r.top - box.top + Math.min(38, r.height / 2)),
          color: card.dataset.branchColor || '#5F7A43',
          complete: card.dataset.branchComplete === 'true',
        };
      });
      const nextSize = { w: el.clientWidth, h: el.scrollHeight };
      const sig = JSON.stringify({ nextSize, nextAnchors });
      if (sig === lastSig.current) return;
      lastSig.current = sig;
      setSize(nextSize);
      setAnchors(nextAnchors);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  });

  return (
    <div ref={ref} className={className}>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-visible"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        fill="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#6E8352" />
            <stop offset="45%" stopColor="#5F7A43" />
            <stop offset="85%" stopColor="#7A6A44" />
            <stop offset="100%" stopColor="#B5603F" />
          </linearGradient>
        </defs>

        {size.h > 0 && (
          <>
            {/* tronco */}
            <path d={trunkShape(size.h)} fill={`url(#${gradientId})`} />
            <path
              d={`M ${TRUNK_X - 1} -20 C ${TRUNK_X - 4} ${size.h * 0.3}, ${TRUNK_X - 2} ${size.h * 0.62}, ${TRUNK_X - 3} ${Math.max(size.h - ROOT_HEIGHT, 60)}`}
              stroke="#FFFFFF"
              strokeOpacity="0.16"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* galhos */}
            {anchors.map((anchor, i) => {
              const twig = branchTwig(anchor);
              const start = branchCurve(anchor)[0];
              const core = anchor.complete ? 1 : 0.9;
              return (
                <g key={i}>
                  <path
                    d={branchPath(anchor)}
                    stroke={anchor.color}
                    strokeOpacity={anchor.complete ? 0.28 : 0.2}
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d={branchPath(anchor)}
                    stroke={anchor.color}
                    strokeOpacity={core}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {twig && (
                    <>
                      <path
                        d={twig.d}
                        stroke={anchor.color}
                        strokeOpacity={core * 0.8}
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                      <ellipse
                        cx={twig.tip.x}
                        cy={twig.tip.y}
                        rx="5.5"
                        ry="3"
                        fill={anchor.color}
                        fillOpacity="0.45"
                        transform={`rotate(-38 ${twig.tip.x} ${twig.tip.y})`}
                      />
                    </>
                  )}
                  <circle cx={start.x} cy={start.y} r="3.4" fill={anchor.color} fillOpacity="0.7" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1" />
                </g>
              );
            })}
          </>
        )}
      </svg>
      {children}
    </div>
  );
};

type LeafPoint = { x: number; y: number; bottom: number; blocked: boolean };

/** Galho do quadro + cabinhos curvos que penduram cada folha. */
export const LeafSprigs: React.FC<{ color: string; children: React.ReactNode }> = ({
  color,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const lastSig = useRef('');
  const gradientId = useId().replace(/:/g, '');
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [leaves, setLeaves] = useState<LeafPoint[]>([]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const box = el.getBoundingClientRect();
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-leaf-card]'));
      const nextLeaves: LeafPoint[] = cards.map((card) => {
        const r = card.getBoundingClientRect();
        return {
          x: Math.round(r.left - box.left + r.width / 2),
          y: Math.round(r.top - box.top),
          bottom: Math.round(r.bottom - box.top),
          blocked: card.dataset.leafBlocked === 'true',
        };
      });
      const nextSize = { w: el.clientWidth, h: el.scrollHeight };
      const sig = JSON.stringify({ nextSize, nextLeaves });
      if (sig === lastSig.current) return;
      lastSig.current = sig;
      setSize(nextSize);
      setLeaves(nextLeaves);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  });

  // Cada folha pende do galho do quadro (primeira da coluna) ou da folha
  // de cima da mesma coluna — assim a ramagem continua em qualquer tela.
  const parents = new Map<number, number>();
  const columns = new Map<number, number[]>();
  leaves.forEach((leaf, i) => {
    const key = Math.round(leaf.x / 12);
    columns.set(key, [...(columns.get(key) ?? []), i]);
  });
  columns.forEach((indices) => {
    indices.sort((a, b) => leaves[a].y - leaves[b].y);
    indices.forEach((idx, k) => {
      if (k > 0) parents.set(idx, indices[k - 1]);
    });
  });

  const railY = 10;
  const railEnd = leaves.length > 0 ? Math.max(...leaves.map((l) => l.x)) : 0;

  return (
    <div ref={ref} className="relative mt-3 pt-8">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        fill="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {leaves.length > 0 && (
          <>
            {/* galho do quadro */}
            <path
              d={`M 0 ${railY} Q ${railEnd * 0.45} ${railY + 12}, ${railEnd} ${railY}`}
              stroke={color}
              strokeOpacity="0.16"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d={`M 0 ${railY} Q ${railEnd * 0.45} ${railY + 12}, ${railEnd} ${railY}`}
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* cabinhos até cada folha */}
            {leaves.map((leaf, i) => {
              const parent = parents.get(i);
              const fromX = parent === undefined ? leaf.x : leaves[parent].x;
              const fromY = parent === undefined ? railY : leaves[parent].bottom;
              const endY = leaf.y - 6;
              const dy = endY - fromY;
              const d = [
                `M ${fromX} ${fromY}`,
                `C ${fromX - 6} ${fromY + dy * 0.45},`,
                `${leaf.x + 6} ${endY - dy * 0.45},`,
                `${leaf.x} ${endY}`,
              ].join(' ');
              return (
                <g key={i}>
                  <path
                    d={d}
                    stroke={color}
                    strokeOpacity={leaf.blocked ? 0.28 : 0.6}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={fromX}
                    cy={fromY}
                    r="2.4"
                    fill={color}
                    fillOpacity={leaf.blocked ? 0.25 : 0.7}
                  />
                </g>
              );
            })}
          </>
        )}
      </svg>
      {children}
    </div>
  );
};
