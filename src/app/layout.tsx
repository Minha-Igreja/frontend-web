import { Poppins } from 'next/font/google';

import type { Metadata } from 'next';

import { Header } from '@/view/components/organisms/Header';

import './globals.css';
import { Providers } from './providers';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Minha Igreja',
  description:
    'Tecnologia para gerir a Casa. Autoridade para ganhar o Rebanho.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
