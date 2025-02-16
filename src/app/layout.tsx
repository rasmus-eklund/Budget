import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Header from "../components/header/Header";
import { env } from "~/env";
import PasswordProvider from "../components/password/PasswordContext";
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
      <html lang="en">
        <body
          className={cn("flex flex-col items-center font-sans", inter.variable)}
        >
          <Header />
          <PasswordProvider>
            <main className="flex h-[calc(100vh-56px)] w-full max-w-5xl flex-col gap-4">
              {children}
            </main>
          </PasswordProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
