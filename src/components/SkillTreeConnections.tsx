import React, { useLayoutEffect, useRef, useState } from 'react';

/**
 * Desenho da árvore em SVG, no estilo de ilustração a traço:
 * linhas finas, sem preenchimento, galhos em tan (#B09B7A), folhinhas de
 * contorno e detalhes em verde (#548C6A). As posições vêm do layout real,
 * então o desenho se ajusta a qualquer largura de tela.
 */

const BARK = '#B09B7A';
const BARK_SOFT = '#CBBBA0';
const GREEN = '#548C6A';

const TRUNK_X = 18;
const TRUNK_TOP_HALF = 7;
const ROOT_HEIGHT = 80;

type BranchAnchor = { x: number; y: number; complete: boolean };
type Point = { x: number; y: number };
type Curve = [Point, Point, Point, Point];

/** Uma linha do tronco: desce com leve ondulação e converge na base. */
function trunkLine(xTop: number, xBottom: number, height: number, wobble: number): string {
  const top = -28;
  const steps = Math.max(3, Math.round((height - top) / 180));
  let d = `M ${xTop} ${top}`;
  for (let i = 1; i <= steps; i++) {
    const t0 = (i - 1) / steps;
    const t1 = i / steps;
    const y0 = top + (height - top) * t0;
    const y1 = top + (height - top) * t1;
    const xa = xTop + (xBottom - xTop) * t0;
    const xb = xTop + (xBottom - xTop) * t1;
    const sway = (i % 2 === 0 ? 1 : -1) * wobble;
    d += ` C ${xa + sway} ${y0 + (y1 - y0) / 3}, ${xb - sway} ${y1 - (y1 - y0) / 3}, ${xb} ${y1}`;
  }
  return d;
}

/** Galho: sai do tronco acima do quadro e desce em curva até ele. */
function branchCurve(anchor: BranchAnchor): Curve {
  const startX = TRUNK_X + TRUNK_TOP_HALF - 2;
  const gap = Math.max(anchor.x - startX, 26);
  const startY = Math.max(anchor.y - gap * 0.55, 2);
  return [
    { x: startX, y: startY },
    { x: startX + gap * 0.45, y: startY },
    { x: startX + gap * 0.78, y: anchor.y - gap * 0.14 },
    { x: anchor.x, y: anchor.y },
  ];
}

