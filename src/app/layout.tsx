import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import NavbarServer from "./(components)/navbar/navbarServer";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s - TimeTrackr", default: "TimeTrackr" },
  description: "App for å administrere arbeidsøktene dine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <NavbarServer />
        {children}
      </body>
    </html>
  );
}
