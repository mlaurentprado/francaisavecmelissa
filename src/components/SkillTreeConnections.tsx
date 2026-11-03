import React, { useId, useLayoutEffect, useRef, useState } from 'react';

/**
 * Desenho da árvore em SVG.
 * As linhas são calculadas a partir da posição real dos cartões (galhos e
 * folhas) no layout, então continuam corretas em qualquer largura de tela.
 * Nada aqui muda regra de negócio — é só o desenho das conexões.
 */

const TRUNK_X = 14;

type BranchAnchor = { x: number; y: number; color: string; complete: boolean };

function trunkPath(height: number): string {
  if (height <= 0) return '';
  // começa 24px acima do container para encostar na copa
  const start = -24;
  const steps = Math.max(2, Math.round((height - start) / 140));
  const step = (height - start) / steps;
  let d = `M ${TRUNK_X} ${start}`;
  for (let i = 1; i <= steps; i++) {
    const y0 = start + step * (i - 1);
    const y1 = start + step * i;
    const sway = i % 2 === 0 ? 6 : -6;
    d += ` C ${TRUNK_X + sway} ${y0 + step / 3}, ${TRUNK_X - sway} ${y1 - step / 3}, ${TRUNK_X} ${y1}`;
  }
  return d;
}

function branchPath(anchor: BranchAnchor): string {
  const startX = TRUNK_X + 4;
  const startY = Math.max(anchor.y - 26, 2);
  const endX = Math.max(anchor.x - 2, startX + 14);
  return `M ${startX} ${startY} C ${startX + 14} ${startY}, ${endX - 28} ${anchor.y}, ${endX} ${anchor.y}`;
}

/** Container do tronco: mede os cartões de galho e desenha tronco + ramos. */
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
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6E8352" />
            <stop offset="50%" stopColor="#5F7A43" />
            <stop offset="100%" stopColor="#B5603F" />
          </linearGradient>
        </defs>

        {size.h > 0 && (
          <>
            <path
              d={trunkPath(size.h)}
              stroke={`url(#${gradientId})`}
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d={trunkPath(size.h)}
              stroke="#FFFFFF"
              strokeOpacity="0.18"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform="translate(-2.5 0)"
            />
            {anchors.map((anchor, i) => (
              <path
                key={i}
                d={branchPath(anchor)}
                stroke={anchor.color}
                strokeOpacity={anchor.complete ? 1 : 0.85}
                strokeWidth="5"
                strokeLinecap="round"
              />
            ))}
          </>
        )}
      </svg>
      {children}
    </div>
  );
};

type LeafPoint = { x: number; y: number; blocked: boolean };

/** Raminho horizontal do galho + cabinhos curvos até cada folha. */
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

  const railY = 12;
  const railEnd = leaves.length > 0 ? Math.max(...leaves.map((l) => l.x)) : 0;

  return (
    <div ref={ref} className="relative mt-3 pt-6">
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
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {leaves.length > 0 && (
          <>
            <path
              d={`M 1 ${railY} Q ${railEnd / 2} ${railY + 4} ${railEnd} ${railY}`}
              stroke={`url(#${gradientId})`}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {leaves.map((leaf, i) => (
              <path
                key={i}
                d={`M ${leaf.x} ${railY} C ${leaf.x - 5} ${railY + 6}, ${leaf.x + 5} ${leaf.y - 14}, ${leaf.x} ${leaf.y - 6}`}
                stroke={color}
                strokeOpacity={leaf.blocked ? 0.22 : 0.55}
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
          </>
        )}
      </svg>
      {children}
    </div>
  );
};
