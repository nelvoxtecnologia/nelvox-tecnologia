/* ===== MAR DE PONTOS (Cenas 2 e 3) ===== */
/**
 * Port literal do algoritmo do handoff
 * (`docs/design-handoff/Home Mockup.dc.html`, script final: `rng`,
 * `field`, `paint`, `refl`). A matemática não muda — só o formato de
 * saída, adaptado para desenhar em `<canvas>` em vez de gerar `div`s.
 */

export type Point = {
  x: number;
  y: number;
  s: number;
  k: number;
  weak: boolean;
  d: number;
  delay: number;
};

/** PRNG mulberry32 — determinístico por seed, para o campo ser estável entre renders. */
function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Gera o campo de pontos em perspectiva. `ox`/`oy` são a origem da
 * cascata (a lâmpada do farol persistente); `dw`/`dh` recortam a zona
 * onde o farol fica, para os pontos não nascerem atrás dele.
 */
export function field(
  W: number,
  H: number,
  hz: number,
  rows: number,
  nFar: number,
  nNear: number,
  seed: number,
  ox: number,
  oy: number,
  dw: number,
  dh: number,
  sMax: number,
): Point[] {
  const r = mulberry32(seed);
  const pts: Omit<Point, "delay">[] = [];

  for (let i = 0; i < rows; i++) {
    const k = (i + 1) / rows;
    const y = hz + (H - hz - 22) * Math.pow(k, 1.6);
    const n = Math.round(nFar + (nNear - nFar) * k);

    for (let j = 0; j < n; j++) {
      const x = ((j + 0.15 + r() * 0.7) / n) * W;
      const yy = y + (r() - 0.5) * (4 + 14 * k);
      const weak = r() < 0.15;
      const s = 1 + sMax * k * (0.65 + r() * 0.5);
      if (x < dw && yy > H - dh) continue;
      pts.push({ x, y: yy, s, k, weak, d: Math.hypot(x - ox, yy - oy) });
    }
  }

  const maxD = Math.max(...pts.map((p) => p.d));
  return pts.map((p) => ({ ...p, delay: p.d / maxD }));
}

export type PaintedPoint = {
  x: number;
  y: number;
  s: number;
  color: string;
  alpha: number;
  glow: number; // 0 = sem brilho
  glowAlpha: number;
};

/** Pinta o estado de cada ponto em um instante `c` (0..1) da cascata. */
export function paint(points: Point[], lit: boolean, c: number): PaintedPoint[] {
  return points.map((p) => {
    if (!lit || p.delay > c) {
      return {
        x: p.x,
        y: p.y,
        s: p.s,
        color: p.weak ? "#8F8574" : "#1A3B5C",
        alpha: p.weak ? 0.5 : 0.45 + 0.5 * p.k,
        glow: 0,
        glowAlpha: 0,
      };
    }

    const front = c < 1 && c - p.delay < 0.07;
    const glow = p.s * (front ? 5 : 3);

    return {
      x: p.x,
      y: p.y,
      s: p.s,
      color: front || p.s > 2.6 ? "#F0DFB8" : "#C8B38A",
      alpha: 0.55 + 0.45 * p.k,
      glow,
      glowAlpha: front ? 0.9 : 0.5,
    };
  });
}

export type Reflection = { x: number; y: number; w: number; h: number };

/** Reflexo vertical na água, só para pontos já acesos e grandes o bastante. */
export function refl(points: Point[], c: number): Reflection[] {
  return points
    .filter((p) => p.s > 2.4 && p.delay <= c)
    .map((p) => {
      const w = Math.max(1, p.s * 0.35);
      return { x: p.x, y: p.y + p.s, w, h: p.s * 7 };
    });
}
