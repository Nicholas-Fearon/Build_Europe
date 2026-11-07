import 'server-only';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {isAdmin} from './admin';
import {storageMode} from './runtime-config.mjs';
import {localSubmissionPage} from './admin-query.mjs';
import {serviceClient} from './supabase/server';
export type Submission={id:string;created_at:string;type:'attend'|'sponsor'|'speak';name:string;email:string;company:string;topic:string;message:string;consent:boolean;details?:{country?:string;interests?:string[];talk_area?:string}};
export type AdminQuery={type:string;q:string;page:number;pageSize:number};
export type SubmissionPage={records:Submission[];counts:{all:number;attend:number;sponsor:number;speak:number};total:number;page:number;pages:number};
export async function getSubmissions(query:AdminQuery):Promise<SubmissionPage>{
  if(!await isAdmin())throw new Error('Unauthorised');
  if(storageMode()==='supabase'){
    const {data,error}=await serviceClient().rpc('admin_submissions_page',{p_type:query.type,p_search:query.q,p_page:query.page,p_page_size:query.pageSize});
    if(error||!data||!Array.isArray(data.records))throw Object.assign(new Error('Unable to load submissions'),{code:error?.code});
    return data as SubmissionPage;
  }
  let raw:string;
  try{raw=await readFile(join(process.cwd(),'data','submissions.jsonl'),'utf8');}
  catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')raw='';else throw error;}
  const records:Submission[]=raw.split('\n').filter(Boolean).map(line=>JSON.parse(line));
  for(const row of records)if(!row||!['attend','sponsor','speak'].includes(row.type)||typeof row.name!=='string'||typeof row.email!=='string'||Number.isNaN(Date.parse(row.created_at)))throw new Error('Invalid submission record');
  return localSubmissionPage(records,query);
}
