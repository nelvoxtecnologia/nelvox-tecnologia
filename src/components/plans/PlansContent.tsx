import { RichText } from "@/components/ui/RichText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PLANS, PLANS_INTRO, contactHrefForPlan } from "@/content/site";

/**
 * Corpo da página /planos. Um card por plano (mesmo padrão simples de card
 * usado em PrivacyContent.tsx); "Contratar Plano" abre o WhatsApp com uma
 * mensagem já citando o nome do plano (contactHrefForPlan, site.ts).
 */
export function PlansContent() {
  return (
    <div className="flex flex-col gap-[48px] lg:gap-[64px]">
      <header className="flex max-w-[880px] flex-col gap-6">
        <p className="eyebrow">{PLANS_INTRO.eyebrow}</p>
        <h1 className="font-display text-[44px] font-light leading-none tracking-[-1.5px] text-papel-300 lg:text-[72px]">
          <RichText text={PLANS_INTRO.headline} />
        </h1>
        <p className="max-w-[40em] font-body text-[16px] leading-[1.7] text-papel-500">
          {PLANS_INTRO.intro}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col gap-6 rounded-md border border-navy-700 bg-navy-800 p-[28px]"
          >
            <div className="flex flex-col gap-[6px]">
              <h2 className="font-display text-[26px] font-normal leading-[1.1] text-papel-300">
                {plan.name}
              </h2>
              <p className="font-body text-[13px] text-papel-700">{plan.slaLabel}</p>
            </div>

            <div className="flex flex-col gap-[2px] border-t border-navy-700 pt-[14px]">
              <span className="font-display text-[32px] font-light leading-none text-gold-400">
                {plan.monthly}
              </span>
              <span className="font-body text-[13px] text-papel-700">Setup: {plan.setup}</span>
            </div>

            <ul className="flex flex-1 flex-col gap-[10px] border-t border-navy-700 pt-[14px]">
              {plan.includes.map((item) => (
                <li key={item} className="font-body text-[14px] leading-[1.55] text-papel-500">
                  {item}
                </li>
              ))}
            </ul>

            <MagneticButton href={contactHrefForPlan(plan.name)}>Contratar Plano</MagneticButton>
          </div>
        ))}
      </div>
    </div>
  );
}
