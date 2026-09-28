import type { Metadata } from "next";
import { Preloader } from "@/components/preloader/Preloader";
import { Farol } from "@/components/farol/Farol";
import { CursorHalo } from "@/components/ui/CursorHalo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PlansContent } from "@/components/plans/PlansContent";
import { BackLink } from "@/components/ui/BackLink";
import { PLANS_INTRO, META, SITE_URL, NAV_PLANOS_HREF } from "@/content/site";

export const metadata: Metadata = {
  title: `${PLANS_INTRO.eyebrow} — ${META.siteName}`,
  description: PLANS_INTRO.intro,
  alternates: { canonical: NAV_PLANOS_HREF },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${SITE_URL}${NAV_PLANOS_HREF}`,
    title: `${PLANS_INTRO.eyebrow} — ${META.siteName}`,
    description: PLANS_INTRO.intro,
  },
};

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
