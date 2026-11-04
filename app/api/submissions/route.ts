import {NextResponse} from 'next/server';
import {appendFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {validateSubmission} from '@/lib/validation.mjs';
import {storageMode,trustedOrigin} from '@/lib/runtime-config.mjs';
import {serviceClient} from '@/lib/supabase/server';
import {consumeLimit,readJson} from '@/lib/request-guards';
import {reportFailure} from '@/lib/diagnostics.mjs';
export const runtime='nodejs';
export async function POST(request:Request){
  let stage='ORIGIN';
  try{
    if(!trustedOrigin(request))return NextResponse.json({error:'Please submit from the Build Europe website.'},{status:403});
    let body;try{body=await readJson(request);}catch{return NextResponse.json({error:'Please send valid form details within the size limit.'},{status:400});}
    const result=validateSubmission(body);if(result.error||!result.value)return NextResponse.json({error:result.error},{status:400});
    stage='RATE_LIMIT';
    if(!await consumeLimit(request,'submission',20,600))return NextResponse.json({error:'Too many submissions. Please try again in ten minutes.'},{status:429});
    stage='STORAGE';
    const record={id:randomUUID(),created_at:new Date().toISOString(),...result.value};
    if(storageMode()==='supabase'){
      const {error}=await serviceClient().from('event_submissions').insert(record);if(error)throw new Error('Database insert failed');
    }else{
      const directory=join(process.cwd(),'data');await mkdir(directory,{recursive:true});await appendFile(join(directory,'submissions.jsonl'),JSON.stringify(record)+'\n',{mode:0o600});
    }
    return NextResponse.json({success:true,id:record.id},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch(error){const reference=reportFailure('SUBMISSION',stage,error);return NextResponse.json({error:'We could not save your details. Please try again shortly.',reference},{status:503});}
}
