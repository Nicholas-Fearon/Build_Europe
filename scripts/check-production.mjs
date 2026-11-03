import {createClient} from '@supabase/supabase-js';
import {adminEmail,siteOrigin,storageMode,supabasePublicConfig,isAdminUser} from '../lib/runtime-config.mjs';
try{process.loadEnvFile('.env.local');}catch(error){if(error.code!=='ENOENT')throw error;}
const env={...process.env,NODE_ENV:'production'};
const origin=siteOrigin(env);storageMode(env);const {url}=supabasePublicConfig(env);
if(!env.SUPABASE_SECRET_KEY)throw new Error('SUPABASE_SECRET_KEY is missing.');
const client=createClient(url,env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const {error}=await client.rpc('admin_submissions_page',{p_type:'all',p_search:'',p_page:1,p_page_size:1});
if(error)throw new Error('Production schema or database access is not ready. Apply schema.sql and production.sql.');
let admin;
for(let page=1;!admin;page++){const {data,error}=await client.auth.admin.listUsers({page,perPage:1000});if(error)throw new Error('Cannot verify admin provisioning.');admin=data.users.find(user=>user.email?.toLowerCase()===adminEmail(env));if(data.users.length<1000)break;}
if(!isAdminUser(admin,env))throw new Error('The verified administrator account has not been provisioned.');
console.log('Production configuration, database RPC, and administrator verified for '+origin+'.');
