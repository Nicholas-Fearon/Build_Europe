import { createHmac, timingSafeEqual, randomBytes, scryptSync } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
export const COOKIE_NAME = 'build_europe_admin';
export const SESSION_SECONDS = 8 * 60 * 60;
export function passwordMatches(candidate, password) {
  if (typeof candidate !== 'string' || candidate.length > 256) return false;
  return timingSafeEqual(scryptSync(candidate, 'build-europe-admin-v1', 32), scryptSync(password, 'build-europe-admin-v1', 32));
}
export function createSession(secret, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ expires: now + SESSION_SECONDS * 1000, nonce: randomBytes(16).toString('hex') })).toString('base64url');
  return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`;
}
export function validSession(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 1000) return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  const expected = createHmac('sha256', secret).update(payload).digest();
  const actual = Buffer.from(signature, 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
  try { const data = JSON.parse(Buffer.from(payload, 'base64url').toString()); return Number.isFinite(data.expires) && data.expires > now && data.expires <= now + SESSION_SECONDS * 1000; } catch { return false; }
}
let credentials;
export function getAdminCredentials() {
  if (!credentials) credentials = loadCredentials().catch(error => { credentials = undefined; throw error; });
  return credentials;
}
async function loadCredentials() {
  const directory = join(process.cwd(), 'data');
  const path = join(directory, 'admin-access.json');
  await mkdir(directory, { recursive: true });
  let config;
  try { config = JSON.parse(await readFile(path, 'utf8')); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const generated = { password: randomBytes(18).toString('base64url'), secret: randomBytes(32).toString('hex') };
    try { await writeFile(path, JSON.stringify(generated, null, 2) + '\n', { mode: 0o600, flag: 'wx' }); config = generated; }
    catch (error) { if (error.code !== 'EEXIST') throw error; config = JSON.parse(await readFile(path, 'utf8')); }
  }
  const password = process.env.ADMIN_PASSWORD || config.password;
  if (typeof password !== 'string' || password.length < 12 || typeof config.secret !== 'string' || config.secret.length < 32) throw new Error('Invalid admin credentials');
  return { password, secret: createHmac('sha256', config.secret).update(password).digest('hex') };
}
