/**
 * /api/submit-form  —  Server-side proxy for headless form submissions
 *
 * Flow:
 *   Browser  →  POST /api/submit-form  { form_slug, fields }
 *   This route  →  POST {WWCF_API_BASE}/submit  with X-API-Key header
 *   WebWize Connect Forms (WP)  →  CleanTalk spam check (if enabled)
 *                                →  Routes to Fluent Forms → Fluent CRM
 *
 * Why server-side: keeps the WP API key out of the browser bundle.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WWCF_API_BASE =
  process.env.WWCF_API_BASE || 'https://cms.proswppp.com/wp-json/webwize-forms/v1';
const WWCF_API_KEY = process.env.WWCF_API_KEY || '';

interface SubmitBody {
  form_slug?: string;
  fields?: Record<string, unknown>;
  sender_email?: string;
  sender_nickname?: string;
}

/** Best-effort client IP extraction from common proxy headers. */
function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip') || '';
}

export async function POST(req: NextRequest) {
  if (!WWCF_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Server is missing WWCF_API_KEY environment variable.' },
      { status: 500 }
    );
  }

  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  const form_slug = (body.form_slug || '').trim();
  const fields = body.fields ?? {};

  if (!form_slug) {
    return NextResponse.json(
      { success: false, error: 'form_slug is required.' },
      { status: 400 }
    );
  }
  if (typeof fields !== 'object' || Array.isArray(fields)) {
    return NextResponse.json(
      { success: false, error: 'fields must be an object.' },
      { status: 400 }
    );
  }

  const sender_ip = getClientIp(req);
  const user_agent = req.headers.get('user-agent') || '';

  try {
    const wpRes = await fetch(`${WWCF_API_BASE}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': WWCF_API_KEY,
      },
      body: JSON.stringify({
        form_slug,
        fields,
        sender_ip,
        user_agent,
        sender_email: body.sender_email,
        sender_nickname: body.sender_nickname,
        source_url: req.headers.get('referer') || '',
      }),
      // No cache — form submissions are write operations
      cache: 'no-store',
    });

    const data = await wpRes.json().catch(() => ({}));

    // Surface the WP status code (so 403 spam blocks, 404 missing mapping, etc. propagate cleanly)
    return NextResponse.json(data, { status: wpRes.status });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reach WebWize Forms endpoint.',
        detail: err instanceof Error ? err.message : 'unknown',
      },
      { status: 502 }
    );
  }
}
