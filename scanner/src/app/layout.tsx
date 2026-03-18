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
  title: "Portaria Alta Café - Scanner",
  description: "Sistema de validação de ingressos e credenciais",
  themeColor: "#5D4037",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Portaria Café",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overscroll-none h-full selection:bg-primary-green/30`}
      >
        {children}
      </body>
    </html>
  );
}
