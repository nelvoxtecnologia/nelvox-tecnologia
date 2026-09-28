"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DotField, type DotFieldHandle } from "@/components/visual/DotField";
import { RichText } from "@/components/ui/RichText";
import { SCENES } from "@/content/site";

const TRIGGER_PROGRESS = 0.12;
/* Onde o texto troca de "Problema" para "Solução" e volta, em fração do
   scroll dentro do "pin". O blend entre as duas camadas é CONTÍNUO (scrub),
   não um estado binário com transição de tempo fixo — assim ele sempre
   acompanha a posição exata do scroll, em qualquer velocidade e direção,
   em vez de "correr atrás" quando o usuário rola rápido. TEXT_BACKWARD_AT/
   TEXT_FORWARD_AT continuam existindo como a FAIXA em que o blend ocorre
   (histerese: ida e volta cruzam a faixa em sentidos opostos, então o
   texto não "treme" se o scroll parar bem no meio). */
const TEXT_FORWARD_AT = 0.38;
const TEXT_BACKWARD_AT = 0.3;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * Cenas 2 (Problema) + 3 (Solução): mesma composição e os mesmos
 * pontos, como o handoff exige. O "pin" é feito com `position: sticky`
 * em vez de ScrollTrigger — mais simples e sem risco de desalinhar com
 * o scrub do farol, que lê `window.scrollY` diretamente.
 *
 * A cascata do mar de pontos (ver DotField) só acontece uma vez, na
 * direção de ida — refazer o desenho ponto a ponto ao subir custaria
 * uma segunda passada inteira pelo canvas a cada scroll para trás, sem
 * ganho perceptível. Já o texto (Problema/Solução) troca nos dois
 * sentidos, porque é barato e porque olhando para trás faz sentido ver
 * de novo o texto que estava lá.
 */
