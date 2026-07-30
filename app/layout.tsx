import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel Vila Nova do Príncipe",
  description:
    "Hospitalidade, história e conforto em um casarão restaurado em Caetité, Bahia.",
  metadataBase: new URL("https://hotel-vila-nova-principe.chatgpt.app"),
  openGraph: {
    title: "Hotel Vila Nova do Príncipe",
    description:
      "Hospitalidade, história e conforto em um casarão restaurado em Caetité, Bahia.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/og.png", width: 1733, height: 908 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel Vila Nova do Príncipe",
    description:
      "Hospitalidade, história e conforto em um casarão restaurado em Caetité, Bahia.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
