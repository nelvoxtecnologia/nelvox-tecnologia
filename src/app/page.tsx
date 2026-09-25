import { Preloader } from "@/components/preloader/Preloader";
import { Farol } from "@/components/farol/Farol";
import { CursorHalo } from "@/components/ui/CursorHalo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SceneProgress } from "@/components/layout/SceneProgress";
import { HomeScroll } from "@/components/visual/HomeScroll";
import { SceneHero } from "@/components/scenes/SceneHero";
import { SceneSea } from "@/components/scenes/SceneSea";
import { SceneMethod } from "@/components/scenes/SceneMethod";
import { SceneMission } from "@/components/scenes/SceneMission";
import { SceneCta } from "@/components/scenes/SceneCta";

export default function Home() {
  return (
    <>
      <Preloader />
      <HomeScroll />
      <CursorHalo />
      <Farol />

      {/* Primeiro elemento focável da página: permite pular a navegação. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-gold-400 focus:px-6 focus:py-2 focus:font-body focus:text-[15px] focus:font-semibold focus:text-navy-950"
      >
        Pular para o conteúdo
      </a>

      <Header />
      <SceneProgress />

      <main id="conteudo" className="relative z-10">
        <SceneHero />
        <SceneSea />
        <SceneMethod />
        <SceneMission />
        <SceneCta />
      </main>

      <Footer />
    </>
  );
}
