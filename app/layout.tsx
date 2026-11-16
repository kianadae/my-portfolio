import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono, DM_Serif_Display } from "next/font/google";
import MotionProvider from "@/components/motion/MotionProvider";
import ThemeProvider from "@/components/theme/ThemeProvider";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: "Christian Ada — WordPress Developer in Auckland",
  description:
    "WordPress developer with 5+ years’ experience. Currently Junior Website Developer at The Web Guys NZ. 40+ sites, CRM and payment integrations, and performance work that has cut load times by up to 30%. Open to Auckland roles and freelance builds.",
  keywords: [
    "WordPress developer Auckland",
    "Junior Website Developer",
    "The Web Guys NZ",
    "freelance WordPress",
    "Christian Ada",
  ],
  openGraph: {
    title: "Christian Ada — WordPress Developer in Auckland",
    description:
      "5+ years shipping WordPress sites. 40+ builds, CRM and payment integrations, load times cut by up to 30%. Open to roles and freelance.",
    type: "website",
    locale: "en_NZ",
    images: [{ url: "/logo.png", alt: "Christian Ada" }],
  },
  twitter: {
    card: "summary",
    title: "Christian Ada — WordPress Developer in Auckland",
    description: "WordPress developer in Auckland. 40+ sites, integrations, performance. Open to roles and freelance.",
  },
};

const motionBoot = `(function(){try{var s=localStorage.getItem("ca-motion");var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var on=s==="on"?true:s==="off"?false:!r;document.documentElement.classList.add(on?"motion-on":"motion-off");}catch(e){document.documentElement.classList.add("motion-on");}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body className={`${bebas.variable} ${dmSerif.variable} ${dmMono.variable} antialiased`}>
        <JsonLd />
        <MotionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
