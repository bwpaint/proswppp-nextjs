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

// WebWize Proof — inline loader
// Priority order for token discovery: URL param → cookie → sessionStorage
// Writes both cookie (cross-tab, survives reload) and sessionStorage (fast lookup).
const wwProofScript = `(function () {
  var SK  = 'wwpsSession';
  var CKP = 'wwps_proof';
  var CKR = 'wwps_review';
  var MAX_AGE = 7 * 24 * 3600; // 7 days

  function getCookie(name) {
    var parts = document.cookie.split(';');
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim();
      if (p.indexOf(name + '=') === 0) return decodeURIComponent(p.slice(name.length + 1));
    }
    return '';
  }

  function setCookie(name, val) {
    document.cookie = name + '=' + encodeURIComponent(val) +
      '; max-age=' + MAX_AGE + '; path=/; SameSite=Lax';
  }

  function clearCookie(name) {
    document.cookie = name + '=; max-age=0; path=/; SameSite=Lax';
  }

  // 1. URL params (highest priority — refreshes the session)
  var p      = new URLSearchParams(window.location.search);
  var proof  = p.get('proof')  || '';
  var review = p.get('review') || '';

  // 2. Cookie fallback (cross-tab, survives full page reloads)
  if (!proof)  proof  = getCookie(CKP);
  if (!review) review = getCookie(CKR);

  // 3. sessionStorage fallback (same-tab soft-nav in Next.js)
  if (!proof && !review) {
    try {
      var stored = sessionStorage.getItem(SK);
      if (stored) { var s = JSON.parse(stored); proof = s.proof || ''; review = s.review || ''; }
    } catch(e) {}
  }

  if (!proof && !review) return;

  // Write both persistence layers
  if (proof)  setCookie(CKP, proof);
  if (review) setCookie(CKR, review);
  try { sessionStorage.setItem(SK, JSON.stringify({ proof: proof, review: review })); } catch(e) {}

  window.wwpsConfig = {
    ajaxUrl:     'https://www2.proswppp.com/api/proof',
    proofToken:  proof  || '',
    reviewToken: review || '',
    mode:        review ? 'review' : 'proof',
    pageUrl:     window.location.href.replace(/[?&](proof|review)=[^&]*/g, '').replace(/[?&]$/, ''),
    pageTitle:   document.title,
    nonce:       ''
  };

  // Avoid double-loading proof.js on soft navigations
  if (!document.getElementById('wwps-proof-script')) {
    var sc = document.createElement('script');
    sc.id  = 'wwps-proof-script';
    sc.src = '/proof.js?v=1.4.5';
    document.body.appendChild(sc);
  }
})();`;

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
        {/* WebWize Proof — loads only when ?proof= or ?review= query param is present */}
        <script dangerouslySetInnerHTML={{ __html: wwProofScript }} />
      </body>
    </html>
  );
}
