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
    "GanitAR is an iPhone and iPad app that drops 3D math objects into your space. Count, add, and explore geometry in augmented reality. No accounts. No tracking.",
  metadataBase: new URL("https://ganitar.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GanitAR",
    title: "GanitAR — Math you can walk around",
    description:
      "Drop 3D shapes onto your desk. Walk around them. Count, add, explore. AR math for iPhone and iPad.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GanitAR — Math you can walk around",
    description:
      "Drop 3D shapes onto your desk. Walk around them. AR math for iPhone and iPad.",
    images: ["/og-image.png"],
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
