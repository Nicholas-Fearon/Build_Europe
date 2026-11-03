'use client';
import {useState,type FormEvent} from 'react';
export default function AdminLogin(){
  const [error,setError]=useState('');const [pending,setPending]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setError('');setPending(true);const fields=new FormData(event.currentTarget);
    try{const response=await fetch('/api/admin/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:fields.get('email'),password:fields.get('password')})});const result=await response.json();if(!response.ok)throw new Error(result.error);window.location.assign('/admin');}
    catch(error){setError(error instanceof Error?error.message:'Could not sign in.');setPending(false);}
  }
  return <section className="section-pad admin-login"><p className="eyebrow">BUILD EUROPE / ORGANISER ACCESS</p><h1 className="page-title">Your community.<br/>In one place.</h1><p className="policy-intro">Sign in to manage attendance interest, sponsorship enquiries, and speaking proposals.</p><div className="form-card"><form onSubmit={submit}><h2>Admin sign-in</h2><label>Email address<input name="email" type="email" autoComplete="username" required maxLength={254} placeholder="Your admin email"/></label><label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={256}/></label>{error&&<p className="error" role="alert">{error}</p>}<button className="button dark form-submit" disabled={pending}>{pending?'Signing in…':'Sign in'}<span>↗</span></button><p className="form-description">Access is restricted to authorised Build Europe organisers.</p></form></div></section>;
}
