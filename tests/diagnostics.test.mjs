import test from 'node:test';
import assert from 'node:assert/strict';
import {reportFailure} from '../lib/diagnostics.mjs';
import {ConfigurationError,supabaseServiceKey} from '../lib/runtime-config.mjs';
test('admin failures distinguish origin, storage-key, and rate-limiter failures',()=>{
  const original=console.error;const logs=[];console.error=line=>logs.push(line);
  try{
    assert.equal(reportFailure('ADMIN','ORIGIN',new ConfigurationError('SITE_ORIGIN_CONFIGURATION','Contains secret-sensitive information')),'ADMIN_SITE_ORIGIN_CONFIGURATION');
    assert.equal(reportFailure('ADMIN','RATE_LIMIT',new ConfigurationError('SUPABASE_SERVER_CONFIGURATION','Never print the key')),'ADMIN_SUPABASE_SERVER_CONFIGURATION');
    assert.equal(reportFailure('ADMIN','RATE_LIMIT',Object.assign(new Error('private upstream error'),{code:'PGRST202'})),'ADMIN_RATE_LIMIT');
    assert.ok(logs[2].includes('PGRST202'));assert.ok(!logs.join('').includes('private upstream error'));assert.ok(!logs.join('').includes('secret-sensitive'));
  }finally{console.error=original;}
});
test('server key aliases remain server-only configuration and missing keys fail closed',()=>{
  assert.equal(supabaseServiceKey({SUPABASE_SERVICE_ROLE_KEY:' legacy-server-key '}),'legacy-server-key');
  assert.throws(()=>supabaseServiceKey({}),error=>error.code==='SUPABASE_SERVER_CONFIGURATION');
});
