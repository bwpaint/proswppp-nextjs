import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import SiteWideCTA from '@/components/SiteWideCTA';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Pro SWPPP — America's #1 Storm Water Pollution Prevention Plan",
  description:
    "Get your SWPPP in 72 hours or it's FREE. Fast, affordable, and 100% compliant SWPPP solutions nationwide.",
  openGraph: {
    siteName: 'Pro SWPPP',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navigation />
        {children}
        <SiteWideCTA />
        <Footer />
      </body>
    </html>
  );
}
