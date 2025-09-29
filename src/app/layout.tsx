import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { AuthProvider } from "~/components/common";
import { Header } from "~/components/server";
import { env } from "~/env";
import { cn } from "~/lib";
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
    <AuthProvider>
      <html lang="en" className="h-dvh">
        <body
          className={cn(
            "flex flex-col items-center font-sans h-dvh",
            inter.variable,
          )}
        >
          <Header />
          <main className="flex flex-1 w-full max-w-5xl flex-col gap-4">
            {children}
          </main>
        </body>
      </html>
    </AuthProvider>
  );
}
