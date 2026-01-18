import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Silvaniya - The Art of Eternal Shine',
    template: '%s | Silvaniya',
  },
  description:
    'Discover hallmarked 925 sterling silver jewellery at Silvaniya. Shop authentic silver rings, earrings, necklaces, bracelets and more. BIS certified, free shipping across India.',
  keywords: [
    'silver jewellery',
    '925 sterling silver',
    'hallmarked silver',
    'silver rings',
    'silver earrings',
    'silver necklaces',
    'indian jewellery',
  ],
  authors: [{ name: 'Silvaniya' }],
  creator: 'Silvaniya',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://silvaniya.com',
    siteName: 'Silvaniya',
    title: 'Silvaniya - The Art of Eternal Shine',
    description:
      'Discover hallmarked 925 sterling silver jewellery. Shop authentic silver rings, earrings, necklaces and more.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Silvaniya - Sterling Silver Jewellery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silvaniya - The Art of Eternal Shine',
    description: 'Discover hallmarked 925 sterling silver jewellery.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-cream-50 text-silver-900">
        <SmoothScrollProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px 24px',
              },
            }}
          />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
