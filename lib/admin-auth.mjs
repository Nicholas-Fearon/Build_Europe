// Development-only authentication. Production always uses Supabase Auth.
import { createHmac, timingSafeEqual, randomBytes, scryptSync } from 'node:crypto';
export const COOKIE_NAME = 'build_europe_admin';
export const SESSION_SECONDS = 8 * 60 * 60;
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `scrypt:${salt}:${scryptSync(password,salt,64).toString('hex')}`;
}
export function passwordMatches(candidate, stored) {
  if (typeof candidate !== 'string' || candidate.length > 256 || typeof stored !== 'string') return false;
  const [algorithm,salt,hash,extra] = stored.split(':');
  if (algorithm !== 'scrypt' || !/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{128}$/.test(hash || '') || extra) return false;
  return timingSafeEqual(scryptSync(candidate,salt,64),Buffer.from(hash,'hex'));
}
export function createSession(secret, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ expires:now+SESSION_SECONDS*1000, nonce:randomBytes(16).toString('hex') })).toString('base64url');
  return `${payload}.${createHmac('sha256',secret).update(payload).digest('base64url')}`;
}
export function validSession(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 1000) return false;
  const [payload,signature,extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  const expected = createHmac('sha256',secret).update(payload).digest();
  const actual = Buffer.from(signature,'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual,expected)) return false;
  try { const data=JSON.parse(Buffer.from(payload,'base64url').toString());return Number.isFinite(data.expires)&&data.expires>now&&data.expires<=now+SESSION_SECONDS*1000; } catch { return false; }
}
export function getLocalCredentials(env = process.env) {
  if (env.NODE_ENV === 'production') throw new Error('Local authentication is disabled in production');
  if (!env.ADMIN_PASSWORD_HASH || !env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32) throw new Error('Local administrator is not configured');
  return { hash:env.ADMIN_PASSWORD_HASH, secret:createHmac('sha256',env.ADMIN_SESSION_SECRET).update(`${env.ADMIN_EMAIL}:${env.ADMIN_PASSWORD_HASH}`).digest('hex') };
}
