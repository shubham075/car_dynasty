import type { Metadata } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { CustomCursor } from "@/components/common/CustomCursor";
import { FilmGrain } from "@/components/common/FilmGrain";
import { TextureDevToolbar } from "@/components/common/TextureDevToolbar";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://cardynasty.in"),
  title: "Car Dynasty | Automotive Cinematographer & Director (Apoorva Shrivastava)",
  description: "Official portfolio of Car Dynasty directed by Apoorva Shrivastava. Premium automotive cinematography, brand campaigns, car meets, and exotic supercar feature films across India.",
  keywords: [
    "Automotive Cinematography India",
    "Car Dynasty",
    "Apoorva Shrivastava",
    "Automotive Filmmaker Bhopal",
    "Supercar Videography",
    "Car Commercial Director",
    "Car Meet Films India"
  ],
  authors: [{ name: "Apoorva Shrivastava" }],
  openGraph: {
    title: "Car Dynasty | Automotive Cinematography & Films",
    description: "Premium cinematic automotive storytelling across India. 16K+ YouTube community, 200+ films.",
    url: "https://cardynasty.in",
    siteName: "Car Dynasty",
    images: [
      {
        url: "/assets/hero/hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "Car Dynasty Automotive Showcase",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Dynasty | Automotive Cinematography",
    description: "Directed by Apoorva Shrivastava. 16K+ YouTube subscribers, 200+ films.",
    images: ["/assets/hero/hero-poster.jpg"],
  },
};

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
        <FilmGrain />
        <CustomCursor />
        <TextureDevToolbar />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
