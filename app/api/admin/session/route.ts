import { NextResponse } from 'next/server';
import { COOKIE_NAME, SESSION_SECONDS, getAdminCredentials, createSession, passwordMatches } from '@/lib/admin-auth.mjs';
export const runtime = 'nodejs';
const attempts = new Map<string, { count: number; until: number }>();
function allowed(request: Request) {
  const url = new URL(request.url);
  return ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && request.headers.get('origin') === url.origin;
}
export async function POST(request: Request) {
  if (!allowed(request)) return NextResponse.json({ error: 'Admin sign-in is available from the local website only.' }, { status: 403 });
  const now = Date.now();
  const key = 'local';
  let attempt = attempts.get(key);
  if (!attempt || attempt.until <= now) { attempt = { count: 0, until: now + 15 * 60 * 1000 }; attempts.set(key, attempt); }
  if (attempt.count >= 10) return NextResponse.json({ error: 'Too many attempts. Please try again in 15 minutes.' }, { status: 429 });
  try {
    const raw = await request.text();
    if (raw.length > 1000) return NextResponse.json({ error: 'Invalid sign-in details.' }, { status: 400 });
    const { password } = JSON.parse(raw);
    const credentials = await getAdminCredentials();
    if (!passwordMatches(password, credentials.password)) { attempt.count++; return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 }); }
    attempts.delete(key);
    const response = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
    response.cookies.set(COOKIE_NAME, createSession(credentials.secret), { httpOnly: true, sameSite: 'strict', secure: new URL(request.url).protocol === 'https:', path: '/', maxAge: SESSION_SECONDS });
    return response;
  } catch { return NextResponse.json({ error: 'Sign-in is unavailable. Check your local admin configuration.' }, { status: 503 }); }
}
export async function DELETE(request: Request) {
  if (!allowed(request)) return NextResponse.json({ error: 'Invalid request.' }, { status: 403 });
  const response = NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  response.cookies.set(COOKIE_NAME, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
