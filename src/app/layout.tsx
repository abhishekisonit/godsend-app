import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Provider } from "@/components/ui/provider"
import { AuthProvider } from "@/providers/AuthProvider"
import { Header, Footer } from "@/components/ui"
import { Box } from "@chakra-ui/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frontend Boilerplate - Notion-inspired Design",
  description: "A modern Next.js app with Notion-inspired design system using Chakra UI + CSS Modules",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ fontFamily: 'var(--font-family-sans)' }}>
        <Provider>
          <AuthProvider>
            <Box minH="100vh" display="flex" flexDirection="column">
              <Header />
              <Box flex="1">
                {children}
              </Box>
              <Footer />
            </Box>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
