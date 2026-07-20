import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { Method } from "@/components/sections/Method";
import { TypographicMoment } from "@/components/sections/TypographicMoment";
import { CTASection } from "@/components/sections/CTASection";
import { Preloader } from "@/components/preloader/Preloader";
import { ScrollReveal } from "@/components/visual/ScrollReveal";

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollReveal />

      {/* Primeiro elemento focável da página: permite pular a navegação. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-gold-400 focus:px-6 focus:py-2 focus:font-body focus:text-[15px] focus:font-semibold focus:text-navy-950"
      >
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo">
        <Hero />
        <WhatWeDo />
        <Method />
        <TypographicMoment />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
