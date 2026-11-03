import { cookies, headers } from 'next/headers';
import { COOKIE_NAME, getAdminCredentials, validSession } from './admin-auth.mjs';
export async function isAdmin() {
  const host = (await headers()).get('host') || '';
  // The MVP admin is intentionally restricted to loopback access.
  if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)) return false;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  return validSession(token, (await getAdminCredentials()).secret);
}
