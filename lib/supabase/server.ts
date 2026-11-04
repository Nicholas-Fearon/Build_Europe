import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabasePublicConfig, supabaseServiceKey } from '../runtime-config.mjs';
export async function authClient() {
  const config = supabasePublicConfig(); const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: { name: 'build-europe-auth', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' },
    cookies: { getAll: () => jar.getAll(), setAll: values => {
      try { values.forEach(({name,value,options}) => jar.set(name,value,options)); }
      catch { /* Server Components cannot set cookies. Proxy handles refresh. */ }
    } },
  });
}
export function serviceClient() {
  const { url } = supabasePublicConfig(); const key = supabaseServiceKey();
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store',signal:AbortSignal.timeout(15000)})}});
}
