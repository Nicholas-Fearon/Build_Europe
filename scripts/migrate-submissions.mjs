import {readFile} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
import {supabasePublicConfig} from '../lib/runtime-config.mjs';
import {validateSubmission} from '../lib/validation.mjs';
process.loadEnvFile('.env.local');
const {url}=supabasePublicConfig();
if(!process.env.SUPABASE_SECRET_KEY)throw new Error('SUPABASE_SECRET_KEY is required.');
const raw=await readFile('data/submissions.jsonl','utf8').catch(error=>{if(error.code==='ENOENT')return '';throw error;});
const records=raw.split('\n').filter(Boolean).map(line=>{const row=JSON.parse(line);const result=validateSubmission(row);if(result.error||!row.id||!row.created_at||Number.isNaN(Date.parse(row.created_at)))throw new Error('A local record is invalid. No records have been uploaded.');return {id:row.id,created_at:row.created_at,...result.value};});
const client=createClient(url,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
for(let offset=0;offset<records.length;offset+=100){const {error}=await client.from('event_submissions').upsert(records.slice(offset,offset+100),{onConflict:'id',ignoreDuplicates:true});if(error)throw new Error('Migration stopped. Fix the database configuration and rerun; existing IDs will not be duplicated.');}
console.log(`Migrated ${records.length} local submissions. Local records were preserved.`);
