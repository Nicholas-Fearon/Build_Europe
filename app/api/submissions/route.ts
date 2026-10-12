import { NextResponse } from 'next/server';
import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { validateSubmission } from '@/lib/validation.mjs';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: 'Please submit from this website.' }, { status: 403 });
  let body;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 16000) return NextResponse.json({ error: 'Your submission is too large.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return NextResponse.json({ error: 'Please send valid form details.' }, { status: 400 }); }
  const result = validateSubmission(body);
  if (result.error || !result.value) return NextResponse.json({ error: result.error }, { status: 400 });
  const record = { id: randomUUID(), created_at: new Date().toISOString(), ...result.value };
  try {
    const storage = process.env.SUBMISSION_STORAGE || 'local';
    if (storage === 'supabase') {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SECRET_KEY;
      if (!url || !key) throw new Error('Missing Supabase configuration');
      const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/event_submissions`, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(record), signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error(`Database returned ${response.status}`);
    } else if (storage === 'local') {
      const directory = join(process.cwd(), 'data');
      await mkdir(directory, { recursive: true });
      await appendFile(join(directory, 'submissions.jsonl'), JSON.stringify(record) + '\n', { mode: 0o600 });
    } else { throw new Error('Unsupported submission storage'); }
    return NextResponse.json({ success: true, id: record.id }, { status: 201 });
  } catch {
    console.error('Submission could not be persisted. Check storage configuration and permissions.');
    return NextResponse.json({ error: 'We could not save your details. Please try again shortly.' }, { status: 503 });
  }
}
