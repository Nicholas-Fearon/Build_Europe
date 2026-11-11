-- Apply after registration-fields.sql and before deploying the updated forms.
begin;

do $$
declare
  legacy_check name;
begin
  -- The original schema let PostgreSQL name the speaker check.
  for legacy_check in
    select conname
    from pg_constraint
    where conrelid = 'public.event_submissions'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%''speak''%topic%message%'
  loop
    execute format('alter table public.event_submissions drop constraint %I', legacy_check);
  end loop;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.event_submissions'::regclass
      and conname = 'event_submissions_speak_message_required'
  ) then
    alter table public.event_submissions
      add constraint event_submissions_speak_message_required
      check (type <> 'speak' or message <> '');
  end if;
end $$;

commit;
