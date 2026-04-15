import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ContactClient = dynamic(() => import('./ContactClient'), { ssr: false });

export const metadata: Metadata = {
  title: 'Contact Us | Pro SWPPP',
  description:
    'Get in touch with Pro SWPPP. Call 833-GET-SWPP or send us a message — our team is ready to help with your stormwater compliance needs.',
  openGraph: {
    title: 'Contact Us | Pro SWPPP',
    description: 'Reach Pro SWPPP by phone or online. Fast response, expert help with SWPPP plans and stormwater compliance.',
  },
};

export default function ContactUsPage() {
  return (
    <main>
      <ContactClient />
    </main>
  );
}
