import test from 'node:test';
import assert from 'node:assert/strict';
import {parseAdminQuery,localSubmissionPage} from '../lib/admin-query.mjs';
const rows=Array.from({length:25},(_,n)=>({id:String(n).padStart(2,'0'),type:'attend',name:'Person '+n,email:`person${n}@example.com`,company:'Studio',topic:'Engineer',created_at:new Date(2026,0,n+1).toISOString()})).concat([{id:'speaker',type:'speak',name:'Speaker',email:'speak@example.com',company:'',topic:'AI',created_at:'2026-02-01'},{id:'sponsor',type:'sponsor',name:'Partner',email:'sponsor@example.com',company:'Partner Co',topic:'Partnership',created_at:'2026-02-02'}]);
test('all registrations and category totals are separate from page size',()=>{
  const result=localSubmissionPage(rows,parseAdminQuery());assert.equal(result.records.length,20);assert.equal(result.total,27);assert.equal(result.pages,2);assert.deepEqual(result.counts,{all:27,attend:25,sponsor:1,speak:1});
});
test('categories, literal search, and out-of-range pages return the right records',()=>{
  const speaker=localSubmissionPage(rows,parseAdminQuery({type:'speak',q:'AI',page:'999'}));assert.equal(speaker.total,1);assert.equal(speaker.records[0].id,'speaker');assert.equal(speaker.page,1);
  assert.equal(localSubmissionPage(rows,parseAdminQuery({q:'not found'})).records.length,0);
  assert.equal(localSubmissionPage(rows,parseAdminQuery({q:'%'})).records.length,0);
});
test('query parameters are bounded and invalid types default to all',()=>{
  assert.deepEqual(parseAdminQuery({type:'bad',page:'-2',q:['bad']}),{type:'all',q:'',page:1,pageSize:20});assert.equal(parseAdminQuery({q:'a'.repeat(1000)}).q.length,150);
});
