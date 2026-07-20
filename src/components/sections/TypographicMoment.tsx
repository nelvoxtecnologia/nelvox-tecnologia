import { Headline } from "@/components/ui/Headline";
import { TYPOGRAPHIC_MOMENT } from "@/content/site";

/* ===== MOMENTO TIPOGRÁFICO ===== */
/**
 * Quebra proposital do ritmo das seções: a tagline da marca em escala
 * dramática (120px+ em desktop), única vez na página em que a tipografia
 * ocupa a tela sozinha.
 *
 * Fundo em Navy 950 em vez do Navy 900 do resto da página — o degrau de
 * profundidade separa o momento sem precisar de borda ou textura, que o
 * manual proíbe.
 */
export function TypographicMoment() {
  return (
    <section
      data-animate="section"
      className="bg-navy-950 py-28 lg:py-48"
      aria-labelledby="momento-tagline"
    >
      <div className="brand-container">
        <Headline
          id="momento-tagline"
          content={TYPOGRAPHIC_MOMENT.headline}
          data-animate-item
          className="max-w-[14ch] text-[clamp(56px,13vw,168px)] leading-[0.95] tracking-[-0.03em]"
        />
        <p
          data-animate-item
          className="mt-12 max-w-[40ch] text-body text-papel-500 lg:ml-auto lg:mt-16"
        >
          {TYPOGRAPHIC_MOMENT.support}
        </p>
      </div>
    </section>
  );
}
