import type { Metadata } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSection } from "@/cms/settings";
import { getSite, getSiteUrl } from "@/cms/content";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateMetadata(): Metadata {
  const seo = getSection("seo");
  const site = getSite();
  const url = getSiteUrl();
  return {
    metadataBase: new URL(url),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: site.name }],
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url,
      siteName: site.brandName,
      images: seo.ogImage ? [{ url: seo.ogImage, width: 1920, height: 1080, alt: `${site.brandName} Automotive Showcase` }] : [],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable} ${mono.variable} dark`}
    >
      <body className="min-h-screen bg-[#070809] texture-asphalt text-zinc-100 antialiased selection:bg-[#ff4d00] selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
