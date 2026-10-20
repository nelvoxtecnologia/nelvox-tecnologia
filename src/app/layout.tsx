import type { Metadata } from "next";
import { cormorant, generalSans } from "@/fonts";
import { MotionScript } from "@/components/visual/MotionScript";
import { JsonLd } from "@/components/seo/JsonLd";
import { Tracking } from "@/components/consent/Tracking";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ConsentPreferences } from "@/components/consent/ConsentPreferences";
import { WhatsappFloatingButton } from "@/components/ui/WhatsappFloatingButton";
import { META, SITE_URL } from "@/content/site";
import "./globals.css";

/* O opengraph-image.png em src/app é detectado automaticamente pelo Next
   e vira as tags og:image e twitter:image. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${META.title} | ${META.siteName}`, template: `%s | ${META.siteName}` },
  description: META.description,
  applicationName: META.siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: META.siteName,
    title: `${META.title} | ${META.siteName}`,
    description: META.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${META.title} | ${META.siteName}`,
    description: META.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* suppressHydrationWarning porque o MotionScript escreve data-motion
       no <html> de propósito antes da hidratação. Sem isto o React trata
       o atributo como divergência e o remove ao hidratar — levando junto
       a regra de CSS que depende dele. */
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${generalSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <MotionScript />
        <JsonLd />
        {/* Sem JavaScript os cards do Método (Saúde, Turismo, Negócios Locais) ficariam em opacity:0
            para sempre: a revelação por rolagem depende de JS. Aqui eles aparecem de uma vez. */}
        <noscript>
          <style>{"#cena-4 button{opacity:1!important}"}</style>
        </noscript>
      </head>
      {/* Extensões de navegador escrevem atributos no <body> antes do
          React hidratar (o ColorZilla injeta cz-shortcut-listen, por
          exemplo), e o React acusa isso como divergência de hidratação.
          Não há nada a corrigir no código — o aviso é sobre o ambiente
          de quem visita, então é suprimido aqui. */}
      <body suppressHydrationWarning>
        {/* Primeiro elemento focável de TODAS as páginas: permite pular a navegação. */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-gold-400 focus:px-6 focus:py-2 focus:font-body focus:text-[15px] focus:font-semibold focus:text-navy-950"
        >
          Pular para o conteúdo
        </a>
        {children}
        <WhatsappFloatingButton />
        <ConsentBanner />
        <ConsentPreferences />
        <Tracking />
      </body>
    </html>
  );
}
