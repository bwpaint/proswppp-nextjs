/**
 * WebWize Proof — Image Upload Proxy
 *
 * Forwards multipart file uploads to the WordPress CMS server-to-server.
 * Must be a dedicated route (not the catch-all) so binary data is forwarded
 * as a raw stream rather than text.
 */

import { NextRequest, NextResponse } from 'next/server';

const CMS_UPLOAD_URL = 'https://cms.proswppp.com/wp-json/webwize-proof/v1/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Forward the multipart form data directly to the CMS
    const cmsFormData = new FormData();
    formData.forEach((value, key) => {
      cmsFormData.append(key, value);
    });

    const cmsResponse = await fetch(CMS_UPLOAD_URL, {
      method: 'POST',
      body: cmsFormData,
    });

    const data = await cmsResponse.json();
    return NextResponse.json(data, { status: cmsResponse.status });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Upload proxy error — could not reach CMS' },
      { status: 502 }
    );
  }
}
