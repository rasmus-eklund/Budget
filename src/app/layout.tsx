import "~/styles/globals.css";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProviderWrapper } from "./SessionProviderWrapper";
import Header from "./_components/header/Header";

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
      <body className="flex w-screen flex-col items-center">
        <SessionProviderWrapper>
          <TRPCReactProvider cookies={cookies().toString()}>
            <Header />
            <main className="flex h-[calc(100vh-56px)] w-full max-w-5xl flex-col">
              {children}
            </main>
          </TRPCReactProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
