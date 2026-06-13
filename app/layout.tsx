import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { Archivo, Inter } from "next/font/google";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { ExitIntentPopup } from "@/components/site/exit-intent-popup";
// Ignore TS complaint about side-effect CSS import in the Next.js app directory
// @ts-ignore
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
  default: `${siteConfig.gymName} | Premium Gym & Personal Training`,
  template: `%s | ${siteConfig.gymName}`,
},
  description:
  `${siteConfig.tagline} Book your free trial session at ${siteConfig.gymName} today.`,
  keywords: ["gym", "fitness", "personal training", "free trial", "weight loss", "muscle gain"],
  openGraph: {
    type: "website",
    siteName: siteConfig.gymName,
    title: `${siteConfig.gymName} | Premium Gym & Personal Training`,
    description:
      `${siteConfig.tagline} Book your free trial session today.`,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.gymName,
    description: `Book your free trial session at ${siteConfig.gymName} today.`,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${archivo.variable} font-sans`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ExitIntentPopup />
      </body>
    </html>
  );
}
