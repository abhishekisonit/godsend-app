import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Provider } from '@/components/ui/provider';
import { AuthProvider } from '@/providers/AuthProvider';
import { Header, Footer } from '@/components/ui';
import { Box } from '@chakra-ui/react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Godsend - Connect with People Who Can Help',
  description:
    'Connect with people who can help you get what you need. Find requests from your community or create your own.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ fontFamily: 'var(--font-family-sans)' }}
        suppressHydrationWarning
      >
        <Provider>
          <AuthProvider>
            <Box minH="100vh" display="flex" flexDirection="column">
              <Header />
              <Box flex="1">{children}</Box>
              <Footer />
            </Box>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
