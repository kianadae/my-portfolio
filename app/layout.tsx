import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono, DM_Serif_Display } from "next/font/google";
import MotionProvider from "@/components/motion/MotionProvider";
import SmoothScroll from "@/components/motion/SmoothScroll";
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: "Christian Ada — WordPress Developer in Auckland",
  description:
    "WordPress developer with 5+ years’ experience. Currently Junior Website Developer at The Web Guys NZ. 60+ sites, CRM and payment integrations, and performance work that has cut load times by up to 30%. Open to Auckland roles and freelance builds.",
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
      "5+ years shipping WordPress sites. 60+ builds, CRM and payment integrations, load times cut by up to 30%. Open to roles and freelance.",
    type: "website",
    locale: "en_NZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Ada — WordPress Developer in Auckland",
    description: "WordPress developer in Auckland. 60+ sites, integrations, performance. Open to roles and freelance.",
  },
};

const boot = `(function(){try{var s=localStorage.getItem("ca-motion");var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;var on=s==="on"?true:s==="off"?false:!r;document.documentElement.classList.add(on?"motion-on":"motion-off");var t=localStorage.getItem("ca-theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");}catch(e){document.documentElement.classList.add("motion-on");document.documentElement.setAttribute("data-theme","dark");}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className={`${bebas.variable} ${dmSerif.variable} ${dmMono.variable} antialiased`}>
        <JsonLd />
        <MotionProvider>
          <SmoothScroll>
            <ThemeProvider>{children}</ThemeProvider>
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
