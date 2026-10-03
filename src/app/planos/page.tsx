import type { Metadata } from "next";
import { Preloader } from "@/components/preloader/Preloader";
import { Farol } from "@/components/farol/Farol";
import { CursorHalo } from "@/components/ui/CursorHalo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PlansContent } from "@/components/plans/PlansContent";
import { BackLink } from "@/components/ui/BackLink";
import { pageMetadata } from "@/lib/seo/metadata";
import { PAGE_META, NAV_PLANOS_HREF } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  ...PAGE_META.planos,
  path: NAV_PLANOS_HREF,
});

export default function PlanosPage() {
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
        <div className="brand-container">
          <PlansContent />
        </div>
      </main>

      <Footer />
    </>
  );
}
