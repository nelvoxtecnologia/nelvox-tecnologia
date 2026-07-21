import { NAVY, OCEANO, PAPEL, withAlpha } from "@/tokens/brand";

/* ===== CORPO PLANETÁRIO ===== */
/**
 * Desenha o planeta do hero em um canvas fora de tela, uma única vez.
 *
 * O motivo de existir separado: o limbo depende de `shadowBlur` com raio
 * alto, que é a operação mais cara do Canvas 2D. Pagá-la a 60fps
 * derrubaria a taxa de quadros em celular — mas o planeta não se move.
 * Só as órbitas e os pontos animam, então o corpo é rasterizado uma vez
 * e daí em diante é só um `drawImage`.
 *
 * Ele é redesenhado apenas quando o canvas muda de tamanho.
 */

/** Luzes na superfície, em coordenadas polares relativas ao disco. */
type SurfaceLight = {
  /** Ângulo em radianos, medido a partir do limbo. */
  angle: number;
  /** Distância do centro, de 0 a 1. */
  distance: number;
  size: number;
  alpha: number;
};

/**
 * Concentradas perto da borda visível, onde a curvatura as comprime —
 * é isso que faz o disco parecer esférico e não um círculo chapado.
 */
const SURFACE_LIGHTS: SurfaceLight[] = [
  { angle: 2.72, distance: 0.965, size: 1.5, alpha: 0.95 },
  { angle: 2.98, distance: 0.94, size: 1.1, alpha: 0.8 },
  { angle: 3.32, distance: 0.975, size: 1.7, alpha: 0.9 },
  { angle: 3.55, distance: 0.93, size: 1.0, alpha: 0.65 },
  { angle: 2.45, distance: 0.985, size: 1.3, alpha: 0.85 },
  { angle: 3.86, distance: 0.955, size: 1.4, alpha: 0.7 },
  { angle: 2.2, distance: 0.945, size: 0.9, alpha: 0.6 },
  { angle: 3.1, distance: 0.9, size: 1.2, alpha: 0.55 },
  { angle: 3.45, distance: 0.885, size: 0.9, alpha: 0.45 },
  { angle: 2.62, distance: 0.905, size: 1.0, alpha: 0.5 },
  { angle: 4.05, distance: 0.975, size: 1.1, alpha: 0.6 },
  { angle: 2.05, distance: 0.97, size: 1.0, alpha: 0.55 },
];

export type PlanetGeometry = {
  centerX: number;
  centerY: number;
  radius: number;
};

/**
 * Onde o corpo fica: centro fora da tela à direita, de modo que apenas o
 * flanco esquerdo entre em quadro. É o enquadramento da referência — a
 * escala é sugerida justamente pelo que não cabe.
 */
export function planetGeometry(width: number, height: number): PlanetGeometry {
  const radius = Math.max(width, height) * 0.78;
  return {
    centerX: width + radius * 0.42,
    centerY: height * 0.52,
    radius,
  };
}

/** Rasteriza o corpo inteiro em um canvas próprio, no tamanho pedido. */
export function renderPlanet(
  width: number,
  height: number,
  dpr: number,
): HTMLCanvasElement {
  const layer = document.createElement("canvas");
  layer.width = Math.max(1, Math.round(width * dpr));
  layer.height = Math.max(1, Math.round(height * dpr));

  const ctx = layer.getContext("2d");
  if (!ctx) return layer;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const { centerX, centerY, radius } = planetGeometry(width, height);

  /* --- Atmosfera: halo azul que extravasa o disco ---
     Desenhado antes do corpo para ficar por baixo da silhueta. */
  const atmosphere = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.93,
    centerX,
    centerY,
    radius * 1.16,
  );
  atmosphere.addColorStop(0, withAlpha(OCEANO[500], 0.34));
  atmosphere.addColorStop(0.45, withAlpha(OCEANO[500], 0.1));
  atmosphere.addColorStop(1, withAlpha(OCEANO[500], 0));
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.16, 0, Math.PI * 2);
  ctx.fillStyle = atmosphere;
  ctx.fill();

  /* --- Massa do corpo ---
     Mais escura que o fundo da página, para o disco existir como volume
     sólido contra o Navy da seção. */
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = NAVY[950];
  ctx.fill();

  /* --- Luz rasante interna ---
     Um brilho que decai rápido a partir da borda iluminada, criando o
     terminador entre o lado aceso e o lado escuro. */
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  const terminator = ctx.createRadialGradient(
    centerX - radius * 0.98,
    centerY,
    0,
    centerX - radius * 0.98,
    centerY,
    radius * 0.92,
  );
  terminator.addColorStop(0, withAlpha(OCEANO[500], 0.5));
  terminator.addColorStop(0.18, withAlpha(OCEANO[500], 0.16));
  terminator.addColorStop(0.5, withAlpha(OCEANO[500], 0.03));
  terminator.addColorStop(1, withAlpha(OCEANO[500], 0));
  ctx.fillStyle = terminator;
  ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

  /* --- Luzes de superfície ---
     Ainda dentro do clip do disco, então nenhuma escapa da silhueta. */
  SURFACE_LIGHTS.forEach((light) => {
    const x = centerX + Math.cos(light.angle) * radius * light.distance;
    const y = centerY + Math.sin(light.angle) * radius * light.distance;

    ctx.beginPath();
    ctx.arc(x, y, light.size * 2.6, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(OCEANO[500], light.alpha * 0.25);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, light.size, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(PAPEL[50], light.alpha);
    ctx.fill();
  });

  ctx.restore();

  /* --- Limbo ---
     O fio de luz na borda. Três passadas de espessura decrescente: as
     largas e borradas fazem o brilho, a fina e clara faz o gume. Sem as
     camadas, a borda leria como um traço desenhado por cima do fundo. */
  const limbArcStart = Math.PI * 0.58;
  const limbArcEnd = Math.PI * 1.44;

  const passes = [
    { width: radius * 0.055, blur: radius * 0.13, color: OCEANO[500], alpha: 0.5 },
    { width: radius * 0.018, blur: radius * 0.06, color: OCEANO[500], alpha: 0.85 },
    { width: 1.5, blur: radius * 0.02, color: PAPEL[50], alpha: 0.95 },
  ];

  passes.forEach((pass) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, limbArcStart, limbArcEnd);
    ctx.shadowColor = withAlpha(pass.color, 0.9);
    ctx.shadowBlur = pass.blur;
    ctx.strokeStyle = withAlpha(pass.color, pass.alpha);
    ctx.lineWidth = pass.width;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  });

  return layer;
}