export function SceneSea() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotFieldRef = useRef<DotFieldHandle>(null);
  const cascadeTriggeredRef = useRef(false);
  const [phase, setPhase] = useState<"problema" | "solucao">("problema");

  /* As 4 camadas de texto (título+corpo de Problema e de Solução) recebem a
     opacity do blend DIRETO por ref a cada frame — não via state/classe
     Tailwind — para o crossfade sempre corresponder exatamente à posição do
     scroll, em qualquer velocidade, sem depender de uma transição CSS de
     tempo fixo "correndo atrás" do usuário. */
  const problemaHeadingRef = useRef<HTMLDivElement>(null);
  const solucaoHeadingRef = useRef<HTMLDivElement>(null);
  const problemaBodyRef = useRef<HTMLParagraphElement>(null);
  const solucaoBodyRef = useRef<HTMLParagraphElement>(null);

  const onScroll = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;

    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

    /* Blend contínuo (0 = só Problema, 1 = só Solução) — função monotônica
       de `progress`, sem estado, sem flicker possível: ao contrário de um
       toggle binário, não há "borda" para tremer perto de. */
    const blend = clamp01((progress - TEXT_BACKWARD_AT) / (TEXT_FORWARD_AT - TEXT_BACKWARD_AT));
    if (problemaHeadingRef.current) problemaHeadingRef.current.style.opacity = String(1 - blend);
    if (solucaoHeadingRef.current) solucaoHeadingRef.current.style.opacity = String(blend);
    if (problemaBodyRef.current) problemaBodyRef.current.style.opacity = String(1 - blend);
    if (solucaoBodyRef.current) solucaoBodyRef.current.style.opacity = String(blend);

    /* `phase` só decide aria-hidden/pointer-events (acessibilidade e
       clique) — não a opacidade visual. Mantém a histerese: ida e volta
       cruzam a faixa em pontos diferentes, então não troca de leitor de
       tela nem de alvo de clique repetidamente com o scroll parado no meio. */
    setPhase((current) => {
      if (current === "problema" && progress >= TEXT_FORWARD_AT) return "solucao";
      if (current === "solucao" && progress <= TEXT_BACKWARD_AT) return "problema";
      return current;
    });

    /* Cascata do mar de pontos: dispara uma única vez, na ida. */
    if (!cascadeTriggeredRef.current && progress >= TRIGGER_PROGRESS) {
      cascadeTriggeredRef.current = true;

      const farol = document.querySelector<HTMLElement>("[data-farol-wrapper]");
      const canvas = wrapper.querySelector<HTMLCanvasElement>("canvas");
      let originX = 80;
      let originY = (canvas?.getBoundingClientRect().height ?? 900) - 143;

      if (farol && canvas) {
        const farolRect = farol.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        originX = farolRect.left + farolRect.width * 0.5 - canvasRect.left;
        originY = farolRect.top + farolRect.height * (178 / 720) - canvasRect.top;
      }

      dotFieldRef.current?.lightUp(originX, originY);
    }
  }, []);

  /* O loop de rAF só roda enquanto a cena está perto da viewport — sem
     isso, ele rodaria para sempre depois que o visitante já tivesse
     passado para o Método, a Missão ou o CTA, gastando bateria e CPU
     com um cálculo cujo resultado ninguém mais vê. */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let raf = 0;
    const loop = () => {
      onScroll();
      raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "50% 0px 50% 0px" },
    );
    observer.observe(wrapper);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [onScroll]);

  /* Cada "camada" de texto (Problema/Solução) ocupa a MESMA célula do grid
     ([grid-area:1/1]), então a caixa tem a altura da maior e o texto que
     entra não empurra o layout. A opacity vem do blend por ref (onScroll);
     aqui só controla o que recebe clique/leitor de tela. */
  const layer = (active: boolean) => `[grid-area:1/1] ${active ? "" : "pointer-events-none"}`;

  return (
    /* 130vh (não 160vh): a cascata e a troca de texto terminam bem antes do
       fim do "pin" — o trecho de scroll depois disso não produzia nenhuma
       mudança visual e era lido como "travou" (feedback de usuário,
       28/09/2026). Ver DECISOES.md. */
    <div ref={wrapperRef} className="relative h-[130vh]">
      <div id="cena-2" data-scene="2" className="sticky top-0 h-screen overflow-hidden">
        {/* Horizonte (mobile 520/844, desktop 500/900) e névoa centrada nele */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[61.6%] h-px lg:top-[55.6%]"
          style={{ background: "rgba(44,86,127,.3)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[61.6%] h-[110px] -translate-y-1/2 lg:top-[55.6%] lg:h-[150px]"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(16,40,65,.5) 50%, transparent)",
          }}
        />

        <DotField ref={dotFieldRef} className="absolute inset-0 h-full w-full" />

        {/* Mobile: eyebrow, título e apoio empilhados a partir de y=116 (left 24 / right 28).
            Desktop: título à esquerda e apoio à direita, centralizados na altura. */}
        <div className="relative z-10 mx-auto grid h-full w-full max-w-container content-start gap-[20px] pl-6 pr-[28px] pt-[116px] lg:grid-cols-12 lg:content-center lg:items-center lg:gap-6 lg:px-20 lg:pt-0">
          <div className="grid lg:col-span-7">
            <div
              ref={problemaHeadingRef}
              className={`${layer(phase === "problema")} flex flex-col gap-[20px]`}
              style={{ opacity: 1 }}
              aria-hidden={phase !== "problema"}
            >
              <p className="eyebrow">{SCENES.problema.eyebrow}</p>
              <h2 className="font-display text-display-l-mobile font-light text-papel-300 lg:max-w-xl lg:text-display-l">
                <RichText text={SCENES.problema.headline} breaks="desktop" />
              </h2>
            </div>
            <div
              ref={solucaoHeadingRef}
              className={`${layer(phase === "solucao")} flex flex-col gap-[20px]`}
              style={{ opacity: 0 }}
              aria-hidden={phase !== "solucao"}
            >
              <p className="eyebrow">{SCENES.solucao.eyebrow}</p>
              <h2 className="font-display text-display-l-mobile font-light text-papel-300 lg:max-w-xl lg:text-display-l">
                <RichText text={SCENES.solucao.headline} breaks="desktop" />
              </h2>
            </div>
          </div>

          <div className="grid lg:col-span-5">
            <p
              ref={problemaBodyRef}
              className={`${layer(phase === "problema")} font-body text-body text-papel-500 lg:max-w-[340px]`}
              style={{ opacity: 1 }}
              aria-hidden={phase !== "problema"}
            >
              {SCENES.problema.body}
            </p>
            <p
              ref={solucaoBodyRef}
              className={`${layer(phase === "solucao")} font-body text-body text-papel-500 lg:max-w-[340px]`}
              style={{ opacity: 0 }}
              aria-hidden={phase !== "solucao"}
            >
              {SCENES.solucao.body}
            </p>
          </div>
        </div>
      </div>

      {/* Marca a Cena 3 para o indicador de progresso: aproximadamente onde
          a cascata já terminou, dado o ponto em que ela é disparada. */}
      <span
        id="cena-3"
        data-scene="3"
        aria-hidden="true"
        className="absolute left-0 h-px w-px"
        style={{ top: "70%" }}
      />
    </div>
  );
}
