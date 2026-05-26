/**
 * /home-3/ scoped layout — only job left is to hide the rotating-flash
 * announcement bar on this page. Self-hosted fonts now come from the
 * site-wide root layout, so no font setup needed here.
 */

import type { ReactNode } from 'react';

export default function HomeThreeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Hide the announcement bar on /home-3/ only. The bar is
          rendered by the shared Navigation; this scoped <style> mounts
          only when /home-3/ is active and unmounts when navigating
          elsewhere, so the live site bar continues to render. */}
      <style>{`.announcement-bar { display: none !important; }`}</style>
      {children}
    </>
  );
}
