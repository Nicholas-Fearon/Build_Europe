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
export class ConfigurationError extends Error {
  constructor(code, message) { super(message); this.name = 'ConfigurationError'; this.code = code; }
}
function setting(value) { return typeof value === 'string' ? value.trim() : ''; }
export function supabasePublicConfig(env = process.env) {
  const url = setting(env.SUPABASE_URL) || setting(env.NEXT_PUBLIC_SUPABASE_URL);
  const key = setting(env.SUPABASE_PUBLISHABLE_KEY) || setting(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || setting(env.SUPABASE_ANON_KEY) || setting(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !key) throw new ConfigurationError('SUPABASE_PUBLIC_CONFIGURATION', 'Supabase URL and publishable key must be configured.');
  let parsed;
  try { parsed = new URL(url); } catch { throw new ConfigurationError('SUPABASE_PUBLIC_CONFIGURATION', 'Supabase URL must be a valid URL.'); }
  if (!['https:', 'http:'].includes(parsed.protocol) || (env.NODE_ENV === 'production' && parsed.protocol !== 'https:')) throw new ConfigurationError('SUPABASE_PUBLIC_CONFIGURATION', 'Supabase must use HTTPS in production.');
  return { url: parsed.origin, key };
}
export function supabaseServiceKey(env = process.env) {
  const key = setting(env.SUPABASE_SECRET_KEY) || setting(env.SUPABASE_SERVICE_ROLE_KEY);
  if (!key) throw new ConfigurationError('SUPABASE_SERVER_CONFIGURATION', 'The server-only Supabase key must be configured.');
  return key;
}
export function siteOrigin(env = process.env) {
  let configured = setting(env.APP_URL);
  // Use only platform-provided environment settings, never the request Host or
  // X-Forwarded-Host headers, to choose a trusted production origin.
  if (!configured && env.VERCEL === '1') {
    const host = env.VERCEL_ENV === 'preview'
      ? setting(env.VERCEL_URL)
      : setting(env.VERCEL_PROJECT_PRODUCTION_URL) || setting(env.VERCEL_URL);
    if (host) {
      if (!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/i.test(host)) throw new ConfigurationError('SITE_ORIGIN_CONFIGURATION', 'The Vercel deployment domain is invalid.');
      configured = `https://${host}`;
    }
  }
  if (!configured) {
    if (env.NODE_ENV === 'production') throw new ConfigurationError('SITE_ORIGIN_CONFIGURATION', 'Set APP_URL or enable Vercel system environment variables.');
    return null;
  }
  let url;
  try { url = new URL(configured); } catch { throw new ConfigurationError('SITE_ORIGIN_CONFIGURATION', 'APP_URL must be a valid website URL.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || (env.NODE_ENV === 'production' && url.protocol !== 'https:')) throw new ConfigurationError('SITE_ORIGIN_CONFIGURATION', 'APP_URL must use HTTPS in production.');
  return url.origin;
}
export function trustedOrigin(request, env = process.env) {
  const expected = siteOrigin(env) || new URL(request.url).origin;
  return request.headers.get('origin') === expected;
}
export function isAdminUser(user, env = process.env) {
  return !!(user?.id && user.email_confirmed_at && user.email?.toLowerCase() === adminEmail(env) && user.app_metadata?.build_europe_admin === true);
}
