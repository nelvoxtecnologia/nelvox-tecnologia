import type { Metadata } from "next";
import { Preloader } from "@/components/preloader/Preloader";
import { Farol } from "@/components/farol/Farol";
import { CursorHalo } from "@/components/ui/CursorHalo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TermsContent } from "@/components/legal/TermsContent";
import { BackLink } from "@/components/ui/BackLink";
import { loadTerms } from "@/lib/legal/terms";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_META, NAV_TERMOS_HREF } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  ...PAGE_META.termos,
  path: NAV_TERMOS_HREF,
});

export default function TermosDeUsoPage() {
  const terms = loadTerms();

  return (
    <>
      {/* PENDENTE: validação jurídica antes do merge. O texto (docs/referencias/termos_de_uso_nelvox.md)
          ainda não passou por revisão jurídica. Este comentário não vai para a página. */}
      <Preloader />
      <CursorHalo />
      <Farol initialDocked />
      <Header />

      <main id="conteudo" className="relative z-10 pb-[128px] pt-[160px] lg:pt-48">
        <div className="brand-container pb-8 lg:pb-12">
          <BackLink />
        </div>
        <div className="brand-container">
          <TermsContent terms={terms} />
        </div>
      </main>

      <Footer />
    </>
  );
}
