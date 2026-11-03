export const DEFAULT_ADMIN_EMAIL = 'nejfearon@gmail.com';
export function adminEmail(env = process.env) { return (env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase(); }
export function authMode(env = process.env) {
  if (env.NODE_ENV === 'production') return 'supabase';
  if (env.ADMIN_AUTH_MODE === 'local') return 'local';
  return (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL) ? 'supabase' : 'local';
}
export function storageMode(env = process.env) {
  if (env.NODE_ENV === 'production') {
    if (env.SUBMISSION_STORAGE && env.SUBMISSION_STORAGE !== 'supabase') throw new Error('Production requires Supabase storage');
    return 'supabase';
  }
  return env.SUBMISSION_STORAGE || 'local';
}
export function supabasePublicConfig(env = process.env) {
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase authentication is not configured');
  const parsed = new URL(url);
  if (env.NODE_ENV === 'production' && parsed.protocol !== 'https:') throw new Error('Supabase must use HTTPS');
  return { url: parsed.origin, key };
}
export function siteOrigin(env = process.env) {
  if (!env.APP_URL) {
    if (env.NODE_ENV === 'production') throw new Error('APP_URL is required in production');
    return null;
  }
  const url = new URL(env.APP_URL);
  if (env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('APP_URL must use HTTPS');
  return url.origin;
}
export function trustedOrigin(request, env = process.env) {
  const expected = siteOrigin(env) || new URL(request.url).origin;
  return request.headers.get('origin') === expected;
}
export function isAdminUser(user, env = process.env) {
  return !!(user?.id && user.email_confirmed_at && user.email?.toLowerCase() === adminEmail(env) && user.app_metadata?.build_europe_admin === true);
}
