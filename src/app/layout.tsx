import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'IBEX-35 & Púnica: ¡PALANTE! | Fanzine Edition',
  description: 'Simulador satírico y ácido de toma de decisiones sobre la corrupción y las cloacas del poder en España.',
  openGraph: {
    title: 'IBEX-35 & Púnica: ¡PALANTE! (Fanzine Edition)',
    description: '¿Acabarás en el consejo de administración o en Soto del Real? Toma decisiones en el sumario judicial más turbio.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IBEX-35 & Púnica: ¡PALANTE! (Fanzine Edition)',
    description: 'Juego de decisiones ácidas y cloacas del Estado.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f3ef] text-black">{children}</body>
    </html>
  );
}
