import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { COOKIE_NAME,SESSION_SECONDS,getLocalCredentials,createSession,passwordMatches } from '@/lib/admin-auth.mjs';
import { adminEmail,authMode,isAdminUser,trustedOrigin } from '@/lib/runtime-config.mjs';
import { authClient } from '@/lib/supabase/server';
import { consumeLimit,readJson } from '@/lib/request-guards';
export const runtime='nodejs';
function json(body:object,status=200){return NextResponse.json(body,{status,headers:{'Cache-Control':'private, no-store, max-age=0'}});}
export async function POST(request:Request){
  try{
    if(!trustedOrigin(request))return json({error:'Please sign in from the Build Europe website.'},403);
    const input=await readJson(request,2000).catch(()=>null);
    if(!input||typeof input.email!=='string'||typeof input.password!=='string'||input.password.length>256||input.email.length>254)return json({error:'Enter your email and password.'},400);
    if(!await consumeLimit(request,'login',10,900))return json({error:'Too many attempts. Please try again in 15 minutes.'},429);
    if(input.email.trim().toLowerCase()!==adminEmail())return json({error:'Incorrect email or password.'},401);
    if(authMode()==='supabase'){
      const client=await authClient();
      const {data,error}=await client.auth.signInWithPassword({email:input.email.trim().toLowerCase(),password:input.password});
      if(error||!isAdminUser(data.user)){
        if(data.session)await client.auth.signOut({scope:'local'});
        return json({error:'Incorrect email or password, or admin access has not been activated.'},401);
      }
      return json({success:true});
    }
    const host=(await headers()).get('host')||'';
    if(!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host))return json({error:'Development sign-in is local only.'},403);
    const credentials=getLocalCredentials();
    if(!passwordMatches(input.password,credentials.hash))return json({error:'Incorrect email or password.'},401);
    const response=json({success:true});response.cookies.set(COOKIE_NAME,createSession(credentials.secret),{httpOnly:true,sameSite:'strict',secure:false,path:'/',maxAge:SESSION_SECONDS});return response;
  }catch{return json({error:'Sign-in is temporarily unavailable. Please try again later.'},503);}
}
export async function DELETE(request:Request){
  try{
    if(!trustedOrigin(request))return json({error:'Invalid request.'},403);
    if(authMode()==='supabase'){
      const client=await authClient();
      const {error}=await client.auth.signOut({scope:'local'});
      if(error)return json({error:'Could not complete sign-out. Please try again.'},503);
    }
    (await cookies()).delete(COOKIE_NAME);
    return json({success:true});
  }catch{return json({error:'Could not complete sign-out. Please try again.'},503);}
}
