import "~/styles/globals.css";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./_components/header/Header";

export const metadata: Metadata = {
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
      <body className="flex flex-col items-center">
        <TRPCReactProvider cookies={cookies().toString()}>
          <Header />
          <Toaster position="bottom-center" />
          <main className="flex h-[calc(100vh-56px)] w-full max-w-5xl flex-col">
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
