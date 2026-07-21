"use client";

import { useEffect, useRef } from "react";
import { GOLD, OCEANO, PAPEL, withAlpha } from "@/tokens/brand";
import { prefersReducedMotion } from "@/lib/motion";
import { planetGeometry, renderPlanet } from "./planet";

/* ===== MOTIVO ORBITAL ===== */
/**
 * O elemento gráfico do hero, em Canvas 2D.
 *
 * Três camadas, da mais distante para a mais próxima: o corpo planetário
 * ancorado fora da tela à direita (rasterizado uma vez em planet.ts), as
 * órbitas que passam à frente dele, e os pontos luminosos sobre elas.
 *
 * A geometria das órbitas não é arbitrária: o símbolo Nelvox é um "N"
 * cujas foices são arcos amplos e achatados, cortados por uma diagonal a
 * cerca de 56° da horizontal. As elipses reusam essa inclinação e esse
 * achatamento, então as linhas do hero e as curvas da logo pertencem à
 * mesma família.
 *
 * Canvas 2D e não vídeo nem WebGL: um vídeo de fundo custaria megabytes
 * no celular e derrubaria justamente as métricas que este site precisa
 * entregar como prova de competência.
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
  /** Velocidade angular em radianos por segundo (loop ambiente, lento). */
  speed: number;
  alpha: number;
  weight: number;
};

const ORBITS: Orbit[] = [
  { radius: 0.95, flatten: 0.62, tilt: 0, arcStart: -0.15, arcEnd: Math.PI * 1.15, speed: 0.012, alpha: 0.5, weight: 1 },
  { radius: 0.72, flatten: 0.78, tilt: 0.42, arcStart: Math.PI * 0.15, arcEnd: Math.PI * 1.5, speed: -0.018, alpha: 0.38, weight: 0.9 },
  { radius: 1.24, flatten: 0.5, tilt: -0.34, arcStart: Math.PI * 0.35, arcEnd: Math.PI * 1.25, speed: 0.008, alpha: 0.3, weight: 0.8 },
  { radius: 1.55, flatten: 0.42, tilt: 0.22, arcStart: Math.PI * 0.5, arcEnd: Math.PI * 1.32, speed: -0.006, alpha: 0.2, weight: 0.8 },
];

/**
 * Pontos luminosos ancorados às órbitas.
 *
 * Os `tech` usam Oceano Digital e ganham flare maior — são os que a
 * referência coloca sobre o limbo do planeta. Os demais são Gold, e
 * fazem o contraponto quente das linhas.
 */
const NODES = [
  { orbit: 0, angle: 0.35, size: 2.6, tech: false, flare: 1 },
  { orbit: 0, angle: 2.1, size: 1.8, tech: false, flare: 0.6 },
  { orbit: 1, angle: 0.9, size: 3.2, tech: true, flare: 1.5 },
  { orbit: 1, angle: 3.4, size: 2, tech: false, flare: 0.7 },
  { orbit: 2, angle: 1.6, size: 2.2, tech: false, flare: 0.8 },
  { orbit: 2, angle: 3.05, size: 2.8, tech: true, flare: 1.3 },
  { orbit: 3, angle: 2.4, size: 1.6, tech: false, flare: 0.5 },
];

/** Poeira de fundo: posições fixas em coordenadas normalizadas. */
const DUST = [
  { x: 0.18, y: 0.22, size: 1.3 },
  { x: 0.42, y: 0.14, size: 0.9 },
  { x: 0.68, y: 0.35, size: 1.5 },
  { x: 0.31, y: 0.61, size: 1.1 },
  { x: 0.76, y: 0.72, size: 1.3 },
  { x: 0.55, y: 0.86, size: 0.9 },
  { x: 0.12, y: 0.79, size: 1.2 },
];

export function OrbitalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = prefersReducedMotion();

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let isVisible = true;
    let startTime = performance.now();
    /** Tempo decorrido no momento da pausa, para retomar sem salto visual. */
    let pausedAt = 0;
    /** Corpo planetário já rasterizado; só é refeito quando o tamanho muda. */
    let planetLayer: HTMLCanvasElement | null = null;

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      /* DPR limitado a 2: telas 3x triplicariam a área a pintar sem ganho
         perceptível em linhas finas. */
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      planetLayer = renderPlanet(width, height, dpr);
    }

    /**
     * Estrela de quatro pontas sobre um ponto luminoso. É o que faz a luz
     * ler como fonte intensa e não como um disco pintado — o mesmo efeito
     * que a referência tem sobre o limbo.
     */
    function drawFlare(
      x: number,
      y: number,
      length: number,
      color: string,
      alpha: number,
    ) {
      if (!ctx) return;

      const arms: Array<[number, number]> = [
        [length, 0],
        [0, length * 0.55],
      ];

      arms.forEach(([dx, dy]) => {
        const gradient = ctx.createLinearGradient(x - dx, y - dy, x + dx, y + dy);
        gradient.addColorStop(0, withAlpha(color, 0));
        gradient.addColorStop(0.5, withAlpha(color, alpha));
        gradient.addColorStop(1, withAlpha(color, 0));

        ctx.beginPath();
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x + dx, y + dy);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    /**
     * Desenha um quadro. `elapsed` em segundos controla a rotação lenta
     * das órbitas e a respiração dos pontos.
     */
    function draw(elapsed: number) {
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      if (planetLayer) {
        ctx.drawImage(planetLayer, 0, 0, width, height);
      }

      /* As órbitas orbitam o planeta, então compartilham o centro dele —
         é o que faz as linhas parecerem presas ao corpo em vez de
         flutuarem por cima. */
      const planet = planetGeometry(width, height);
      const centerX = planet.centerX - planet.radius * 0.34;
      const centerY = planet.centerY;
      const scale = Math.max(width, height);

      ORBITS.forEach((orbit) => {
        const rx = scale * orbit.radius;
        const ry = rx * orbit.flatten;
        const rotation = SYMBOL_AXIS + orbit.tilt + elapsed * orbit.speed;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, rx, ry, rotation, orbit.arcStart, orbit.arcEnd);
        ctx.strokeStyle = withAlpha(GOLD[400], orbit.alpha);
        ctx.lineWidth = orbit.weight;
        ctx.stroke();
      });

      DUST.forEach((dust) => {
        ctx.beginPath();
        ctx.arc(dust.x * width, dust.y * height, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(PAPEL[300], 0.3);
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
        const pulse = 0.82 + 0.18 * Math.sin(elapsed * 0.9 + index * 1.7);
        const color = node.tech ? OCEANO[500] : GOLD[300];
        const radius = node.size * pulse;

        const glowRadius = radius * 12;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        glow.addColorStop(0, withAlpha(color, 0.55));
        glow.addColorStop(0.3, withAlpha(color, 0.14));
        glow.addColorStop(1, withAlpha(color, 0));
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        drawFlare(x, y, radius * 22 * node.flare, color, 0.5 * pulse);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = withAlpha(node.tech ? PAPEL[50] : color, 0.95);
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
         decorrido, senão as órbitas saltariam a cada retomada. */
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

    /* Fora da viewport o hero não precisa continuar sendo pintado. */
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

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />;
}
