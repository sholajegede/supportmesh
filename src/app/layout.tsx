import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from '@vercel/analytics/next'
import { AppProviders } from "@/providers/ConvexKindeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
// @ts-ignore TS2307: Cannot find module or type declarations for side-effect import of './globals.css'.
import "./globals.css";

const calSans = localFont({
  src: [
    {
      path: '../fonts/CalSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    // Add other weights if you have the font files
    // {
    //   path: '../fonts/CalSans-Regular.ttf',
    //   weight: '400',
    //   style: 'normal',
    // },
    // {
    //   path: '../fonts/CalSans-Medium.ttf',
    //   weight: '500',
    //   style: 'normal',
    // },
  ],
  variable: '--font-cal-sans',
  display: 'swap',
});

const defaultUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SupportMesh",
  description: "AI-powered support operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${calSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AppProviders>
      </body>
    </html>
  );
}