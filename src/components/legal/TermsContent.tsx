import { Fragment } from "react";
import { TERMS_UPDATED_AT } from "@/content/site";
import type { Terms } from "@/lib/legal/terms";

/**
 * Corpo de /termos-de-uso — mesmo layout de /politica-de-privacidade (cabeçalho, índice fixo,
 * seções numeradas). O texto vem de docs/referencias/termos_de_uso_nelvox.md (ver lib/legal/terms.ts);
 * aqui só existe estrutura visual. Espaçamentos em px arbitrários de propósito: a escala do
 * tailwind.config.ts é fechada — ver docs/MANUTENCAO.md.
 */

const paragraph = "font-body text-[16px] leading-[1.7] text-papel-500";
const link = "text-gold-400 underline underline-offset-4 hover:text-gold-bright";

/** URLs e e-mails do texto viram links; o texto continua exatamente o mesmo. */
const LINKABLE = /(https?:\/\/[^\s)]*[^\s).,;:]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(LINKABLE).map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        const href = part.startsWith("http") ? part : `mailto:${part}`;
        return (
          <a key={i} href={href} className={link}>
            {part}
          </a>
        );
      })}
    </>
  );
}

export function TermsContent({ terms }: { terms: Terms }) {
  const total = terms.sections.length;

  return (
    <div className="flex flex-col gap-[48px] lg:gap-[88px]">
      <header className="flex max-w-[880px] flex-col gap-6">
        <h1 className="font-display text-[44px] font-light leading-none tracking-[-1.5px] text-papel-300 lg:text-[84px]">
          {terms.title}
        </h1>
        <span className="font-body text-caption text-papel-700">Última atualização: {TERMS_UPDATED_AT}</span>
      </header>

      <div className="flex flex-col gap-[40px] lg:flex-row lg:items-start lg:gap-[96px]">
        <nav
          aria-label="Índice"
          className="flex w-full flex-none flex-col gap-[14px] lg:sticky lg:top-[112px] lg:w-[260px]"
        >
          <span className="eyebrow text-papel-700">Nesta página</span>
          <div className="flex flex-col border-l border-navy-700">
            {terms.sections.map((section) => (
              <a
                key={section.n}
                href={`#s${section.n}`}
                data-hot
                className="flex gap-[12px] py-[7px] pl-4 font-body text-[13px] leading-[1.4] text-papel-500 transition-colors duration-ui ease-brand-in-out hover:text-gold-bright"
              >
                <span className="min-w-[18px] text-papel-700">{String(section.n).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        <article className="flex min-w-0 max-w-[760px] flex-1 flex-col">
          {terms.sections.map((section, index) => {
            const isFirst = index === 0;
            const isLast = index === total - 1;
            return (
              <section
                key={section.n}
                id={`s${section.n}`}
                className={`flex scroll-mt-[100px] flex-col gap-[18px] border-navy-700 ${
                  isFirst ? "pb-[48px]" : isLast ? "border-t pt-[48px]" : "border-t py-[48px]"
                }`}
              >
                <span className="eyebrow">{String(section.n).padStart(2, "0")}</span>
                <h2 className="font-display text-[30px] font-normal leading-[1.05] text-papel-300 lg:text-[40px]">
                  {section.title}
                </h2>
                {section.blocks.map((block, i) =>
                  block.type === "p" ? (
                    <p key={i} className={paragraph}>
                      <Linkified text={block.text} />
                    </p>
                  ) : (
                    <ul key={i} className="flex flex-col border-t border-navy-700">
                      {block.items.map((item) => (
                        <li
                          key={item}
                          className="grid grid-cols-[24px_1fr] gap-[14px] border-b border-navy-700 py-[14px] font-body text-[15px] leading-[1.65] text-papel-500"
                        >
                          <span aria-hidden="true" className="mt-[10px] h-[5px] w-[5px] rounded-full bg-gold-400" />
                          <span>
                            <Linkified text={item} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </section>
            );
          })}
        </article>
      </div>
    </div>
  );
}
