// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { RippleEffectProvider } from "@/components/shared/RippleEffectProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: "Siddhant Gujrathi | Software Engineer",
  description: "Personal portfolio of Siddhant Gujrathi, a passionate Full Stack Software Developer.",
  icons: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RippleEffectProvider>
            {children}
          </RippleEffectProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
