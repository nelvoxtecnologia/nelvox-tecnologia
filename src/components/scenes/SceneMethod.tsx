import { RichText } from "@/components/ui/RichText";
import { NicheCard } from "./NicheCard";
import { SCENES } from "@/content/site";

/**
 * Cena 4 — Método. Server component: só o card tem interatividade.
 * Celular (artboard 390): cabeçalho a partir de y=112 (left/right 24, gap 20),
 * cards a partir de y=372 com margem de 20px e gap 16, empilhados.
 */
export function SceneMethod() {
  return (
    <section id="cena-4" data-scene="4" className="relative pb-16 pt-[112px] lg:py-36">
      <div className="mx-auto flex w-full max-w-container flex-col gap-[48px] lg:gap-16 lg:px-20">
        <div className="grid grid-cols-1 gap-[20px] px-6 lg:grid-cols-12 lg:gap-6 lg:px-0">
          <div className="flex flex-col gap-[20px] lg:col-span-7">
            <p className="eyebrow">{SCENES.metodo.eyebrow}</p>
            <h2 className="font-display text-display-l-mobile font-light text-papel-300 lg:text-display-l">
              <RichText text={SCENES.metodo.headline} breaks="desktop" />
            </h2>
          </div>
          <p className="font-body text-body text-papel-500 lg:col-span-5 lg:text-right">
            {SCENES.metodo.body}
          </p>
        </div>

        {/* 3 cards hoje (Saúde, Turismo, Negócios Locais — a ordem do mockup).
            Empilhado no celular; se o número mudar, ajustar `lg:grid-cols-3`
            (ver SCENES.metodo.cards em site.ts). */}
        <div className="grid grid-cols-1 gap-4 px-[20px] lg:grid-cols-3 lg:gap-6 lg:px-0">
          {SCENES.metodo.cards.map((card, index) => (
            <NicheCard key={card.id} card={card} delayMs={index * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
