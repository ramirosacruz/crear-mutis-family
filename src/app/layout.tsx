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
  title: "Generador de Mutis | Crea mutis únicos y divertidos",
  description:
    "Generador de Mutis online: creá mutis únicos, graciosos y personalizados para compartir en redes sociales.",
  keywords: [
    "mutis",
    "generador de mutis",
    "mutis online",
    "frases mutis",
    "humor",
    "memes",
  ],
  openGraph: {
    title: "Generador de Mutis",
    description:
      "Creá mutis únicos, divertidos y listos para compartir en redes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Generador de Mutis",
    description:
      "Creá mutis únicos, divertidos y listos para compartir en redes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
