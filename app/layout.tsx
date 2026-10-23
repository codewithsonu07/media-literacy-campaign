import type { Metadata } from "next";
import { Epilogue, Geist_Mono } from "next/font/google";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import "./routes.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sift It | Read Beyond the Headline",
  description:
    "Build media literacy with a visual SIFT guide, an awareness quiz, and a transparent headline wording check.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${epilogue.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-sift-paper font-sans text-sift-ink antialiased">
        <SiteHeader />
        <main className="w-full flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
