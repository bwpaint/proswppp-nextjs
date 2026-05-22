/**
 * WebWize Proof — Proxy API Route
 *
 * Forwards all /api/proof/* requests to the WordPress CMS server-to-server,
 * avoiding CORS restrictions on cross-origin browser requests.
 *
 * Browser calls: https://www2.proswppp.com/api/proof/validate
 * Proxied to:    https://cms.proswppp.com/wp-json/webwize-proof/v1/validate
 */

import { NextRequest, NextResponse } from 'next/server';

const CMS_BASE = 'https://cms.proswppp.com/wp-json/webwize-proof/v1';

async function proxyRequest(request: NextRequest, params: { endpoint: string[] }) {
  const endpoint = params.endpoint.join('/');
  const targetUrl = `${CMS_BASE}/${endpoint}`;

  const method = request.method;
  const contentType = request.headers.get('content-type') || 'application/json';

  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': contentType,
    },
  };

  // Forward body for POST requests
  if (method === 'POST') {
    init.body = await request.text();
  }

  // Forward query params for GET requests
  const searchParams = request.nextUrl.searchParams.toString();
  const url = searchParams ? `${targetUrl}?${searchParams}` : targetUrl;

  try {
    const cmsResponse = await fetch(url, init);
    const data = await cmsResponse.json();
    return NextResponse.json(data, { status: cmsResponse.status });
  } catch {
    return NextResponse.json(
      { error: 'Proxy error — could not reach CMS' },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: { endpoint: string[] } }) {
  return proxyRequest(request, params);
}

export async function POST(request: NextRequest, { params }: { params: { endpoint: string[] } }) {
  return proxyRequest(request, params);
}
