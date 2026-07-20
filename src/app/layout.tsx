import type { Metadata } from "next";
import { cormorant, generalSans } from "@/fonts";
import { MotionScript } from "@/components/visual/MotionScript";
import { JsonLd } from "@/components/seo/JsonLd";
import { META, SITE_URL } from "@/content/site";
import "./globals.css";

/* O opengraph-image.png em src/app é detectado automaticamente pelo Next
   e vira as tags og:image e twitter:image. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: META.title,
  description: META.description,
  applicationName: META.siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: META.siteName,
    title: META.title,
    description: META.description,
  },
  twitter: {
    card: "summary_large_image",
    title: META.title,
    description: META.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${generalSans.variable}`}
    >
      <head>
        <MotionScript />
        <JsonLd />
      </head>
      <body>{children}</body>
    </html>
  );
}
