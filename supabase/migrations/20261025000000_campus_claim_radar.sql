create table if not exists public.claim_submissions (
  id uuid primary key default gen_random_uuid(),
  claim text not null check (char_length(claim) between 10 and 500),
  source_url text,
  topic text not null check (
    topic in ('Politics', 'Health', 'Science', 'Technology', 'Community', 'Other')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'published', 'rejected', 'merged')
  ),
  merged_into uuid,
  card_title text,
  evidence_summary text,
  bias_notes text,
  sources jsonb not null default '[]'::jsonb check (jsonb_typeof(sources) = 'array'),
  sift_prompt text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  check (
    (status = 'merged' and merged_into is not null)
    or (status <> 'merged' and merged_into is null)
  ),
  check (
    status <> 'published'
    or (
      card_title is not null
      and evidence_summary is not null
      and bias_notes is not null
      and sift_prompt is not null
      and reviewed_at is not null
    )
  )
);

create index if not exists claim_submissions_publication_idx
  on public.claim_submissions (submitted_at desc)
  where status = 'published';
create index if not exists claim_submissions_pending_idx
  on public.claim_submissions (submitted_at asc)
  where status = 'pending';

alter table public.claim_submissions enable row level security;
revoke all on public.claim_submissions from anon, authenticated;
grant select on public.claim_submissions to anon, authenticated;
drop policy if exists "Public can read published claim cards"
  on public.claim_submissions;
create policy "Public can read published claim cards"
  on public.claim_submissions
  for select
  to anon, authenticated
  using (status = 'published');

create table if not exists public.api_rate_limits (
  request_key text primary key check (char_length(request_key) = 64),
  bucket_start bigint not null,
  request_count integer not null check (request_count > 0),
  updated_at timestamptz not null default now()
);

create index if not exists api_rate_limits_updated_at_idx
  on public.api_rate_limits (updated_at);

alter table public.api_rate_limits enable row level security;
revoke all on public.api_rate_limits from anon, authenticated;

create or replace function public.consume_api_rate_limit(
  p_request_key text,
  p_max_requests integer,
  p_window_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_bucket_start bigint;
  v_request_count integer;
  v_retry_after integer;
begin
  if char_length(p_request_key) <> 64
    or p_max_requests < 1
    or p_window_seconds < 1
  then
    raise exception 'Invalid rate-limit arguments';
  end if;

  v_bucket_start := floor(
    extract(epoch from clock_timestamp()) / p_window_seconds
  )::bigint;

  insert into public.api_rate_limits (
    request_key,
    bucket_start,
    request_count,
    updated_at
  )
  values (p_request_key, v_bucket_start, 1, clock_timestamp())
  on conflict (request_key) do update
  set
    request_count = case
      when public.api_rate_limits.bucket_start = excluded.bucket_start
        then public.api_rate_limits.request_count + 1
      else 1
    end,
    bucket_start = excluded.bucket_start,
    updated_at = clock_timestamp()
  returning request_count into v_request_count;

  delete from public.api_rate_limits
  where updated_at < clock_timestamp() - interval '24 hours';

  v_retry_after := p_window_seconds - mod(
    floor(extract(epoch from clock_timestamp()))::integer,
    p_window_seconds
  );

  return jsonb_build_object(
    'allowed', v_request_count <= p_max_requests,
    'retry_after_seconds', greatest(v_retry_after, 1)
  );
end;
$$;

revoke all on function public.consume_api_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, integer, integer)
  to service_role;
