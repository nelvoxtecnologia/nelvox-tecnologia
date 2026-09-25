import type { ReactNode } from "react";
import { ChartLine, ChatCircle, FileText, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { RichText } from "@/components/ui/RichText";
import { ManageCookiesButton } from "./ManageCookiesButton";
import { PRIVACY } from "@/content/site";

/**
 * Corpo da página /privacidade — layout do Claude Design. Todo o texto vem
 * de `PRIVACY` (src/content/site.ts); aqui só existe estrutura visual.
 *
 * Espaçamentos em px arbitrários de propósito: a escala do
 * tailwind.config.ts é fechada (4, 8, 16, 24, 32…) — ver docs/MANUTENCAO.md.
 */

const ICONS = { chat: ChatCircle, file: FileText, chart: ChartLine, shield: ShieldCheck } as const;

/** Destaca [trechos entre colchetes] — dados ainda a confirmar (ver comentário de PRIVACY). */
function Fill({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/g).map((part, i) =>
        part.startsWith("[") ? (
          <span
            key={i}
            className="border-b border-dashed border-gold-400 bg-gold-400/15 px-1 text-gold-bright"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

const paragraph = "font-body text-[16px] leading-[1.7] text-papel-500";

function Section({ n, children }: { n: number; children: ReactNode }) {
  const isFirst = n === 1;
  const isLast = n === PRIVACY.titles.length;
  return (
    <section
      id={`s${n}`}
      className={`flex scroll-mt-[100px] flex-col gap-[18px] border-navy-700 ${
        isFirst ? "pb-[48px]" : isLast ? "border-t pt-[48px]" : "border-t py-[48px]"
      }`}
    >
      <span className="eyebrow">{String(n).padStart(2, "0")}</span>
      <h2 className="font-display text-[30px] font-normal leading-[1.05] text-papel-300 lg:text-[40px]">
        <RichText text={PRIVACY.titles[n - 1]} />
      </h2>
      {children}
    </section>
  );
}

/** Linha "rótulo | valor" com divisórias — usada em várias seções. */
function TermRows({ rows }: { rows: ReadonlyArray<{ term: string; text: string }> }) {
  return (
    <div className="flex flex-col border-t border-navy-700">
      {rows.map((row) => (
        <div
          key={row.term}
          className="grid grid-cols-1 gap-1 border-b border-navy-700 py-[14px] sm:grid-cols-[minmax(140px,220px)_1fr] sm:gap-4"
        >
          <span className="font-body text-[15px] font-medium text-papel-300">{row.term}</span>
          <span className="font-body text-[15px] leading-[1.6] text-papel-500">
            <Fill text={row.text} />
          </span>
        </div>
      ))}
    </div>
  );
}

const card = "flex flex-col gap-[6px] rounded-md border border-navy-700 bg-navy-800 px-6 py-[20px]";

export function PrivacyContent() {
  const P = PRIVACY;

  return (
    <div className="flex flex-col gap-[48px] lg:gap-[88px]">
      {/* Cabeçalho */}
      <header className="flex max-w-[880px] flex-col gap-6">
        <p className="eyebrow">{P.eyebrow}</p>
        <h1 className="font-display text-[44px] font-light leading-none tracking-[-1.5px] text-papel-300 lg:text-[84px]">
          <RichText text={P.headline} />
        </h1>
        <p className={`${paragraph} max-w-[40em]`}>{P.intro}</p>
        <span className="font-body text-caption text-papel-700">Última atualização: {P.updatedAt}</span>
      </header>

      <div className="flex flex-col gap-[40px] lg:flex-row lg:items-start lg:gap-[96px]">
        {/* Índice fixo ao rolar (desktop) */}
        <nav
          aria-label="Índice"
          className="flex w-full flex-none flex-col gap-[14px] lg:sticky lg:top-[112px] lg:w-[260px]"
        >
          <span className="eyebrow text-papel-700">{P.tocLabel}</span>
          <div className="flex flex-col border-l border-navy-700">
            {P.titles.map((title, i) => (
              <a
                key={title}
                href={`#s${i + 1}`}
                data-hot
                className="flex gap-[12px] py-[7px] pl-4 font-body text-[13px] leading-[1.4] text-papel-500 transition-colors duration-ui ease-brand-in-out hover:text-gold-bright"
              >
                <span className="min-w-[18px] text-papel-700">{String(i + 1).padStart(2, "0")}</span>
                {title.replaceAll("*", "")}
              </a>
            ))}
          </div>
        </nav>

        <article className="flex min-w-0 max-w-[760px] flex-1 flex-col">
          {/* 01 — Quem somos */}
          <Section n={1}>
            <p className={paragraph}>{P.quemSomos.lead}</p>
            <div className="flex flex-col border-t border-navy-700">
              {P.quemSomos.rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[minmax(110px,160px)_1fr] gap-4 border-b border-navy-700 py-[12px]"
                >
                  <span className="eyebrow pt-[5px] text-papel-700">{row.label}</span>
                  <span className="font-body text-[15px] leading-[1.6] text-papel-300">
                    <Fill text={row.value} />
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* 02 — Dados */}
          <Section n={2}>
            <p className={paragraph}>{P.dados.lead}</p>
            <div className="flex flex-col gap-[14px]">
              {P.dados.cards.map((c) => (
                <div key={c.title} className={card}>
                  <strong className="font-body text-[15px] font-semibold text-papel-300">{c.title}</strong>
                  <span className="font-body text-[15px] leading-[1.65] text-papel-500">
                    {c.text}
                    {"link" in c && c.link && (
                      <>
                        {" "}
                        <a href={c.link.href} className="text-gold-400 underline underline-offset-4 hover:text-gold-bright">
                          {c.link.label}
                        </a>
                        .
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* 03 — Usos */}
          <Section n={3}>
            <div className="flex flex-col border-t border-navy-700">
              {P.usos.items.map((item) => {
                const Icon = ICONS[item.icon as keyof typeof ICONS];
                return (
                  <div
                    key={item.text}
                    className="grid grid-cols-[24px_1fr] gap-[14px] border-b border-navy-700 py-[14px]"
                  >
                    <Icon size={18} weight="regular" aria-hidden="true" className="mt-[2px] text-gold-400" />
                    <span className="font-body text-[15px] leading-[1.65] text-papel-500">{item.text}</span>
                  </div>
                );
              })}
            </div>
            <p className={paragraph}>
              <strong className="font-semibold text-papel-300">{P.usos.strong}</strong> {P.usos.rest}
            </p>
          </Section>

          {/* 04 — Bases legais */}
          <Section n={4}>
            <p className={paragraph}>{P.bases.lead}</p>
            <TermRows rows={P.bases.rows} />
          </Section>

          {/* 05 — Cookies */}
          <Section n={5}>
            <p className={paragraph}>{P.cookies.lead}</p>
            <div className="flex flex-col gap-[14px]">
              {P.cookies.cards.map((c) => (
                <div key={c.title} className={`${card} gap-[12px] px-6 py-[22px]`}>
                  <div className="flex flex-wrap items-center justify-between gap-[12px]">
                    <strong className="font-body text-[15px] font-semibold text-papel-300">{c.title}</strong>
                    <span
                      className={`rounded-sm px-2 py-[5px] font-body text-[9px] font-medium uppercase tracking-[3px] ${
                        c.badge.filled
                          ? "bg-gold-400 text-navy-950"
                          : "border border-gold-400 py-[4px] text-gold-400"
                      }`}
                    >
                      {c.badge.label}
                    </span>
                  </div>
                  <span className="font-body text-[15px] leading-[1.65] text-papel-500">{c.text}</span>
                  <span className="font-body text-[13px] text-papel-700">{c.meta}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <ManageCookiesButton label={P.cookies.manage} />
              <span className="min-w-[240px] flex-1 font-body text-[13px] leading-[1.6] text-papel-700">
                {P.cookies.manageNote}
              </span>
            </div>
          </Section>

          {/* 06 — Compartilhamento */}
          <Section n={6}>
            <p className={paragraph}>{P.compartilhamento.lead}</p>
            <TermRows rows={P.compartilhamento.rows} />
          </Section>

          {/* 07 — Transferência internacional */}
          <Section n={7}>
            <p className={paragraph}>{P.transferencia}</p>
          </Section>

          {/* 08 — Retenção */}
          <Section n={8}>
            <TermRows rows={P.retencao.rows} />
            <p className={paragraph}>{P.retencao.closing}</p>
          </Section>

          {/* 09 — Direitos */}
          <Section n={9}>
            <p className={paragraph}>{P.direitos.lead}</p>
            <div
              className="grid gap-px overflow-hidden rounded-md border border-navy-700 bg-navy-700"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
            >
              {P.direitos.items.map((item) => (
                <span key={item} className="bg-navy-950 px-[18px] py-4 font-body text-[14px] leading-[1.55] text-papel-500">
                  {item}
                </span>
              ))}
            </div>
            <p className={paragraph}>
              {P.direitos.before}{" "}
              <a href={P.direitos.link.href} className="text-gold-400 underline underline-offset-4 hover:text-gold-bright">
                {P.direitos.link.label}
              </a>
              . {P.direitos.after}
            </p>
          </Section>

          {/* 10, 11, 12 — parágrafos simples */}
          <Section n={10}>
            <p className={paragraph}>{P.seguranca}</p>
          </Section>
          <Section n={11}>
            <p className={paragraph}>{P.criancas}</p>
          </Section>
          <Section n={12}>
            <p className={paragraph}>{P.alteracoes}</p>
          </Section>

          {/* 13 — Encarregado */}
          <Section n={13}>
            <p className={paragraph}>{P.encarregado.lead}</p>
            <div className="flex flex-col gap-[10px] rounded-md border border-navy-700 bg-navy-800 p-[28px]">
              <span className="font-display text-[28px] leading-[1.1] text-papel-300">
                <Fill text={P.encarregado.name} />
              </span>
              <a
                href={`mailto:${P.encarregado.email}`}
                className="font-body text-[15px] text-papel-500 transition-colors duration-ui hover:text-gold-bright"
              >
                <Fill text={P.encarregado.email} />
              </a>
            </div>
          </Section>
        </article>
      </div>
    </div>
  );
}