function pointOnCurve([p0, p1, p2, p3]: Curve, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function angleOnCurve(curve: Curve, t: number): number {
  const a = pointOnCurve(curve, t);
  const b = pointOnCurve(curve, Math.min(t + 0.02, 1));
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

function curveToPath([p0, c1, c2, p3]: Curve, dy = 0): string {
  return `M ${p0.x} ${p0.y + dy} C ${c1.x} ${c1.y + dy}, ${c2.x} ${c2.y + dy}, ${p3.x} ${p3.y + dy}`;
}

/** Folhinha de contorno com nervura, como no desenho de referência. */
const LeafMark: React.FC<{ x: number; y: number; angle: number; scale?: number }> = ({
  x,
  y,
  angle,
  scale = 1,
}) => (
  <g
    transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}
    stroke={BARK}
    strokeWidth={1.3}
    fill="none"
    strokeLinecap="round"
  >
    <path d="M 0 0 C 5 -5.5, 11 -3.5, 14 0 C 11 3.5, 5 5.5, 0 0 Z" />
    <path d="M 1.5 0 C 5 -0.6, 9 -0.4, 12 0" strokeWidth={0.9} strokeOpacity={0.75} />
  </g>
);

/** Container do tronco: mede os quadros e desenha tronco + galhos + folhas. */
export const TreeTrunkCanvas: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const lastSig = useRef('');
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

  const height = size.h;
  const rootTop = Math.max(height - ROOT_HEIGHT, 40);

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
        {height > 0 && (
          <>
            {/* tronco: três traços que convergem na base */}
            <path d={trunkLine(TRUNK_X - TRUNK_TOP_HALF, TRUNK_X - 2, height, 2)} stroke={BARK_SOFT} strokeWidth="1.5" strokeLinecap="round" />
            <path d={trunkLine(TRUNK_X, TRUNK_X, height, 2)} stroke={BARK} strokeWidth="1.9" strokeLinecap="round" />
            <path d={trunkLine(TRUNK_X + TRUNK_TOP_HALF, TRUNK_X + 2, height, 2)} stroke={BARK_SOFT} strokeWidth="1.5" strokeLinecap="round" />

            {/* raízes */}
            <path
              d={`M ${TRUNK_X - 3} ${rootTop} C ${TRUNK_X - 10} ${rootTop + 34}, ${TRUNK_X - 16} ${height - 16}, ${TRUNK_X - 24} ${height}`}
              stroke={BARK_SOFT}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d={`M ${TRUNK_X + 3} ${rootTop} C ${TRUNK_X + 10} ${rootTop + 34}, ${TRUNK_X + 16} ${height - 16}, ${TRUNK_X + 24} ${height}`}
              stroke={BARK_SOFT}
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* galhos: dois traços paralelos + folhas ao longo do ramo */}
            {anchors.map((anchor, i) => {
              const curve = branchCurve(anchor);
              const stroke = anchor.complete ? GREEN : BARK;
              const gap = anchor.x - curve[0].x;
              return (
                <g key={i}>
                  <path d={curveToPath(curve, -2.4)} stroke={BARK_SOFT} strokeWidth="1.4" strokeLinecap="round" />
                  <path d={curveToPath(curve)} stroke={stroke} strokeWidth="2" strokeLinecap="round" />
                  {gap > 56 && (
                    <>
                      <LeafMark
                        x={pointOnCurve(curve, 0.34).x}
                        y={pointOnCurve(curve, 0.34).y - 2}
                        angle={angleOnCurve(curve, 0.34) - 38}
                        scale={0.92}
                      />
                      <LeafMark
                        x={pointOnCurve(curve, 0.62).x}
                        y={pointOnCurve(curve, 0.62).y - 3}
                        angle={angleOnCurve(curve, 0.62) - 30}
                        scale={0.8}
                      />
                    </>
                  )}
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

/** Galho do quadro + cabinhos que penduram cada folha. */
export const LeafSprigs: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const lastSig = useRef('');
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

  const railY = 12;
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
        {leaves.length > 0 && (
          <>
            {/* galho do quadro */}
            <path
              d={`M 2 ${railY} Q ${railEnd * 0.45} ${railY + 10}, ${railEnd} ${railY}`}
              stroke={BARK}
              strokeWidth="1.9"
              strokeLinecap="round"
            />
            <LeafMark x={railEnd * 0.28} y={railY + 3} angle={-32} scale={0.8} />
            <LeafMark x={railEnd * 0.62} y={railY + 4} angle={-24} scale={0.72} />

            {/* cabinhos até cada folha */}
            {leaves.map((leaf, i) => {
              const parent = parents.get(i);
              const fromX = parent === undefined ? leaf.x : leaves[parent].x;
              const fromY = parent === undefined ? railY : leaves[parent].bottom;
              const endY = leaf.y - 4;
              const dy = endY - fromY;
              const d = [
                `M ${fromX} ${fromY}`,
                `C ${fromX - 5} ${fromY + dy * 0.45},`,
                `${leaf.x + 5} ${endY - dy * 0.45},`,
                `${leaf.x} ${endY}`,
              ].join(' ');
              return (
                <path
                  key={i}
                  d={d}
                  stroke={leaf.blocked ? BARK_SOFT : BARK}
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeDasharray={leaf.blocked ? '3 4' : undefined}
                />
              );
            })}
          </>
        )}
      </svg>
      {children}
    </div>
  );
};
