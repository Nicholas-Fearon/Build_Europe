-- Apply AFTER schema.sql. Safe to re-run; does not remove existing submissions.
create table if not exists public.request_rate_limits (
  key text primary key,
  count integer not null,
  expires_at timestamptz not null
);
alter table public.request_rate_limits enable row level security;
revoke all on public.request_rate_limits from anon, authenticated;
grant select, insert, update, delete on public.request_rate_limits to service_role;

create or replace function public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare v_count integer;
begin
  if p_limit < 1 or p_window_seconds < 1 or char_length(p_key) <> 64 then return false; end if;
  delete from public.request_rate_limits where expires_at < now() - interval '1 hour';
  insert into public.request_rate_limits as limits(key,count,expires_at)
    values(p_key,1,now()+make_interval(secs => p_window_seconds))
  on conflict(key) do update set
    count = case when limits.expires_at <= now() then 1 else limits.count+1 end,
    expires_at = case when limits.expires_at <= now() then now()+make_interval(secs => p_window_seconds) else limits.expires_at end
  returning count into v_count;
  return v_count <= p_limit;
end $$;
revoke all on function public.consume_rate_limit(text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text,integer,integer) to service_role;

create or replace function public.admin_submissions_page(p_type text default 'all', p_search text default '', p_page integer default 1, p_page_size integer default 20)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_counts jsonb;
  v_total integer;
  v_pages integer;
  v_page integer;
  v_size integer := greatest(1,least(p_page_size,50));
  v_search text := lower(left(trim(coalesce(p_search,'')),150));
  v_records jsonb;
begin
  if p_type not in ('all','attend','sponsor','speak') then raise exception 'Invalid category'; end if;
  select jsonb_build_object('all',count(*),'attend',count(*) filter(where type='attend'),'sponsor',count(*) filter(where type='sponsor'),'speak',count(*) filter(where type='speak')) into v_counts from public.event_submissions;
  select count(*) into v_total from public.event_submissions
    where (p_type='all' or type=p_type)
    and (v_search='' or strpos(lower(name || ' ' || email || ' ' || company || ' ' || topic),v_search)>0);
  v_pages := greatest(1,ceil(v_total::numeric/v_size)::integer);
  v_page := greatest(1,least(coalesce(p_page,1),v_pages));
  select coalesce(jsonb_agg(to_jsonb(entries) order by entries.created_at desc,entries.id),'[]'::jsonb) into v_records from (
    select id,created_at,type,name,email,company,topic,message,consent from public.event_submissions
    where (p_type='all' or type=p_type)
    and (v_search='' or strpos(lower(name || ' ' || email || ' ' || company || ' ' || topic),v_search)>0)
    order by created_at desc,id limit v_size offset (v_page-1)*v_size
  ) entries;
  return jsonb_build_object('records',v_records,'counts',v_counts,'total',v_total,'page',v_page,'pages',v_pages);
end $$;
revoke all on function public.admin_submissions_page(text,text,integer,integer) from public, anon, authenticated;
grant execute on function public.admin_submissions_page(text,text,integer,integer) to service_role;
