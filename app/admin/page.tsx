import type {Metadata} from 'next';
import {getAdminIdentity} from '@/lib/admin';
import {getSubmissions} from '@/lib/submissions';
import {parseAdminQuery} from '@/lib/admin-query.mjs';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
export const metadata:Metadata={title:'Admin — Build Europe',robots:{index:false,follow:false}};
export const runtime='nodejs';
export default async function AdminPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  try{
    const identity=await getAdminIdentity();
    if(!identity)return <AdminLogin/>;
    const query=parseAdminQuery(await searchParams);
    const result=await getSubmissions(query);
    return <AdminDashboard result={result} query={query} email={identity.email}/>;
  }catch{return <section className="section-pad"><h1 className="page-title">Admin is unavailable.</h1><p>We could not load the admin area. Please try again shortly.</p><a href="/admin" className="text-link">Try again ↻</a></section>;}
}
