"use client";

import { useEffect, useRef } from "react";
import { GOLD, OCEANO, PAPEL, withAlpha } from "@/tokens/brand";

/* ===== MOTIVO ORBITAL ===== */
/**
 * O elemento gráfico do hero, em Canvas 2D.
 *
 * A geometria não é decoração aleatória: o símbolo Nelvox é um "N" cujas
 * duas foices são arcos amplos e achatados, atravessados por uma diagonal
 * que sobe a cerca de 56° da horizontal. As órbitas abaixo reusam essa
 * inclinação e esse achatamento, de modo que as linhas do hero e as
 * curvas da logo pertençam à mesma família.
 *
 * Canvas 2D e não WebGL de propósito: o site precisa carregar rápido em
 * celular com internet média, e uma engine 3D custaria mais que o efeito
 * inteiro vale.
 */

/** Inclinação da diagonal do símbolo, em radianos. */
const SYMBOL_AXIS = (-56 * Math.PI) / 180;

type Orbit = {
  /** Raio maior, relativo à maior dimensão do canvas. */
  radius: number;
  /** Achatamento: 1 é círculo, valores menores achatam como as foices. */
  flatten: number;
  /** Desvio em relação ao eixo do símbolo, em radianos. */
  tilt: number;
  /** Trecho visível do arco — as foices são abertas, não fechadas. */
  arcStart: number;
  arcEnd: number;
  /** Velocidade angular em radianos por segundo (loop ambiente, bem lento). */
  speed: number;
  alpha: number;
};

const ORBITS: Orbit[] = [
  {
    radius: 0.95,
    flatten: 0.62,
    tilt: 0,
    arcStart: -0.15,
    arcEnd: Math.PI * 1.15,
    speed: 0.012,
    alpha: 0.28,
  },
  {
    radius: 0.72,
    flatten: 0.78,
    tilt: 0.42,
    arcStart: Math.PI * 0.15,
    arcEnd: Math.PI * 1.5,
    speed: -0.018,
    alpha: 0.2,
  },
  {
    radius: 1.24,
    flatten: 0.5,
    tilt: -0.34,
    arcStart: Math.PI * 0.35,
    arcEnd: Math.PI * 1.25,
    speed: 0.008,
    alpha: 0.14,
  },
];

/**
 * Pontos luminosos ancorados às órbitas. `orbit` é o índice da órbita e
 * `angle` a posição inicial ao longo dela.
 *
 * Exatamente um ponto usa Oceano Digital: o manual limita a cor a menos
 * de 5% da composição e a no máximo dois elementos, e aqui ela vale mais
 * como acento único do que espalhada.
 */
const NODES = [
  { orbit: 0, angle: 0.35, size: 1.6, tech: false },
  { orbit: 0, angle: 2.1, size: 1.1, tech: false },
  { orbit: 1, angle: 0.9, size: 2.2, tech: true },
  { orbit: 1, angle: 3.4, size: 1.3, tech: false },
  { orbit: 2, angle: 1.6, size: 1.4, tech: false },
  { orbit: 2, angle: 3.1, size: 1.0, tech: false },
];

/** Poeira de fundo: posições fixas em coordenadas normalizadas. */
const DUST = [
  { x: 0.18, y: 0.22, size: 1.0 },
  { x: 0.42, y: 0.14, size: 0.7 },
  { x: 0.68, y: 0.35, size: 1.2 },
  { x: 0.31, y: 0.61, size: 0.8 },
  { x: 0.76, y: 0.72, size: 1.0 },
  { x: 0.55, y: 0.86, size: 0.7 },
  { x: 0.12, y: 0.79, size: 0.9 },
];

export function OrbitalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let isVisible = true;
    let startTime = performance.now();
    /** Tempo decorrido no momento da pausa, para retomar sem salto visual. */
    let pausedAt = 0;

    /**
     * Ajusta o buffer do canvas à densidade da tela. O DPR é limitado a 2
     * porque telas 3x triplicariam a área a pintar sem ganho perceptível
     * em linhas de 1px.
     */
    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /**
     * Desenha um quadro. `elapsed` em segundos controla a rotação lenta
     * das órbitas e a respiração dos pontos.
     */
    function draw(elapsed: number) {
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      /* O sistema fica ancorado na borda direita e ligeiramente abaixo do
         centro, sugerindo um corpo grande que continua fora da tela — a
         mesma leitura do mockup, sem precisar renderizar um planeta. */
      const centerX = width * 0.92;
      const centerY = height * 0.52;
      const scale = Math.max(width, height);

      ORBITS.forEach((orbit) => {
        const rx = scale * orbit.radius;
        const ry = rx * orbit.flatten;
        const rotation = SYMBOL_AXIS + orbit.tilt + elapsed * orbit.speed;

        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          rx,
          ry,
          rotation,
          orbit.arcStart,
          orbit.arcEnd,
        );
        ctx.strokeStyle = withAlpha(GOLD[400], orbit.alpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      /* Poeira estática: dá profundidade sem competir com as órbitas. */
      DUST.forEach((dust) => {
        ctx.beginPath();
        ctx.arc(dust.x * width, dust.y * height, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(PAPEL[300], 0.22);
        ctx.fill();
      });

      NODES.forEach((node, index) => {
        const orbit = ORBITS[node.orbit];
        const rx = scale * orbit.radius;
        const ry = rx * orbit.flatten;
        const rotation = SYMBOL_AXIS + orbit.tilt + elapsed * orbit.speed;
        const angle = node.angle + elapsed * orbit.speed;

        /* Ponto sobre a elipse, depois rotacionado junto com ela. */
        const localX = Math.cos(angle) * rx;
        const localY = Math.sin(angle) * ry;
        const x = centerX + localX * Math.cos(rotation) - localY * Math.sin(rotation);
        const y = centerY + localX * Math.sin(rotation) + localY * Math.cos(rotation);

        /* Respiração dessincronizada, para nenhum par pulsar em uníssono. */
        const pulse = 0.75 + 0.25 * Math.sin(elapsed * 0.9 + index * 1.7);
        const color = node.tech ? OCEANO[500] : GOLD[300];
        const radius = node.size * pulse;

        /* Halo suave antes do núcleo, para o ponto parecer luz e não disco. */
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 7);
        glow.addColorStop(0, withAlpha(color, 0.42));
        glow.addColorStop(1, withAlpha(color, 0));
        ctx.beginPath();
        ctx.arc(x, y, radius * 7, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(color, 0.9);
        ctx.fill();
      });
    }

    function loop(now: number) {
      draw((now - startTime) / 1000);
      frameId = requestAnimationFrame(loop);
    }

    function start() {
      if (frameId || reduceMotion) return;
      /* Recoloca a origem do tempo para trás pelo tanto que já havia
         decorrido, senão as órbitas saltariam para a posição inicial a
         cada retomada. */
      startTime = performance.now() - pausedAt * 1000;
      frameId = requestAnimationFrame(loop);
    }

    function stop() {
      if (!frameId) return;
      pausedAt = (performance.now() - startTime) / 1000;
      cancelAnimationFrame(frameId);
      frameId = 0;
    }

    resize();

    if (reduceMotion) {
      /* Um único quadro, sem loop: a composição continua existindo para
         quem pediu para não ter movimento. */
      draw(0);
    } else {
      start();
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    resizeObserver.observe(canvas);

    /* Fora da viewport o hero não precisa continuar sendo pintado —
       economiza bateria durante toda a leitura do resto da página. */
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else if (isVisible) start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
    />
  );
}
