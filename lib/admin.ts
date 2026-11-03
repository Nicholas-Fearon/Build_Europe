import 'server-only';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import { COOKIE_NAME, getLocalCredentials, validSession } from './admin-auth.mjs';
import { adminEmail, authMode, isAdminUser } from './runtime-config.mjs';
import { authClient } from './supabase/server';
export const getAdminIdentity = cache(async (): Promise<{email:string} | null> => {
  if (authMode() === 'supabase') {
    const client = await authClient();
    const {data:{user},error} = await client.auth.getUser();
    if (error || !isAdminUser(user)) return null;
    return {email:user!.email!};
  }
  const host=(await headers()).get('host')||'';
  if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)) return null;
  const token=(await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  return validSession(token,getLocalCredentials().secret)?{email:adminEmail()}:null;
});
export async function isAdmin() { return !!(await getAdminIdentity()); }
