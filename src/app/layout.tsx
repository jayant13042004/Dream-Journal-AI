import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dream Journal AI — Understand Your Dreams & Discover Patterns',
  description:
    'Record your dreams, explore possible meanings, and discover recurring patterns across your dream journal with AI.',
  keywords: ['dream journal', 'dream analysis', 'AI dreams', 'dream patterns', 'dream interpretation'],
  openGraph: {
    title: 'Dream Journal AI — Understand Your Dreams & Discover Patterns',
    description:
      'Record your dreams, explore possible meanings, and discover recurring patterns across your dream journal with AI.',
    type: 'website',
    siteName: 'Dream Journal AI',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
