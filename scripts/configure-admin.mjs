import {readFile,writeFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {hashPassword} from '../lib/admin-auth.mjs';
import {adminEmail,supabasePublicConfig} from '../lib/runtime-config.mjs';
try { process.loadEnvFile('.env.local'); } catch(error) { if(error.code!=='ENOENT')throw error; }
const mode=process.argv.includes('--local')?'local':'supabase';
let client;
if(mode==='supabase'){
  const {url}=supabasePublicConfig();
  if(!process.env.SUPABASE_SECRET_KEY)throw new Error('Add SUPABASE_SECRET_KEY to .env.local before provisioning the production account.');
  client=createClient(url,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
}
async function readPassword(){
  process.stdout.write('Ready for password JSON on stdin (input hidden).\n');
  if(process.stdin.isTTY)process.stdin.setRawMode(true);
  process.stdin.resume();
  return await new Promise((resolve,reject)=>{
    let input='';
    function finish(){if(process.stdin.isTTY)process.stdin.setRawMode(false);process.stdin.off('data',onData);process.stdin.pause();}
    function onData(chunk){input+=chunk.toString();if(input.includes('\u0003')){finish();reject(new Error('Cancelled'));return;}if(input.length>2000){finish();reject(new Error('Input too large'));return;}if(input.includes('\n')){finish();try{resolve(JSON.parse(input.split('\n')[0]).password);}catch{reject(new Error('Invalid input'));}}}
    process.stdin.on('data',onData);
  });
}
const password=await readPassword();
if(typeof password!=='string'||password.length<12||password.length>256)throw new Error('Use a password between 12 and 256 characters.');
async function updateEnv(values){
  let text='';try{text=await readFile('.env.local','utf8');}catch(error){if(error.code!=='ENOENT')throw error;}
  for(const [key,value] of Object.entries(values)){
    const line=`${key}=${JSON.stringify(value)}`;const pattern=new RegExp(`^${key}=.*$`,'m');text=pattern.test(text)?text.replace(pattern,()=>line):text.trimEnd()+'\n'+line+'\n';
  }
  await writeFile('.env.local',text,{mode:0o600});
}
if(mode==='local'){
  await updateEnv({ADMIN_EMAIL:adminEmail(),ADMIN_AUTH_MODE:'local',ADMIN_PASSWORD_HASH:hashPassword(password),ADMIN_SESSION_SECRET:randomBytes(32).toString('hex')});
  console.log('Local email administrator configured. Password stored as a salted scrypt hash. Production authentication remains separate.');
}else{
  let existing=null;
  for(let page=1;!existing;page++){
    const {data,error}=await client.auth.admin.listUsers({page,perPage:1000});if(error)throw new Error('Could not inspect auth users. Check the server key.');
    existing=data.users.find(user=>user.email?.toLowerCase()===adminEmail());if(data.users.length<1000)break;
  }
  const attributes={password,email_confirm:true,app_metadata:{...existing?.app_metadata,build_europe_admin:true}};
  const response=existing?await client.auth.admin.updateUserById(existing.id,attributes):await client.auth.admin.createUser({email:adminEmail(),...attributes});
  if(response.error)throw new Error('Could not provision the admin account. Check Supabase authentication settings.');
  await updateEnv({ADMIN_AUTH_MODE:'supabase',SUBMISSION_STORAGE:'supabase'});
  console.log('Supabase administrator configured for '+adminEmail()+'. Password was not saved to disk. Restart the app to use Supabase.');
}
