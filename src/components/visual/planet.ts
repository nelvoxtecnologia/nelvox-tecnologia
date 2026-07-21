import { OCEANO, PAPEL, withAlpha } from "@/tokens/brand";

/* ===== CORPO PLANETÁRIO ===== */
/**
 * Desenha o limbo do planeta do hero em um canvas fora de tela.
 *
 * A geometria e a intensidade não foram estimadas: foram medidas no
 * mockup de referência da marca (Assets/Nelvox Site - Home.jpeg,
 * 1536x1024). Os números que importam de lá:
 *
 *   - centro do círculo em (1.283·largura, 1.129·altura) — bem abaixo e
 *     à direita, fora do quadro;
 *   - raio de 0.691·largura, o que põe a borda visível em x ≈ 59%;
 *   - o brilho tem 14px de largura a meia altura, ou seja 0.9% da
 *     largura da tela. É um fio, não uma faixa;
 *   - o interior do disco é rgb(0,12,24), praticamente igual ao fundo
 *     rgb(0,6,16). O planeta não tem massa visível — só a borda acesa;
 *   - o pico do brilho é quase branco (rgb 208,255,255) e decai para um
 *     ciano fosco nas pontas do arco.
 *
 * Fica em módulo separado porque o glow depende de `shadowBlur`, a
 * operação mais cara do Canvas 2D. O corpo não se move, então é
 * rasterizado uma vez e daí em diante é só `drawImage` — só as órbitas e
 * os pontos animam.
 */

export type PlanetGeometry = {
  centerX: number;
  centerY: number;
  radius: number;
};

/**
 * Onde o corpo fica. As proporções vêm da medição do mockup; em telas
 * em retrato o raio passa a acompanhar a altura, senão o arco sairia
 * quase todo do quadro no celular.
 */
export function planetGeometry(width: number, height: number): PlanetGeometry {
  const portrait = height > width;
  const radius = portrait ? height * 0.62 : width * 0.691;

  return {
    centerX: portrait ? width + radius * 0.52 : width * 1.283,
    centerY: portrait ? height * 1.02 : height * 1.129,
    radius,
  };
}

/** Trecho do arco que chega a entrar no quadro, com folga nas pontas. */
const ARC_START = Math.PI * 1.02;
const ARC_END = Math.PI * 1.52;

/** Luzes de superfície, logo por dentro da borda acesa. */
const SURFACE_LIGHTS = [
  { along: 0.18, inset: 0.012, size: 1.4, alpha: 0.8 },
  { along: 0.26, inset: 0.03, size: 1.0, alpha: 0.5 },
  { along: 0.34, inset: 0.008, size: 1.6, alpha: 0.9 },
  { along: 0.41, inset: 0.042, size: 0.9, alpha: 0.4 },
  { along: 0.48, inset: 0.018, size: 1.2, alpha: 0.7 },
  { along: 0.55, inset: 0.006, size: 1.5, alpha: 0.85 },
  { along: 0.62, inset: 0.035, size: 1.0, alpha: 0.45 },
  { along: 0.7, inset: 0.014, size: 1.3, alpha: 0.65 },
  { along: 0.78, inset: 0.026, size: 0.9, alpha: 0.4 },
  { along: 0.86, inset: 0.01, size: 1.1, alpha: 0.5 },
];

/** Rasteriza o limbo em um canvas próprio, no tamanho pedido. */
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

  /**
   * Intensidade ao longo do arco. Na referência o brilho é forte no
   * miolo vertical e some nas duas pontas, o que faz a luz parecer
   * rasante em vez de um contorno desenhado.
   */
  const falloff = (alpha: number) => {
    const g = ctx.createLinearGradient(0, height * 0.05, 0, height);
    g.addColorStop(0, withAlpha(OCEANO[500], 0));
    g.addColorStop(0.22, withAlpha(OCEANO[500], alpha));
    g.addColorStop(0.62, withAlpha(OCEANO[500], alpha));
    g.addColorStop(1, withAlpha(OCEANO[500], 0));
    return g;
  };

  const strokeArc = (
    lineWidth: number,
    blur: number,
    stroke: string | CanvasGradient,
    blurColor?: string,
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, ARC_START, ARC_END);
    if (blur > 0) {
      ctx.shadowColor = blurColor ?? withAlpha(OCEANO[500], 0.8);
      ctx.shadowBlur = blur;
    }
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
  };

  /* Três passadas somam os ~14px medidos: um halo curto, um corpo médio
     e o gume quase branco. Sem as camadas a borda leria como um traço
     desenhado por cima do fundo, e não como luz. */
  strokeArc(3, 18, falloff(0.3));
  strokeArc(1.8, 7, falloff(0.6));

  /* Gume: o pico medido é quase branco, não ciano. */
  const edge = ctx.createLinearGradient(0, height * 0.05, 0, height);
  edge.addColorStop(0, withAlpha(PAPEL[50], 0));
  edge.addColorStop(0.24, withAlpha(PAPEL[50], 0.9));
  edge.addColorStop(0.6, withAlpha(PAPEL[50], 0.85));
  edge.addColorStop(1, withAlpha(PAPEL[50], 0));
  strokeArc(1.2, 0, edge);

  /* Luzes de superfície, sempre por dentro da borda. */
  SURFACE_LIGHTS.forEach((light) => {
    const angle = ARC_START + (ARC_END - ARC_START) * light.along;
    const r = radius * (1 - light.inset);
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;

    if (x < -20 || x > width + 20 || y < -20 || y > height + 20) return;

    ctx.beginPath();
    ctx.arc(x, y, light.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(OCEANO[500], light.alpha * 0.22);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, light.size, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(PAPEL[50], light.alpha);
    ctx.fill();
  });

  return layer;
}
