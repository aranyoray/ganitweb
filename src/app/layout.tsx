import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "GanitAR — Math you can walk around",
    template: "%s | GanitAR",
  },
  description:
    "GanitAR is an iPhone and iPad app that drops 3D math objects into your space. Tap piles to add, scan or say a problem, print a practice worksheet — all on-device. No accounts. No tracking.",
  metadataBase: new URL("https://ganitar.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GanitAR",
    title: "GanitAR — Math you can walk around",
    description:
      "Drop 3D shapes onto your desk. Tap piles to combine, scan or speak a problem, print a worksheet. AR math for iPhone and iPad.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GanitAR — Math you can walk around",
    description:
      "Drop 3D shapes onto your desk. Tap piles to combine, scan or speak a problem. AR math for iPhone and iPad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-cream text-ink-800 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--radius-pill)] focus:bg-ink-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
