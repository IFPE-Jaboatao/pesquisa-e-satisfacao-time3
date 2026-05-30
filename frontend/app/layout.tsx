import { ThemeModeScript } from "flowbite-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { ThemeInit } from "../.flowbite-react/init";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Pesquisas e Avaliações - IFPE",
  description: "Site de pesquisas e avaliações do IFPE",
  icons: {
    icon: "/pesquisa-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`antialiased`}
      >
        <div className="flex min-h-screen flex-col">

        <ThemeInit />
        <main className="flex flex-1 flex-col">
        {children}
        </main>
        </div>
      </body>
    </html>
  );
}
