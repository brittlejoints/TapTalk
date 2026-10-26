-- Tap Talk: optional anonymous weekly usage counts ("Help improve Tap Talk").
-- One row = one opted-in device's counts for one finished week. There is no
-- device or person identifier, no free text beyond a short marketing tag, and no
-- IP address. Only the service role (the edge functions) can read or write.

create table if not exists public.insights_reports (
  id bigint generated always as identity primary key,
  received_at timestamptz not null default now(),
  week date not null,
  app_version text not null check (app_version ~ '^[0-9a-z.-]{1,16}$'),
  language text not null check (language ~ '^[a-z]{2}-[A-Z]{2}$'),
  text_size text not null check (text_size in ('medium', 'large', 'x-large')),
  screen text not null check (screen in ('phone', 'tablet', 'desktop')),
  installed boolean not null,
  weeks_since_first_use smallint not null check (weeks_since_first_use between 0 and 520),
  ref text check (ref is null or ref ~ '^[a-z0-9-]{1,32}$'),
  custom_tiles text not null check (custom_tiles in ('0', '1-5', '6-20', '21+')),
  has_contacts boolean not null,
  playful boolean not null,
  speak_on_tap boolean not null,
  high_visibility boolean not null,
  sessions integer not null check (sessions between 0 and 100000),
  tiles_tapped integer not null check (tiles_tapped between 0 and 100000),
  messages_spoken integer not null check (messages_spoken between 0 and 100000),
  typed_messages integer not null check (typed_messages between 0 and 100000),
  phrases_saved integer not null check (phrases_saved between 0 and 100000),
  help_opened integer not null check (help_opened between 0 and 100000),
  help_phrases_spoken integer not null check (help_phrases_spoken between 0 and 100000),
  alerts_started integer not null check (alerts_started between 0 and 100000),
  custom_tiles_added integer not null check (custom_tiles_added between 0 and 100000)
);

create index if not exists insights_reports_week on public.insights_reports (week);

alter table public.insights_reports enable row level security;
-- No policies: the anon and authenticated roles can neither read nor write.
revoke all on public.insights_reports from anon, authenticated;

-- One row per week: how many opted-in devices reported, and totals.
create or replace view public.insights_weekly with (security_invoker = true) as
select
  week,
  count(*)::int as devices,
  count(*) filter (where weeks_since_first_use = 0)::int as new_devices,
  count(*) filter (where installed)::int as installed,
  count(*) filter (where help_opened > 0)::int as used_help,
  count(*) filter (where alerts_started > 0)::int as used_alert,
  count(*) filter (where custom_tiles <> '0')::int as has_custom_tiles,
  count(*) filter (where phrases_saved > 0)::int as used_save,
  count(*) filter (where typed_messages > 0)::int as used_typing,
  coalesce(sum(sessions), 0)::int as sessions,
  coalesce(sum(tiles_tapped), 0)::int as tiles_tapped,
  coalesce(sum(messages_spoken), 0)::int as messages_spoken,
  coalesce(sum(typed_messages), 0)::int as typed_messages,
  coalesce(sum(phrases_saved), 0)::int as phrases_saved,
  coalesce(sum(help_opened), 0)::int as help_opened,
  coalesce(sum(help_phrases_spoken), 0)::int as help_phrases_spoken,
  coalesce(sum(alerts_started), 0)::int as alerts_started,
  coalesce(sum(custom_tiles_added), 0)::int as custom_tiles_added
from public.insights_reports
group by week;

-- Devices per week broken down by one dimension at a time.
create or replace view public.insights_dimensions with (security_invoker = true) as
select week, 'language' as dimension, language as key, count(*)::int as devices from public.insights_reports group by week, language
union all
select week, 'screen', screen, count(*)::int from public.insights_reports group by week, screen
union all
select week, 'text_size', text_size, count(*)::int from public.insights_reports group by week, text_size
union all
select week, 'installed', case when installed then 'home screen' else 'browser' end, count(*)::int from public.insights_reports group by week, installed
union all
select week, 'custom_tiles', custom_tiles, count(*)::int from public.insights_reports group by week, custom_tiles
union all
select week, 'tenure',
  case when weeks_since_first_use = 0 then 'first week'
       when weeks_since_first_use < 4 then '1-3 weeks'
       when weeks_since_first_use < 13 then '1-3 months'
       else '3+ months' end,
  count(*)::int from public.insights_reports group by 1, 2, 3
union all
select week, 'ref_new', coalesce(ref, '(no tag)'), count(*)::int from public.insights_reports where weeks_since_first_use = 0 group by week, ref;

revoke all on public.insights_weekly, public.insights_dimensions from anon, authenticated;
