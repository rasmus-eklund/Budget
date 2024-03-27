import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Header from "./_components/header/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "RICA Banken",
  description: "Hantera din privatekonomi",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Header />
        <main className="flex h-[calc(100vh-56px)] w-full max-w-5xl flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
