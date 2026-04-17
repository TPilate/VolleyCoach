-- VolleyCoach Database Schema - Optimized for Supabase
-- Follows Supabase Postgres Best Practices
-- Run in: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- =============================================================================
-- ENABLE REQUIRED EXTENSIONS
-- =============================================================================

-- For time-ordered UUIDs (v7) - better performance than random UUIDs
-- create extension if not exists "pg_uuidv7";

-- =============================================================================
-- FUNCTION FOR AUTOMATIC UPDATED_AT TIMESTAMPS
-- =============================================================================
-- Query Performance: schema-data-types.md - Use timestamptz for all timestamps

create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql immutable;

-- =============================================================================
-- TEAMS TABLE
-- =============================================================================

create table teams (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  description text,
  coach_id uuid not null,
  season varchar(50) not null,
  level varchar(50) not null
    check (level in ('beginner', 'intermediate', 'advanced', 'professional')),
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on table teams is 'Team management - belongs to coaches';
comment on column teams.coach_id is 'Reference to auth.users, not a foreign key to avoid dependency on auth schema';

-- Indexes for common queries (schema-foreign-key-indexes.md)
create index idx_teams_coach_id on teams(coach_id);
create index idx_teams_season on teams(season);
create index idx_teams_coach_season on teams(coach_id, season); -- Composite for common queries

-- Automatic updated_at trigger
create trigger update_teams_updated_at
  before update on teams
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- PLAYERS TABLE
-- =============================================================================

create table players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  team_id uuid not null references teams(id) on delete cascade,
  jersey_number integer not null
    check (jersey_number between 1 and 99),
  position varchar(50) not null
    check (position in ('setter', 'middle_blocker', 'outside_hitter', 'opposite', 'libero')),
  height_cm integer
    check (height_cm is null or (height_cm between 120 and 250)),
  weight_kg decimal(5,2)
    check (weight_kg is null or (weight_kg between 30 and 200)),
  dominant_hand varchar(10) not null
    check (dominant_hand in ('left', 'right')),
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  unique(team_id, jersey_number)
);

comment on table players is 'Player roster - belongs to teams';
comment on column players.user_id is 'Reference to auth.users';

-- Indexes for common queries (query-missing-indexes.md, schema-foreign-key-indexes.md)
create index idx_players_team_id on players(team_id);
create index idx_players_user_id on players(user_id);
create index idx_players_position on players(position);
create index idx_players_team_position on players(team_id, position); -- Composite for team roster by position

-- Automatic updated_at trigger
create trigger update_players_updated_at
  before update on players
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- TRAINING SESSIONS TABLE
-- =============================================================================

create table training_sessions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  coach_id uuid not null,
  name varchar(255) not null,
  description text,
  scheduled_at timestamptz not null,
  duration_minutes integer not null
    check (duration_minutes between 1 and 480),
  location varchar(255),
  focus_areas text[],
  attendance integer,
  notes text,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on table training_sessions is 'Training session records - belongs to teams';
comment on column training_sessions.coach_id is 'Reference to auth.users';

-- Indexes for common queries (query-missing-indexes.md, schema-foreign-key-indexes.md)
create index idx_training_sessions_team_id on training_sessions(team_id);
create index idx_training_sessions_coach_id on training_sessions(coach_id);
create index idx_training_sessions_scheduled_at on training_sessions(scheduled_at);
-- Composite index for common queries: "get sessions for team between dates"
create index idx_training_sessions_team_scheduled on training_sessions(team_id, scheduled_at);

-- Automatic updated_at trigger
create trigger update_training_sessions_updated_at
  before update on training_sessions
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- TRAINING EXERCISES TABLE
-- =============================================================================

