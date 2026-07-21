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

/**
 * Gerador pseudoaleatório com semente fixa (mulberry32).
 *
 * A textura precisa ser densa — a medição do mockup encontrou 1274
 * pontos destacados — mas não pode mudar a cada redimensionamento da
 * janela, senão a superfície "ferveria". Semente fixa garante que o
 * mesmo planeta seja sempre desenhado.
 */
function makeRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Quanto da superfície, medido em fração do raio, ainda recebe luz.
 *
 * O perfil radial do mockup vai de luminância 182 na borda a 34 em 7%
 * de profundidade e 8,6 em 16% — praticamente apagado. Daí o limite.
 */
const LIT_DEPTH = 0.15;

/** Número de grãos e de luzes, proporcional à área realmente visível. */
const GRAIN_COUNT = 900;
const LIGHT_COUNT = 260;

/**
 * Textura da superfície: a faixa iluminada logo por dentro da borda.
 *
 * A medição do mockup mostra desvio de luminância de 25,3 numa janela de
 * 25px logo abaixo da borda, contra 1,6 no meio do disco — ou seja, a
 * superfície é granulada perto da luz rasante e lisa no resto. São três
 * camadas: um degradê que apaga com a profundidade, grãos finos que dão
 * o granulado, e luzes maiores esparsas.
 *
 * Tudo fica recortado ao disco e é desenhado ANTES do limbo, para não
 * encostar no fio de luz da borda.
 */
function drawSurface(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  { centerX, centerY, radius }: PlanetGeometry,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  /* Degradê radial: luz na borda decaindo até apagar em LIT_DEPTH. Só
     ele já reproduz o perfil medido (182 na borda, 34 em 7%, 8 em 16%). */
  const lit = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * (1 - LIT_DEPTH),
    centerX,
    centerY,
    radius,
  );
  /* Rampa curta e discreta. O perfil medido cai de 182 para 34 em 7% de
     profundidade, então a luz precisa morrer rápido: um degradê longo
     vira uma faixa azul chapada, que é o oposto de superfície. */
  lit.addColorStop(0, withAlpha(OCEANO[500], 0));
  lit.addColorStop(0.55, withAlpha(OCEANO[500], 0.015));
  lit.addColorStop(0.82, withAlpha(OCEANO[500], 0.06));
  lit.addColorStop(0.94, withAlpha(OCEANO[500], 0.13));
  lit.addColorStop(1, withAlpha(OCEANO[500], 0.2));

  /* Recorta no arco visível: sem isso o anel iluminado apareceria também
     do lado escuro do corpo. */
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, ARC_START - 0.25, ARC_END + 0.25);
  ctx.arc(centerX, centerY, radius * (1 - LIT_DEPTH), ARC_END + 0.25, ARC_START - 0.25, true);
  ctx.closePath();
  ctx.fillStyle = lit;
  ctx.fill();

  const random = makeRandom(20260720);

  /** Sorteia um ponto na faixa iluminada, adensando junto da borda. */
  const pick = (depthBias: number) => {
    const along = random();
    const angle = ARC_START - 0.15 + (ARC_END - ARC_START + 0.3) * along;
    /* Elevar a um expoente empurra a distribuição para perto da borda. */
    const inset = Math.pow(random(), depthBias) * LIT_DEPTH;
    const r = radius * (1 - inset);
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r,
      /* Some junto com a luz, para os grãos não flutuarem no escuro. */
      fade: 1 - inset / LIT_DEPTH,
    };
  };

  const onScreen = (x: number, y: number) =>
    x > -8 && x < width + 8 && y > -8 && y < height + 8;

  /* Grãos: o granulado de fundo. Muito pequenos e de baixa opacidade —
     lidos como variação da superfície, não como pontos. */
  for (let i = 0; i < GRAIN_COUNT; i++) {
    const { x, y, fade } = pick(2.2);
    if (!onScreen(x, y)) continue;
    ctx.beginPath();
    ctx.arc(x, y, 0.4 + random() * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(OCEANO[500], 0.1 + random() * 0.22 * fade);
    ctx.fill();
  }

  /* Luzes: mais claras e esparsas, o que dá o brilho de superfície. */
  for (let i = 0; i < LIGHT_COUNT; i++) {
    const { x, y, fade } = pick(3);
    if (!onScreen(x, y)) continue;
    const size = 0.5 + random() * 1.1;
    const alpha = (0.25 + random() * 0.6) * fade;

    ctx.beginPath();
    ctx.arc(x, y, size * 2.6, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(OCEANO[500], alpha * 0.3);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = withAlpha(PAPEL[50], alpha);
    ctx.fill();
  }

  ctx.restore();
}

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

  /* A superfície entra primeiro: o limbo é desenhado por cima dela, e
     assim o fio de luz da borda continua intacto. */
  drawSurface(ctx, width, height, { centerX, centerY, radius });

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

  return layer;
}
