import type { Metadata } from "next";
import { Preloader } from "@/components/preloader/Preloader";
import { Farol } from "@/components/farol/Farol";
import { CursorHalo } from "@/components/ui/CursorHalo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RichText } from "@/components/ui/RichText";
import { BackLink } from "@/components/ui/BackLink";
import { pageMetadata } from "@/lib/seo/metadata";
import { ORIGEM, PAGE_META, NAV_ORIGEM_HREF } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  ...PAGE_META.quemSomos,
  path: NAV_ORIGEM_HREF,
});

export default function OrigemPage() {
  return (
    <>
      <Preloader />
      <CursorHalo />
      <Farol initialDocked />
      <Header />

      <main id="conteudo" className="relative z-10 pb-[128px] pt-[160px] lg:pt-48">
        <div className="brand-container pb-8 lg:pb-12">
          <BackLink />
        </div>
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
