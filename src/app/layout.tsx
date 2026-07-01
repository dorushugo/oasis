import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/public/Header";
import MobileNav from "@/components/public/MobileNav";

const marianne = localFont({
  src: [
    { path: "../../public/fonts/Marianne-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Marianne-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Marianne-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-marianne",
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
    <html lang="fr" className={marianne.variable}>
      <body className="font-sans antialiased">
        <Header />
        <main className="pb-14 md:pb-0">{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
