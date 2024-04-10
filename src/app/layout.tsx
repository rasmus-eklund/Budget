import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Header from "./_components/header/Header";
import { env } from "~/env";
import PasswordProvider from "./_components/PasswordContext";
import SessionWrapper from "./SessionWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: env.NODE_ENV === "development" ? "DEV:RICA Banken" : "RICA Banken",
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
      <body
        className={`font-sans ${inter.variable} flex flex-col items-center`}
      >
        <Header />
        <SessionWrapper>
          <main className="flex h-[calc(100vh-56px)] w-full max-w-5xl flex-col gap-4">
            <PasswordProvider>{children}</PasswordProvider>
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}
