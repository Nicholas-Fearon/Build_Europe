export function parseAdminQuery(params={}){
  const type=['attend','sponsor','speak'].includes(params.type)?params.type:'all';
  const q=typeof params.q==='string'?params.q.trim().slice(0,150):'';
  const raw=typeof params.page==='string'?Number(params.page):1;
  const page=Number.isSafeInteger(raw)&&raw>0?Math.min(raw,100000):1;
  return {type,q,page,pageSize:20};
}
export function localSubmissionPage(records,query){
  const counts={all:records.length,attend:0,sponsor:0,speak:0};
  for(const row of records)counts[row.type]++;
  const filtered=records.filter(row=>(query.type==='all'||row.type===query.type)&&[row.name,row.email,row.company,row.topic].join(' ').toLowerCase().includes(query.q.toLowerCase()));
  filtered.sort((a,b)=>Date.parse(b.created_at)-Date.parse(a.created_at)||a.id.localeCompare(b.id));
  const pages=Math.max(1,Math.ceil(filtered.length/query.pageSize));const page=Math.min(query.page,pages);
  return {records:filtered.slice((page-1)*query.pageSize,page*query.pageSize),counts,total:filtered.length,page,pages};
}
