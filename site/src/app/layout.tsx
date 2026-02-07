import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import AuthButton from "./components/AuthButton";
import { AuthProvider } from "@/lib/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Activity Plan 2026",
  description: "Roadmap Runner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <header className="bg-emerald-700 text-white py-6">
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Activity Plan 2026</h1>
                <p className="mt-1 text-emerald-100">Roadmap Runner</p>
              </div>
              <AuthButton />
            </div>
          </header>
          <Navbar />
          {children}
          <footer className="bg-gray-800 text-gray-400 py-4 text-center">
            <p className="flex flex-wrap justify-center gap-x-4">
              <span>
                Fonti:{" "}
                <a
                  href="https://www.calendariopodismo.it/regione/toscana"
                  className="text-emerald-400 hover:underline"
                >
                  Calendario Podismo Toscana
                </a>
              </span>
              <span>
                <a
                  href="https://usnave.it/gare.aspx"
                  className="text-purple-400 hover:underline"
                >
                  US Nave ASD
                </a>
              </span>
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
