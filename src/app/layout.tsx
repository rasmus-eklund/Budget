import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Header from "../components/header/Header";
import { env } from "~/env";
import { AuthProvider } from "../components/common/AuthProvider";
import { cn } from "~/lib/utils";
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
          className={cn("flex flex-col items-center font-sans h-dvh", inter.variable)}
        >
          <Header />
          <main className="flex grow w-full max-w-5xl flex-col gap-4">
            {children}
          </main>
        </body>
      </html>
    </AuthProvider>
  );
}
