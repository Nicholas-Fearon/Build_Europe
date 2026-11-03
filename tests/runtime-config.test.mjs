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
