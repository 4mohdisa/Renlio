// FONT: Roboto — set via next/font/google. DO NOT change or add other font imports.
// The CSS variable --font-roboto is used in globals.css and tailwind.config.ts.
// Changing the font requires updating layout.tsx, globals.css, and tailwind.config.ts together.

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressBarProvider } from "@/components/providers/ProgressBarProvider";
import { StoreProvider } from "@/lib/store";
import { KeyboardShortcuts } from "@/components/shared/KeyboardShortcuts";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: { default: "Renlio", template: "%s | Renlio" },
  description: "Modern property management for HMO and whole-property rentals",
  keywords: ["property management", "HMO", "rental", "tenancy", "Renlio"],
  authors: [{ name: "Renlio" }],
  openGraph: {
    title: "Renlio",
    description: "Modern property management for HMO and whole-property rentals",
    type: "website",
    siteName: "Renlio",
  },
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <ProgressBarProvider>
          <QueryProvider>
            <StoreProvider>
              <TooltipProvider>
                <AppShell>{children}</AppShell>
              </TooltipProvider>
            </StoreProvider>
          </QueryProvider>
        </ProgressBarProvider>
        <Toaster position="bottom-right" />
        <KeyboardShortcuts />
      </body>
    </html>
  );
}
