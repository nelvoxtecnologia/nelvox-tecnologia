import { RichText } from "@/components/ui/RichText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SCENES } from "@/content/site";

/**
 * Cena 6 — CTA final. O rodapé completo (Footer.tsx) vem depois desta
 * seção, em `page.tsx` — não faz parte da cena em si, é o fim da
 * página.
 */
export function SceneCta() {
  return (
    <section
      id="cena-6"
      data-scene="6"
      className="cta-glow relative flex min-h-screen flex-col pb-24 pt-[196px] lg:pt-[218px]"
    >
      {/* Celular (artboard 390): bloco a partir de y=196, margens de 24px, gap 20;
          o botão ocupa a largura toda (56px de altura). */}
      <div className="mx-auto flex w-full max-w-container flex-col items-center gap-[20px] px-6 text-center lg:gap-6 lg:px-20">
        <p className="eyebrow">{SCENES.cta.eyebrow}</p>
        <h2 className="max-w-5xl font-display text-display-cta-mobile font-light text-papel-300 lg:text-display-xl">
          <RichText text={SCENES.cta.headline} breaks="mobile" />
        </h2>
        <p className="font-body text-body text-papel-500 lg:max-w-[28em]">{SCENES.cta.body}</p>

        <div className="mt-[12px] flex w-full flex-col items-center gap-[14px] lg:mt-4 lg:w-auto lg:gap-[12px]">
          <MagneticButton>{SCENES.cta.cta}</MagneticButton>
          <span className="font-body text-caption text-papel-700">{SCENES.cta.caption}</span>
        </div>
      </div>
    </section>
  );
}
