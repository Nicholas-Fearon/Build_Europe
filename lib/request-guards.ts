import 'server-only';
import { createHash } from 'node:crypto';
import { serviceClient } from './supabase/server';
const localLimits = new Map<string,{count:number;until:number}>();
export async function consumeLimit(request:Request,scope:'login'|'submission',limit:number,windowSeconds:number) {
  // Only trust this header behind a hosting proxy that replaces client-supplied forwarding headers.
  const ip=(request.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();
  const key=createHash('sha256').update(`${scope}:${ip}`).digest('hex');
  if (process.env.NODE_ENV === 'production') {
    const {data,error}=await serviceClient().rpc('consume_rate_limit',{p_key:key,p_limit:limit,p_window_seconds:windowSeconds});
    if(error)throw Object.assign(new Error('Rate limiting is unavailable'),{code:error.code});
    return data===true;
  }
  const now=Date.now();
  for(const [entry,value] of localLimits)if(value.until<=now)localLimits.delete(entry);
  const current=localLimits.get(key)||{count:0,until:now+windowSeconds*1000};
  current.count++;localLimits.set(key,current);
  return current.count<=limit;
}
export async function readJson(request:Request,maxBytes=16000) {
  if(Number(request.headers.get('content-length')||0)>maxBytes)throw new Error('Body too large');
  const reader=request.body?.getReader();if(!reader)throw new Error('Missing body');
  let size=0;const chunks:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new Error('Body too large');}chunks.push(value);}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
