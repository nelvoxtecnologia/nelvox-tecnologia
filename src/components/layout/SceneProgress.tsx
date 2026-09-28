"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFarolLit } from "@/lib/useFarolLit";

const SCENES = [
  { n: 1, label: "01 · Hero" },
  { n: 2, label: "02 · O problema" },
  { n: 3, label: "03 · A solução" },
  { n: 4, label: "04 · Método" },
  { n: 5, label: "05 · Missão" },
  { n: 6, label: "06 · Conversa" },
] as const;

/**
 * Indicador de progresso entre as 6 cenas. Cada `[data-scene="N"]` no
 * documento (seções e, na Cena 2/3, marcadores internos de
 * `SceneSea`) é observado por IntersectionObserver; a cena ativa é a
 * de maior número entre as que cruzam o centro da viewport.
 *
 * Some por completo antes do farol acender (não faz sentido navegar
 * por cenas que ainda não existem para quem chegou) e no mobile vira
 * trilho passivo, só leitura.
 */
/* Só existe indicador onde existem cenas — /quem-somos e /politica-de-privacidade não
   têm `[data-scene]` e não devem mostrar um indicador vazio. */
const hasScenes = () =>
  typeof document !== "undefined" && document.querySelectorAll("[data-scene]").length > 0;

export function SceneProgress() {
  const lit = useFarolLit();
  /* `hasScenes()` só é chamada depois que `lit` já é true — nesse ponto
     a renderização inicial (a que é comparada com o servidor) já
     passou, então ler o DOM aqui não corre risco de hidratação. */
  const visible = lit && hasScenes();
  const [current, setCurrent] = useState(1);
  const activeRef = useRef(new Set<number>());

  useEffect(() => {
    if (!visible) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const n = Number(entry.target.getAttribute("data-scene"));
          if (!n) return;
          if (entry.isIntersecting) activeRef.current.add(n);
          else activeRef.current.delete(n);
        });
        if (activeRef.current.size > 0) {
          setCurrent(Math.max(...activeRef.current));
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visible]);

  const goTo = useCallback((n: number) => {
    const el = document.querySelector<HTMLElement>(`[data-scene="${n}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Trilho passivo no celular: só leitura, sem alvo de toque; some nas Cenas 4 e 6, como nas artboards. */}
      <div
        data-progress
        aria-hidden="true"
        className={`fixed right-2 top-1/2 z-40 -translate-y-1/2 flex-col items-center gap-[10px] lg:hidden ${current === 4 || current === 6 ? "hidden" : "flex"}`}
      >
        {SCENES.map((scene) => (
          <span
            key={scene.n}
            className="rounded-full"
            style={
              scene.n === current
                ? { width: 5, height: 5, background: "#C8B38A" }
                : scene.n < current
                  ? { width: 4, height: 4, background: "#2C567F" }
                  : { width: 4, height: 4, background: "#1A3B5C" }
            }
          />
        ))}
      </div>

      <nav
        data-progress
        aria-label="Cenas"
        className="animate-header-in fixed right-[36px] top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-[22px] lg:flex"
      >
        {SCENES.map((scene) => {
        const isCurrent = scene.n === current;
        const isPast = scene.n < current;
        return (
          <button
            key={scene.n}
            type="button"
            onClick={() => goTo(scene.n)}
            aria-label={`Ir para ${scene.label}`}
            aria-current={isCurrent ? "step" : undefined}
            data-hot
            className="group relative flex h-6 w-6 items-center justify-center"
          >
            <span
              className="pointer-events-none absolute right-8 whitespace-nowrap font-body text-eyebrow text-papel-500 opacity-0 transition-[opacity,transform] duration-ui ease-brand-in-out group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{ transform: isCurrent ? "translateX(0)" : "translateX(8px)" }}
            >
              {isCurrent ? scene.label : ""}
            </span>
            <span
              className="rounded-full transition-all duration-ui ease-brand-in-out"
              style={
                isCurrent
                  ? {
                      width: 8,
                      height: 8,
                      background: "#C8B38A",
                      boxShadow: "0 0 0 4px rgba(200,179,138,.16), 0 0 12px rgba(240,223,184,.55)",
                    }
                  : isPast
                    ? { width: 6, height: 6, background: "#2C567F" }
                    : { width: 6, height: 6, border: "1px solid #2C567F", background: "transparent" }
              }
            />
          </button>
          );
        })}
      </nav>
    </>
  );
}
