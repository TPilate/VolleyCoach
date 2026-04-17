-- VolleyCoach Database Schema
-- Run these SQL commands in your Supabase SQL Editor to create the tables
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Users table (already exists in Supabase auth schema)
-- We can create an extended profile if needed

-- Teams Table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  coach_id UUID NOT NULL,
  season VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'professional')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on coach_id and season for faster queries
CREATE INDEX idx_teams_coach_id ON teams(coach_id);
CREATE INDEX idx_teams_season ON teams(season);

-- Players Table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  jersey_number INTEGER NOT NULL CHECK (jersey_number BETWEEN 1 AND 99),
  position VARCHAR(50) NOT NULL CHECK (position IN ('setter', 'middle_blocker', 'outside_hitter', 'opposite', 'libero')),
  height_cm INTEGER CHECK (height_cm IS NULL OR (height_cm BETWEEN 120 AND 250)),
  weight_kg DECIMAL CHECK (weight_kg IS NULL OR (weight_kg BETWEEN 30 AND 200)),
  dominant_hand VARCHAR(10) NOT NULL CHECK (dominant_hand IN ('left', 'right')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, jersey_number)
);

-- Create indexes on frequently filtered columns
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_players_position ON players(position);

-- Training Sessions Table
CREATE TABLE training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 1 AND 480),
  location VARCHAR(255),
  focus_areas TEXT[],
  attendance INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for training sessions queries
CREATE INDEX idx_training_sessions_team_id ON training_sessions(team_id);
CREATE INDEX idx_training_sessions_coach_id ON training_sessions(coach_id);
CREATE INDEX idx_training_sessions_scheduled_at ON training_sessions(scheduled_at);

-- Matches Table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  home_score INTEGER CHECK (home_score IS NULL OR home_score >= 0),
  away_score INTEGER CHECK (away_score IS NULL OR away_score >= 0),
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT different_teams CHECK (home_team_id != away_team_id)
);

-- Create indexes for matches queries
CREATE INDEX idx_matches_home_team_id ON matches(home_team_id);
CREATE INDEX idx_matches_away_team_id ON matches(away_team_id);
CREATE INDEX idx_matches_scheduled_at ON matches(scheduled_at);
CREATE INDEX idx_matches_status ON matches(status);

-- Training Exercises Table
CREATE TABLE training_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  reps INTEGER,
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  equipment TEXT[],
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_training_exercises_session_id ON training_exercises(training_session_id);

-- Match Statistics Table
CREATE TABLE match_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  kills INTEGER DEFAULT 0 CHECK (kills >= 0),
  errors INTEGER DEFAULT 0 CHECK (errors >= 0),
  assists INTEGER DEFAULT 0 CHECK (assists >= 0),
  digs INTEGER DEFAULT 0 CHECK (digs >= 0),
  blocks INTEGER DEFAULT 0 CHECK (blocks >= 0),
  service_aces INTEGER DEFAULT 0 CHECK (service_aces >= 0),
  service_errors INTEGER DEFAULT 0 CHECK (service_errors >= 0),
  setting_attempts INTEGER DEFAULT 0 CHECK (setting_attempts >= 0),
  setting_errors INTEGER DEFAULT 0 CHECK (setting_errors >= 0),
  setting_assists INTEGER DEFAULT 0 CHECK (setting_assists >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(match_id, player_id)
);

CREATE INDEX idx_match_statistics_match_id ON match_statistics(match_id);
CREATE INDEX idx_match_statistics_player_id ON match_statistics(player_id);
CREATE INDEX idx_match_statistics_team_id ON match_statistics(team_id);

-- Player Performance Table (aggregated stats)
CREATE TABLE player_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  season VARCHAR(50) NOT NULL,
  matches_played INTEGER DEFAULT 0 CHECK (matches_played >= 0),
  total_kills INTEGER DEFAULT 0 CHECK (total_kills >= 0),
  total_errors INTEGER DEFAULT 0 CHECK (total_errors >= 0),
  total_assists INTEGER DEFAULT 0 CHECK (total_assists >= 0),
  total_digs INTEGER DEFAULT 0 CHECK (total_digs >= 0),
  total_blocks INTEGER DEFAULT 0 CHECK (total_blocks >= 0),
  avg_points_per_match DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(player_id, season)
);

CREATE INDEX idx_player_performance_player_id ON player_performance(player_id);
CREATE INDEX idx_player_performance_season ON player_performance(season);

-- Attendance Table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'excused')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(training_session_id, player_id)
);

CREATE INDEX idx_attendance_training_session_id ON attendance(training_session_id);
CREATE INDEX idx_attendance_player_id ON attendance(player_id);

-- Enable Row Level Security (RLS) for production
-- ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE players ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE match_statistics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE player_performance ENABLE ROW LEVEL SECURITY;

-- Uncomment and run this to create a trigger for updated_at timestamps:
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON training_sessions
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
