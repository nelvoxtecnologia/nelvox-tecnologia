import { Headline } from "@/components/ui/Headline";
import { CtaLink } from "@/components/ui/CtaLink";
import { CTA_SECTION } from "@/content/site";

/* ===== CTA FINAL ===== */
/**
 * Convite consultivo repetido no fim da página. O tom é o mesmo do hero:
 * uma conversa para entender o negócio, não um pedido de compra.
 */
export function CTASection() {
  return (
    <section
      id="contato"
      data-animate="section"
      className="scroll-mt-16 border-t hairline py-28 lg:py-48"
    >
      <div className="brand-container">
        <p data-animate-item className="eyebrow">
          {CTA_SECTION.eyebrow}
        </p>

        <Headline
          content={CTA_SECTION.headline}
          data-animate-item
          data-reveal="mask"
          className="mt-6 max-w-[16ch] text-[clamp(36px,6vw,72px)] leading-[1.05]"
        />

        <p
          data-animate-item
          className="mt-8 max-w-[46ch] text-body text-papel-500"
        >
          {CTA_SECTION.body}
        </p>

        <div data-animate-item className="mt-12">
          <CtaLink variant="primary" size="lg">
            {CTA_SECTION.cta}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
