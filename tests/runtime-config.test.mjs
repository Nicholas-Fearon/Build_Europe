import test from 'node:test';
import assert from 'node:assert/strict';
import {authMode,storageMode,trustedOrigin,siteOrigin,isAdminUser,supabasePublicConfig} from '../lib/runtime-config.mjs';
test('production cannot silently use development auth or local storage',()=>{
  const env={NODE_ENV:'production',ADMIN_AUTH_MODE:'local',SUBMISSION_STORAGE:'local'};
  assert.equal(authMode(env),'supabase');assert.throws(()=>storageMode(env));
  assert.equal(storageMode({NODE_ENV:'production'}),'supabase');
});
test('production requires HTTPS site and Supabase configuration',()=>{
  assert.throws(()=>siteOrigin({NODE_ENV:'production'}));
  assert.throws(()=>siteOrigin({NODE_ENV:'production',APP_URL:'http://example.com'}));
  assert.throws(()=>supabasePublicConfig({NODE_ENV:'production',SUPABASE_URL:'http://example.com',SUPABASE_PUBLISHABLE_KEY:'test'}));
});
test('origin check uses configured public origin behind a reverse proxy',()=>{
  const env={NODE_ENV:'production',APP_URL:'https://event.example'};
  assert.equal(trustedOrigin(new Request('http://internal/api',{headers:{origin:'https://event.example'}}),env),true);
  assert.equal(trustedOrigin(new Request('http://internal/api',{headers:{origin:'https://other.example'}}),env),false);
  assert.equal(trustedOrigin(new Request('http://internal/api'),env),false);
});
test('admin access requires confirmed email and server-managed metadata',()=>{
  const env={ADMIN_EMAIL:'owner@example.com'};
  const user={id:'user-id',email:'owner@example.com',email_confirmed_at:'2026-11-03',app_metadata:{build_europe_admin:true}};
  assert.equal(isAdminUser(user,env),true);
  assert.equal(isAdminUser({...user,email:'stranger@example.com'},env),false);
  assert.equal(isAdminUser({...user,email_confirmed_at:null},env),false);
  assert.equal(isAdminUser({...user,app_metadata:{},user_metadata:{build_europe_admin:true}},env),false);
  assert.equal(isAdminUser(null,env),false);
});
test('Vercel production resolves its trusted canonical origin without APP_URL',()=>{
  const env={NODE_ENV:'production',VERCEL:'1',VERCEL_ENV:'production',VERCEL_PROJECT_PRODUCTION_URL:'build-europe.vercel.app',VERCEL_URL:'build-europe-random-team.vercel.app'};
  assert.equal(siteOrigin(env),'https://build-europe.vercel.app');
  assert.equal(trustedOrigin(new Request('http://internal/api',{headers:{origin:'https://build-europe.vercel.app'}}),env),true);
  assert.equal(trustedOrigin(new Request('http://internal/api',{headers:{origin:'https://attacker.invalid','x-forwarded-host':'attacker.invalid'}}),env),false);
});
test('Vercel previews use the preview origin rather than the production origin',()=>{
  const env={NODE_ENV:'production',VERCEL:'1',VERCEL_ENV:'preview',VERCEL_PROJECT_PRODUCTION_URL:'build-europe.vercel.app',VERCEL_URL:'build-europe-preview.vercel.app'};
  assert.equal(siteOrigin(env),'https://build-europe-preview.vercel.app');
  assert.equal(trustedOrigin(new Request('https://internal/api',{headers:{origin:'https://build-europe.vercel.app'}}),env),false);
});
test('explicit HTTPS origin takes precedence and invalid settings fail closed',()=>{
  const env={NODE_ENV:'production',VERCEL:'1',VERCEL_PROJECT_PRODUCTION_URL:'event.vercel.app',APP_URL:' https://custom.example/ '};
  assert.equal(siteOrigin(env),'https://custom.example');
  assert.throws(()=>siteOrigin({...env,APP_URL:'http://localhost:3000'}));
  assert.throws(()=>siteOrigin({...env,APP_URL:'',VERCEL_PROJECT_PRODUCTION_URL:'attacker.invalid/path'}));
  assert.throws(()=>siteOrigin({...env,APP_URL:'https://user:secret@example.com'}));
  assert.throws(()=>siteOrigin({NODE_ENV:'production',VERCEL_URL:'untrusted.vercel.app'}));
});
test('Vercel generated URL is supported if no canonical domain is provided',()=>{
  assert.equal(siteOrigin({NODE_ENV:'production',VERCEL:'1',VERCEL_URL:'build-europe-unique.vercel.app'}),'https://build-europe-unique.vercel.app');
});
test('Supabase public aliases are accepted with surrounding whitespace',()=>{
  assert.deepEqual(supabasePublicConfig({SUPABASE_URL:' https://project.supabase.co ',NEXT_PUBLIC_SUPABASE_ANON_KEY:' test-publishable-key '}),{url:'https://project.supabase.co',key:'test-publishable-key'});
});
