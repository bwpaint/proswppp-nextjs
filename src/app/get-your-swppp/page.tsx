import dynamic from 'next/dynamic';

/**
 * /get-your-swppp — Map-first SWPPP order flow
 *
 * Server component wrapper — dynamically imports the heavy client component
 * with ssr:false so the SVG map + interactive wizard only run in the browser.
 */

const GetYourSwpppClient = dynamic(
  () => import('./GetYourSwpppClient'),
  { ssr: false }
);

export default function GetYourSwpppPage() {
  return <GetYourSwpppClient />;
}
