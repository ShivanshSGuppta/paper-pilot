import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const uiFont = Manrope({
  subsets: ["latin"],
  variable: "--font-ui"
});

const paperFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-paper"
});

export const metadata: Metadata = {
  title: "Paper Pilot - AI Assessment Creator",
  description: "Recruiter-grade AI assessment creator for teachers"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${uiFont.variable} ${paperFont.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
