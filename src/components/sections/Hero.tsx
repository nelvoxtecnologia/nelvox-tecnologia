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
    /* Navy 950 e não o Navy 900 do resto da página: o mockup de
       referência tem o hero em rgb(0,6,16), quase preto, e é esse fundo
       fundo que faz o fio de luz do limbo ter presença. */
    <section
      id="topo"
      data-animate="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-950 pt-16"
    >
      {/* Camada decorativa, ocupando a tela inteira: as órbitas precisam
          cruzar toda a composição e passar por trás da headline, como na
          referência. aria-hidden porque não carrega informação alguma —
          descrevê-la só adicionaria ruído para leitores de tela. */}
      <div
        data-hero-visual
        className="pointer-events-none absolute inset-0"
      >
        <OrbitalCanvas />
      </div>

      {/* Véu discreto sob a headline. Curto e de baixa opacidade: com o
          limbo reduzido ao fio medido na referência, o motivo não invade
          mais o texto, e um véu forte só apagaria as linhas orbitais. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/70 via-30% to-transparent to-55%"
      />

      <div className="brand-container relative z-10 grid grid-cols-4 gap-gutter-mobile lg:grid-cols-brand lg:gap-gutter">
        {/* Seis das doze colunas: na referência o bloco de texto ocupa
            cerca de 47% da largura, e deixar o resto vazio é o que dá ao
            motivo espaço para existir. */}
        <div className="col-span-4 lg:col-span-6">
          <p data-animate-item className="eyebrow">
            {HERO.eyebrow}
          </p>

          <Headline
            as="h1"
            content={HERO.headline}
            data-animate-item
            data-reveal="mask"
            className="mt-6 text-[clamp(34px,4.8vw,72px)] leading-[1.06] tracking-[-0.02em]"
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
            className="group inline-flex items-center gap-4 text-papel-700 transition-colors duration-ui ease-brand-in-out hover:text-papel-500"
          >
            {/* Cápsula com um ponto descendo em loop. É o único loop
                infinito da página, e está num elemento decorativo — o
                manual proíbe loop em conteúdo, não em um indicador cuja
                função é justamente insistir. */}
            <span
              aria-hidden="true"
              className="relative block h-10 w-6 shrink-0 rounded-full border hairline"
            >
              <span className="scroll-cue__dot absolute left-1/2 top-2 h-1 w-1 -translate-x-1/2 rounded-full bg-oceano-500" />
            </span>
            <span className="font-body text-eyebrow uppercase transition-colors duration-ui ease-brand-in-out group-hover:text-gold-400">
              {HERO.scrollHint}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
