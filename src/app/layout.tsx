import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import SiteWideCTA from '@/components/SiteWideCTA';
import Footer from '@/components/Footer';

// Self-host Google Fonts site-wide. Eliminates the render-blocking
// external CSS request to fonts.googleapis.com on every page +
// the FOUT-driven layout shift. Vercel inlines critical font CSS into
// the page payload at build time. No visual change vs. <link>-loaded
// version — same Inter + Roboto, same weights, just faster delivery.
const inter = Inter({
  subsets: ['latin'],
  weight: ['900'],
  display: 'swap',
  variable: '--font-inter',
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

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

  // 1. URL params win outright. A token in the URL is an explicit choice of
  //    mode, so it RESETS the other mode -- otherwise a stale review cookie
  //    would hijack a ?proof= link (and vice versa) and boot the wrong UI.
  var p         = new URLSearchParams(window.location.search);
  var urlProof  = p.get('proof')  || '';
  var urlReview = p.get('review') || '';
  var proof, review;

  if (urlProof || urlReview) {
    proof  = urlProof;
    review = urlReview;
    if (urlProof && !urlReview) { clearCookie(CKR); review = ''; }  // proof link clears review
    if (urlReview && !urlProof) { clearCookie(CKP); proof  = ''; }  // review link clears proof
  } else {
    // 2. No token in URL -- fall back to cookie, then sessionStorage
    proof  = getCookie(CKP);
    review = getCookie(CKR);
    if (!proof && !review) {
      try {
        var stored = sessionStorage.getItem(SK);
        if (stored) { var s = JSON.parse(stored); proof = s.proof || ''; review = s.review || ''; }
      } catch(e) {}
    }
  }

  if (!proof && !review) return;

  // Persist the active mode; clear the other so it can never resurface
  if (proof)  { setCookie(CKP, proof);  } else { clearCookie(CKP); }
  if (review) { setCookie(CKR, review); } else { clearCookie(CKR); }
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
    sc.src = '/proof.js?v=1.5.1';
    document.body.appendChild(sc);
  }
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
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
