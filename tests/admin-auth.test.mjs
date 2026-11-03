import test from 'node:test';
import assert from 'node:assert/strict';
import {createSession,validSession,passwordMatches,hashPassword,getLocalCredentials,SESSION_SECONDS} from '../lib/admin-auth.mjs';
const secret='test-only-secret';
test('development sessions expire and resist token tampering',()=>{
  const now=100000;const token=createSession(secret,now);
  assert.equal(validSession(token,secret,now),true);
  assert.equal(validSession(token,secret,now+SESSION_SECONDS*1000),false);
  for(const forged of [token+'x',token+'.extra','invalid',undefined])assert.equal(validSession(forged,secret,now),false);
  assert.equal(validSession(token,'different-secret',now),false);
});
test('passwords use independent salted hashes and reject invalid inputs',()=>{
  const password='test-only-long-password';const hash=hashPassword(password);
  assert.notEqual(hash,hashPassword(password));assert.ok(!hash.includes(password));
  assert.equal(passwordMatches(password,hash),true);
  for(const candidate of ['wrong',null,{},'a'.repeat(257)])assert.equal(passwordMatches(candidate,hash),false);
  assert.equal(passwordMatches(password,'malformed'),false);
});
test('local credentials can never authenticate production',()=>{
  assert.throws(()=>getLocalCredentials({NODE_ENV:'production',ADMIN_PASSWORD_HASH:'x',ADMIN_SESSION_SECRET:'a'.repeat(32)}));
  assert.throws(()=>getLocalCredentials({NODE_ENV:'development'}));
});
