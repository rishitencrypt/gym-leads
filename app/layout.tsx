import type { Metadata } from "next";
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
    default: "IronForge Fitness | Premium Gym & Personal Training",
    template: "%s | IronForge Fitness",
  },
  description:
    "Elite coaching, world-class equipment and programs that deliver. Book your free trial session at IronForge Fitness today.",
  keywords: ["gym", "fitness", "personal training", "free trial", "weight loss", "muscle gain"],
  openGraph: {
    type: "website",
    siteName: "IronForge Fitness",
    title: "IronForge Fitness | Premium Gym & Personal Training",
    description:
      "Elite coaching, world-class equipment and programs that deliver. Book your free trial session today.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "IronForge Fitness",
    description: "Book your free trial session at IronForge Fitness today.",
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
