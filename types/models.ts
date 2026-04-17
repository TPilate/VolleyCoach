// Core Domain Models for VolleyCoach

/**
 * User Profile - Coaches, Players, Admins
 */
export interface User {
  id: string
  email: string
  name: string
  role: 'coach' | 'player' | 'admin'
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

/**
 * Team - Volleyball team with players and coaches
 */
export interface Team {
  id: string
  name: string
  description?: string
  coach_id: string
  season: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  created_at: string
  updated_at: string
}

/**
 * Player - Team member with statistics
 */
export interface Player {
  id: string
  user_id: string
  team_id: string
  jersey_number: number
  position: 'setter' | 'middle_blocker' | 'outside_hitter' | 'opposite' | 'libero'
  height_cm?: number
  weight_kg?: number
  dominant_hand: 'left' | 'right'
  created_at: string
  updated_at: string
}

/**
 * Training Session - Practice or workout
 */
export interface TrainingSession {
  id: string
  team_id: string
  coach_id: string
  name: string
  description?: string
  scheduled_at: string
  duration_minutes: number
  location?: string
  focus_areas: string[] // e.g., ['passing', 'setting', 'blocking']
  attendance?: number
  notes?: string
  created_at: string
  updated_at: string
}

/**
 * Training Exercise - Individual exercise in a session
 */
export interface TrainingExercise {
  id: string
  training_session_id: string
  name: string
  description?: string
  duration_minutes: number
  reps?: number
  difficulty: 'easy' | 'medium' | 'hard'
  equipment?: string[]
  order: number
  created_at: string
  updated_at: string
}

/**
 * Match - Game between teams
 */
export interface Match {
  id: string
  home_team_id: string
  away_team_id: string
  scheduled_at: string
  location?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  home_score?: number
  away_score?: number
  duration_minutes?: number
  notes?: string
  created_at: string
  updated_at: string
}

/**
 * Match Statistics - Performance data per player
 */
export interface MatchStatistic {
  id: string
  match_id: string
  player_id: string
  team_id: string
  kills: number
  errors: number
  assists: number
  digs: number
  blocks: number
  service_aces: number
  service_errors: number
  setting_attempts: number
  setting_errors: number
  setting_assists: number
  created_at: string
  updated_at: string
}

/**
 * Player Performance - Aggregated stats
 */
export interface PlayerPerformance {
  id: string
  player_id: string
  team_id: string
  season: string
  matches_played: number
  total_kills: number
  total_errors: number
  total_assists: number
  total_digs: number
  total_blocks: number
  avg_points_per_match: number
  created_at: string
  updated_at: string
}

/**
 * Attendance - Track player presence in sessions
 */
export interface Attendance {
  id: string
  training_session_id: string
  player_id: string
  status: 'present' | 'absent' | 'excused'
  notes?: string
  created_at: string
  updated_at: string
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: Record<string, any>
}

export interface ApiError {
  status: number
  message: string
  data?: Record<string, any>
}
