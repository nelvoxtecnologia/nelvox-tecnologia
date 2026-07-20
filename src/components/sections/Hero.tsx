import { Headline } from "@/components/ui/Headline";
import { CtaLink } from "@/components/ui/CtaLink";
import { OrbitalCanvas } from "@/components/visual/OrbitalCanvas";
import { HERO } from "@/content/site";

/* ===== HERO ===== */
/**
 * Composição assimétrica: a headline ocupa as colunas 1–8 (cerca de 65%
 * da largura) e a direita fica vazia, ocupada apenas pelo motivo orbital.
 * O espaço negativo é tratado como luxo pelo manual — uma ideia dominante
 * por tela vale mais que densidade.
 *
 * O LCP desta página é a headline em texto, não o canvas: o motivo é
 * pintado depois e é puramente decorativo.
 */
export function Hero() {
  return (
    <section
      id="topo"
      data-animate="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* Camada decorativa. aria-hidden porque não carrega informação:
          descrevê-la só adicionaria ruído para leitores de tela. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[55%]">
        <OrbitalCanvas />
      </div>

      <div className="brand-container relative z-10 grid grid-cols-4 gap-gutter-mobile lg:grid-cols-brand lg:gap-gutter">
        <div className="col-span-4 lg:col-span-8">
          <p data-animate-item className="eyebrow">
            {HERO.eyebrow}
          </p>

          <Headline
            as="h1"
            content={HERO.headline}
            data-animate-item
            className="mt-6 text-[clamp(38px,7.5vw,84px)] leading-[1.03] tracking-[-0.02em]"
          />

          <p
            data-animate-item
            className="mt-8 max-w-[46ch] text-body text-papel-500"
          >
            {HERO.body}
          </p>

          <p
            data-animate-item
            className="mt-6 font-display text-h3 font-light italic text-gold-400"
          >
            {HERO.tagline}
          </p>

          <div data-animate-item className="mt-12">
            <CtaLink variant="primary" size="lg">
              {HERO.cta}
            </CtaLink>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute inset-x-0 bottom-8 z-10">
        <div className="brand-container">
          <a
            href="#o-que-fazemos"
            className="inline-flex items-center gap-4 text-papel-700 transition-colors duration-ui ease-brand-in-out hover:text-papel-500"
          >
            <span
              aria-hidden="true"
              className="block h-8 w-px bg-navy-700"
            />
            <span className="font-body text-eyebrow uppercase">
              {HERO.scrollHint}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
