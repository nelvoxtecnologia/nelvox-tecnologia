import type { Metadata } from "next";
import { Preloader } from "@/components/preloader/Preloader";
import { Farol } from "@/components/farol/Farol";
import { CursorHalo } from "@/components/ui/CursorHalo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RichText } from "@/components/ui/RichText";
import { ORIGEM, META, SITE_URL, NAV_ORIGEM_LABEL } from "@/content/site";

export const metadata: Metadata = {
  title: `${NAV_ORIGEM_LABEL} — ${META.siteName}`,
  description: ORIGEM.headline,
  alternates: { canonical: "/origem" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${SITE_URL}/origem`,
    title: `${NAV_ORIGEM_LABEL} — ${META.siteName}`,
    description: ORIGEM.headline,
  },
};

export default function OrigemPage() {
  return (
    <>
      <Preloader />
      <CursorHalo />
      <Farol initialDocked />
      <Header />

      <main id="conteudo" className="relative z-10 pb-[128px] pt-[160px] lg:pt-48">
        <article className="brand-container flex flex-col gap-24">
          <section className="flex flex-col gap-6">
            <p className="eyebrow">{ORIGEM.eyebrowBloco1}</p>
            <h1 className="max-w-3xl font-display text-display-l-mobile font-light text-papel-300 lg:text-display-l">
              {ORIGEM.headline}
            </h1>
            <div className="flex max-w-[34em] flex-col gap-[20px] font-body text-body text-papel-500">
              {ORIGEM.bloco1.map((paragraph, index) => (
                <p key={index}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <p className="eyebrow">{ORIGEM.eyebrowBloco2}</p>
            <div className="flex max-w-[34em] flex-col gap-[20px] font-body text-body text-papel-500">
              {ORIGEM.bloco2.map((paragraph, index) => (
                <p key={index}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
