import Link from "next/link";
import { RichText } from "@/components/ui/RichText";
import { MethodCards } from "./MethodCards";
import { SCENES, NAV_PLANOS_HREF } from "@/content/site";

/**
 * Cena 4 — Método. Server component: a interatividade (cards clicáveis +
 * diálogo de detalhe) vive em MethodCards.tsx.
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
            (ver SCENES.metodo.cards em site.ts). Clicar num card abre o
            detalhamento (MethodCards.tsx) — pedido de usuário (28/09/2026). */}
        <MethodCards cards={SCENES.metodo.cards} />

        <Link
          href={NAV_PLANOS_HREF}
          data-hot
          className="self-center rounded-sm border border-gold-400 px-6 py-[14px] font-body text-[14px] font-semibold tracking-[0.3px] text-gold-400 transition-colors duration-ui ease-brand-in-out hover:bg-gold-400/10 hover:text-gold-bright"
        >
          Conheça Nossos Planos
        </Link>
      </div>
    </section>
  );
}
