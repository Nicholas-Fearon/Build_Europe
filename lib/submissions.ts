import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isAdmin } from './admin';
export type Submission = { id: string; created_at: string; type: 'attend' | 'sponsor' | 'speak'; name: string; email: string; company: string; topic: string; message: string; consent: boolean };
export async function getSubmissions(): Promise<Submission[]> {
  if (!(await isAdmin())) throw new Error('Unauthorised');
  let records: Submission[];
  const storage = process.env.SUBMISSION_STORAGE || 'local';
  if (storage === 'local') {
    let raw: string;
    try { raw = await readFile(join(process.cwd(), 'data', 'submissions.jsonl'), 'utf8'); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; }
    records = raw.split('\n').filter(Boolean).map(line => JSON.parse(line));
  } else if (storage === 'supabase') {
    const url = process.env.SUPABASE_URL; const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) throw new Error('Missing storage configuration');
    records = [];
    for (let offset = 0; ; offset += 1000) {
      const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/event_submissions?select=id,created_at,type,name,email,company,topic,message,consent&order=created_at.desc,id.desc&limit=1000&offset=${offset}`, { headers: { apikey: key }, cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Unable to load submissions');
      const page = await response.json();
      if (!Array.isArray(page)) throw new Error('Invalid database response');
      records.push(...page); if (page.length < 1000) break;
    }
  } else throw new Error('Unsupported storage');
  return records.map(row => {
    if (!row || !['attend', 'sponsor', 'speak'].includes(row.type) || typeof row.id !== 'string' || typeof row.name !== 'string' || typeof row.email !== 'string' || Number.isNaN(Date.parse(row.created_at))) throw new Error('Invalid submission record');
    return { id: row.id, created_at: row.created_at, type: row.type, name: row.name, email: row.email, company: row.company || '', topic: row.topic || '', message: row.message || '', consent: row.consent === true };
  }).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}
