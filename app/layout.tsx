import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Mono,
  Noto_Serif_Devanagari,
  Noto_Serif_Gujarati,
  Spectral,
} from "next/font/google";
import "./globals.css";
import { Experience } from "@/components/canvas/Experience";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Intro } from "@/components/ui/Intro";
import { PlateFrame } from "@/components/ui/PlateFrame";
import { plate } from "@/content/copy";
import { site } from "@/content/site";

// A scholarly text serif for the plate, a technical mono for its labels.
const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Quotes appear in all three scripts on the same page.
const devanagari = Noto_Serif_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
});

const gujarati = Noto_Serif_Gujarati({
  variable: "--font-gujarati",
  subsets: ["gujarati", "latin"],
});

const fonts = [spectral, plexMono, devanagari, gujarati]
  .map((font) => font.variable)
  .join(" ");

export const metadata: Metadata = {
  title: `${plate.title} — for ${site.name}`,
  description: `${plate.subtitle}. Made for ${site.name}, on the way to becoming a Registered Physiotherapist.`,
  // This is a private letter with her name on it. The link still works for
  // anyone she shares it with; it just stays out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fonts} antialiased`}>
      <body>
        <Intro />
        <SmoothScroll />
        <Experience />
        <div className="grain" aria-hidden="true" />
        <PlateFrame />
        {children}
      </body>
    </html>
  );
}
