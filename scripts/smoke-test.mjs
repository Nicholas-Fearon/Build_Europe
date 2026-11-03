// Live verification against the running preview and its configured Supabase project.
// Creates only labelled test records and removes those exact generated IDs in finally.
import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
import {adminEmail,supabasePublicConfig} from '../lib/runtime-config.mjs';
process.loadEnvFile('.env.local');
const origin=new URL(process.env.APP_URL||'http://localhost:3000').origin;
const {url,key}=supabasePublicConfig();
if(!process.env.SUPABASE_SECRET_KEY)throw new Error('Server secret key is required.');
const service=createClient(url,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const jar=new Map();
async function request(path,method='GET',body,sendCookies=true){
  const response=await fetch(origin+path,{method,headers:{origin,...(body?{'Content-Type':'application/json'}:{}),...(sendCookies?{Cookie:[...jar].map(([k,v])=>`${k}=${v}`).join('; ')}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'manual'});
  if(sendCookies)for(const cookie of response.headers.getSetCookie()){
    const [pair]=cookie.split(';');const index=pair.indexOf('=');const name=pair.slice(0,index),value=pair.slice(index+1);
    if(/max-age=0/i.test(cookie)||!value)jar.delete(name);else jar.set(name,value);
  }
  return response;
}
process.stdout.write('Ready for password JSON on stdin (input hidden).\n');
if(process.stdin.isTTY)process.stdin.setRawMode(true);
process.stdin.resume();
const password=await new Promise((resolve,reject)=>{let raw='';function handler(chunk){raw+=chunk.toString();if(raw.includes('\n')){if(process.stdin.isTTY)process.stdin.setRawMode(false);process.stdin.off('data',handler);process.stdin.pause();try{resolve(JSON.parse(raw.split('\n')[0]).password);}catch{reject(new Error('Invalid input'));}}}process.stdin.on('data',handler);});
const ids=[];
try{
  const anon=await request('/admin','GET',undefined,false);assert.ok((await anon.text()).includes('Admin sign-in'));
  const wrong=await request('/api/admin/session','POST',{email:'not-admin@example.invalid',password});assert.equal(wrong.status,401);
  const login=await request('/api/admin/session','POST',{email:adminEmail(),password});assert.equal(login.status,200,'Assigned admin must be able to sign in.');
  const run=Date.now().toString();
  for(const type of ['attend','sponsor','speak']){
    const response=await request('/api/submissions','POST',{type,name:'Production smoke test '+run,email:`smoke-${run}@example.invalid`,company:'Automated test',topic:'Test submission',message:'Temporary test record; removed after verification.',consent:true});
    const result=await response.json();assert.equal(response.status,201,'Each public form must persist successfully.');ids.push(result.id);
  }
  for(const type of ['all','attend','sponsor','speak']){
    const response=await request(`/admin?type=${type}&q=${run}`);const html=await response.text();assert.equal(response.status,200);assert.ok(html.includes('Production smoke test '+run),'Saved records must appear in the matching category.');
  }
  const {data,error}=await service.rpc('admin_submissions_page',{p_type:'all',p_search:run,p_page:1,p_page_size:20});assert.equal(error,null);assert.equal(data.total,3);
  const publicClient=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const denied=await publicClient.from('event_submissions').select('id').limit(1);assert.ok(denied.error,'Anonymous table reads must be denied.');
  const logout=await request('/api/admin/session','DELETE');assert.equal(logout.status,200);
  const signedOut=await request('/admin');assert.ok((await signedOut.text()).includes('Admin sign-in'));
  console.log('Live checks passed: sign-in, unauthorised access rejection, all three forms, all category views, anonymous database access denial, and sign-out.');
}finally{
  if(ids.length){const {error}=await service.from('event_submissions').delete().in('id',ids);if(error)throw new Error('Could not remove labelled smoke-test records. Remove only records named Production smoke test from this run.');console.log('Removed '+ids.length+' temporary test records; all other records preserved.');}
}