create table training_exercises (
  id uuid primary key default gen_random_uuid(),
  training_session_id uuid not null
    references training_sessions(id) on delete cascade,
  name varchar(255) not null,
  description text,
  duration_minutes integer not null,
  reps integer,
  difficulty varchar(50) not null
    check (difficulty in ('easy', 'medium', 'hard')),
  equipment text[],
  "order" integer not null,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on table training_exercises is 'Exercises within training sessions';

-- Indexes for common queries (schema-foreign-key-indexes.md)
create index idx_training_exercises_session_id on training_exercises(training_session_id);

-- Automatic updated_at trigger
create trigger update_training_exercises_updated_at
  before update on training_exercises
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- MATCHES TABLE
-- =============================================================================

create table matches (
  id uuid primary key default gen_random_uuid(),
  home_team_id uuid not null references teams(id) on delete cascade,
  away_team_id uuid not null references teams(id) on delete cascade,
  scheduled_at timestamptz not null,
  location varchar(255),
  status varchar(50) not null default 'scheduled'
    check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  home_score integer
    check (home_score is null or home_score >= 0),
  away_score integer
    check (away_score is null or away_score >= 0),
  duration_minutes integer,
  notes text,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  constraint different_teams check (home_team_id != away_team_id)
);

comment on table matches is 'Match records';

-- Indexes for common queries (query-missing-indexes.md, schema-foreign-key-indexes.md)
create index idx_matches_home_team_id on matches(home_team_id);
create index idx_matches_away_team_id on matches(away_team_id);
create index idx_matches_scheduled_at on matches(scheduled_at);
create index idx_matches_status on matches(status);
-- Composite index: "Get upcoming matches for team"
create index idx_matches_team_status_scheduled on matches(home_team_id, status, scheduled_at);

-- Automatic updated_at trigger
create trigger update_matches_updated_at
  before update on matches
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- MATCH STATISTICS TABLE
-- =============================================================================

create table match_statistics (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  kills integer default 0 check (kills >= 0),
  errors integer default 0 check (errors >= 0),
  assists integer default 0 check (assists >= 0),
  digs integer default 0 check (digs >= 0),
  blocks integer default 0 check (blocks >= 0),
  service_aces integer default 0 check (service_aces >= 0),
  service_errors integer default 0 check (service_errors >= 0),
  setting_attempts integer default 0 check (setting_attempts >= 0),
  setting_errors integer default 0 check (setting_errors >= 0),
  setting_assists integer default 0 check (setting_assists >= 0),
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  unique(match_id, player_id)
);

comment on table match_statistics is 'Individual player statistics per match';

-- Indexes for common queries (schema-foreign-key-indexes.md)
create index idx_match_statistics_match_id on match_statistics(match_id);
create index idx_match_statistics_player_id on match_statistics(player_id);
create index idx_match_statistics_team_id on match_statistics(team_id);

-- Automatic updated_at trigger
create trigger update_match_statistics_updated_at
  before update on match_statistics
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- PLAYER PERFORMANCE TABLE (Aggregated stats)
-- =============================================================================

create table player_performance (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  season varchar(50) not null,
  matches_played integer default 0 check (matches_played >= 0),
  total_kills integer default 0 check (total_kills >= 0),
  total_errors integer default 0 check (total_errors >= 0),
  total_assists integer default 0 check (total_assists >= 0),
  total_digs integer default 0 check (total_digs >= 0),
  total_blocks integer default 0 check (total_blocks >= 0),
  avg_points_per_match numeric(10,2),
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  unique(player_id, season)
);

comment on table player_performance is 'Aggregated player statistics per season';

-- Indexes for common queries (query-missing-indexes.md, schema-foreign-key-indexes.md)
create index idx_player_performance_player_id on player_performance(player_id);
create index idx_player_performance_season on player_performance(season);
-- Composite index: "Get player performance for season"
create index idx_player_performance_player_season on player_performance(player_id, season);

-- Automatic updated_at trigger
create trigger update_player_performance_updated_at
  before update on player_performance
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- ATTENDANCE TABLE
-- =============================================================================

create table attendance (
  id uuid primary key default gen_random_uuid(),
  training_session_id uuid not null
    references training_sessions(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  status varchar(50) not null
    check (status in ('present', 'absent', 'excused')),
  notes text,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp,
  unique(training_session_id, player_id)
);

comment on table attendance is 'Player attendance tracking for training sessions';

-- Indexes for common queries (schema-foreign-key-indexes.md, query-composite-indexes.md)
create index idx_attendance_training_session_id on attendance(training_session_id);
create index idx_attendance_player_id on attendance(player_id);
-- Composite index: "Get attendance records for training session"
create index idx_attendance_session_status on attendance(training_session_id, status);

-- Automatic updated_at trigger
create trigger update_attendance_updated_at
  before update on attendance
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
-- CRITICAL: security-rls-basics.md

-- Enable RLS on all tables
alter table teams enable row level security;
alter table players enable row level security;
alter table training_sessions enable row level security;
alter table training_exercises enable row level security;
alter table matches enable row level security;
alter table match_statistics enable row level security;
alter table player_performance enable row level security;
alter table attendance enable row level security;

-- TEAMS: Coach can see/modify their own teams, all authenticated users can read
create policy teams_coach_policy on teams
  to authenticated
  using (coach_id = auth.uid())
  with check (coach_id = auth.uid());

-- All authenticated users can read all teams (necessary for joins, team info)
create policy teams_all_read on teams
  to authenticated
  using (true);

-- PLAYERS: Coaches can modify their team's players, all authenticated can read
create policy players_read_all on players
  to authenticated
  using (true);

create policy players_coach_write on players
  to authenticated
  with check (
    team_id in (
      select id from teams where coach_id = auth.uid()
    )
  );

-- TRAINING SESSIONS: All authenticated can read, coaches can modify their own
create policy training_sessions_read_all on training_sessions
  to authenticated
  using (true);

create policy training_sessions_coach_write on training_sessions
  to authenticated
  with check (coach_id = auth.uid());

-- TRAINING EXERCISES: All authenticated can read, policies inherited via team/session
create policy training_exercises_read_all on training_exercises
  to authenticated
  using (true);

create policy training_exercises_write on training_exercises
  to authenticated
  with check (
    training_session_id in (
      select id from training_sessions where coach_id = auth.uid()
    )
  );

-- MATCHES: Public read (matches are public info), coach can modify their team's matches
create policy matches_public_read on matches
  to authenticated
  using (true);

create policy matches_coach_modify on matches
  to authenticated
  with check (
    home_team_id in (select id from teams where coach_id = auth.uid())
    or away_team_id in (select id from teams where coach_id = auth.uid())
  );

-- MATCH STATISTICS: Public read
create policy match_statistics_public_read on match_statistics
  to authenticated
  using (true);

-- PLAYER PERFORMANCE: Public read
create policy player_performance_public_read on player_performance
  to authenticated
  using (true);

-- ATTENDANCE: All authenticated can read, coaches/players can modify their own
create policy attendance_read_all on attendance
  to authenticated
  using (true);

create policy attendance_coach_write on attendance
  to authenticated
  with check (
    training_session_id in (
      select id from training_sessions where coach_id = auth.uid()
    )
  );

create policy attendance_player_write on attendance
  to authenticated
  with check (
    player_id in (
      select id from players where user_id = auth.uid()
    )
  );

-- =============================================================================
-- MATERIALIZED VIEWS FOR COMMON QUERIES (Performance optimization)
-- =============================================================================

-- Team roster with player details
create or replace view team_roster as
select
  t.id as team_id,
  t.name as team_name,
  p.id as player_id,
  p.user_id,
  p.jersey_number,
  p.position,
  p.height_cm,
  p.weight_kg,
  p.dominant_hand,
  p.created_at,
  p.updated_at
from teams t
left join players p on p.team_id = t.id
order by t.name, p.jersey_number;

-- Upcoming matches for teams
create or replace view upcoming_matches as
select
  m.id,
  m.scheduled_at,
  ht.name as home_team,
  at.name as away_team,
  m.location,
  m.status
from matches m
join teams ht on m.home_team_id = ht.id
join teams at on m.away_team_id = at.id
where m.scheduled_at > current_timestamp
  and m.status in ('scheduled', 'in_progress')
order by m.scheduled_at;

-- =============================================================================
-- CONNECTION POOLING NOTES (conn-pooling.md)
-- =============================================================================
-- When connecting from your application:
-- 1. Use Supabase Connection Pooler: postgres://[user]:[password]@[host]:6543/[database]
-- 2. Use Transaction mode (default) for best performance with web apps
-- 3. Keep max_connections reasonable for your tier
-- 4. Monitor connections: SELECT count(*) FROM pg_stat_activity;
