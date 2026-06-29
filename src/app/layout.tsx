import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/public/Header";
import MobileNav from "@/components/public/MobileNav";

const satoshi = localFont({
  src: "../../public/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Oasis — ${process.env.NEXT_PUBLIC_CITY_NAME || "Ma Ville"}`,
  description: "Plateforme de gestion de crise canicule — trouvez les lieux de fraîcheur près de chez vous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={satoshi.variable}>
      <body className="font-sans antialiased">
        <Header />
        <main className="pb-14 md:pb-0">{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
