import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Ledger — Finance Management',
  description: 'Premium personal finance management',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} h-full antialiased`}
      style={{ fontFamily: 'var(--font-inter), sans-serif', colorScheme: 'light' }}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
