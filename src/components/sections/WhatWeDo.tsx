import { Headline } from "@/components/ui/Headline";
import { WHAT_WE_DO } from "@/content/site";

/* ===== O QUE FAZEMOS ===== */
/**
 * Seção curta e direta. Também é o destino da âncora "Sobre" do menu —
 * não existe página institucional separada, e criar uma exigiria inventar
 * história que a marca não tem para contar hoje.
 */
export function WhatWeDo() {
  return (
    <section
      id="o-que-fazemos"
      data-animate="section"
      className="scroll-mt-16 py-28 lg:py-48"
    >
      <div className="brand-container grid grid-cols-4 gap-gutter-mobile lg:grid-cols-brand lg:gap-gutter">
        <div className="col-span-4 lg:col-span-5">
          <p data-animate-item className="eyebrow">
            {WHAT_WE_DO.eyebrow}
          </p>
          <Headline
            content={WHAT_WE_DO.headline}
            data-animate-item
            data-reveal="mask"
            className="mt-6 text-[clamp(30px,4vw,48px)] leading-[1.1]"
          />
          <p
            data-animate-item
            className="mt-8 max-w-[42ch] text-body text-papel-500"
          >
            {WHAT_WE_DO.body}
          </p>
        </div>

        {/* Lista à direita, separada por hairlines — sem cards, sem caixas.
            O manual pede bordas de 1px em Navy 700 e nada de sombra. */}
        <ul className="col-span-4 mt-16 lg:col-span-6 lg:col-start-7 lg:mt-0">
          {WHAT_WE_DO.items.map((item) => (
            <li
              key={item.title}
              data-animate-item
              className="border-t hairline py-8 first:border-t-0 first:pt-0"
            >
              <h3 className="font-body text-h4 font-semibold uppercase tracking-[1px] text-gold-400">
                {item.title}
              </h3>
              <p className="mt-4 max-w-[48ch] text-body text-papel-500">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
