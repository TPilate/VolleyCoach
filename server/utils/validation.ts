import type { Team, Player, TrainingSession, Match } from '~/types/models'

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string[]>
}

/**
 * Validate Team input
 */
export const validateTeam = (data: any, partial = false): ValidationResult => {
  const errors: Record<string, string[]> = {}

  if (!partial) {
    if (!data.name?.trim()) {
      errors.name = ['Team name is required']
    } else if (data.name.length < 2) {
      errors.name = ['Team name must be at least 2 characters']
    }

    if (!data.coach_id?.trim()) {
      errors.coach_id = ['Coach ID is required']
    }

    if (!data.season?.trim()) {
      errors.season = ['Season is required']
    }

    if (!data.level || !['beginner', 'intermediate', 'advanced', 'professional'].includes(data.level)) {
      errors.level = ['Valid level is required']
    }
  }

  if (data.name && data.name.length > 255) {
    errors.name = ['Team name must be less than 255 characters']
  }

  if (data.description && data.description.length > 1000) {
    errors.description = ['Description must be less than 1000 characters']
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate Player input
 */
export const validatePlayer = (data: any, partial = false): ValidationResult => {
  const errors: Record<string, string[]> = {}

  if (!partial) {
    if (!data.user_id?.trim()) {
      errors.user_id = ['User ID is required']
    }

    if (!data.team_id?.trim()) {
      errors.team_id = ['Team ID is required']
    }

    if (data.jersey_number === undefined || data.jersey_number === null) {
      errors.jersey_number = ['Jersey number is required']
    } else if (data.jersey_number < 1 || data.jersey_number > 99) {
      errors.jersey_number = ['Jersey number must be between 1 and 99']
    }

    if (!data.position || !['setter', 'middle_blocker', 'outside_hitter', 'opposite', 'libero'].includes(data.position)) {
      errors.position = ['Valid position is required']
    }

    if (!data.dominant_hand || !['left', 'right'].includes(data.dominant_hand)) {
      errors.dominant_hand = ['Dominant hand must be left or right']
    }
  }

  if (data.height_cm && (data.height_cm < 120 || data.height_cm > 250)) {
    errors.height_cm = ['Height must be between 120 and 250 cm']
  }

  if (data.weight_kg && (data.weight_kg < 30 || data.weight_kg > 200)) {
    errors.weight_kg = ['Weight must be between 30 and 200 kg']
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate Training Session input
 */
export const validateTrainingSession = (data: any, partial = false): ValidationResult => {
  const errors: Record<string, string[]> = {}

  if (!partial) {
    if (!data.team_id?.trim()) {
      errors.team_id = ['Team ID is required']
    }

    if (!data.coach_id?.trim()) {
      errors.coach_id = ['Coach ID is required']
    }

    if (!data.name?.trim()) {
      errors.name = ['Session name is required']
    }

    if (!data.scheduled_at) {
      errors.scheduled_at = ['Scheduled date/time is required']
    }

    if (data.duration_minutes === undefined || data.duration_minutes === null) {
      errors.duration_minutes = ['Duration is required']
    } else if (data.duration_minutes < 1 || data.duration_minutes > 480) {
      errors.duration_minutes = ['Duration must be between 1 and 480 minutes']
    }
  }

  if (data.focus_areas && !Array.isArray(data.focus_areas)) {
    errors.focus_areas = ['Focus areas must be an array']
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate Match input
 */
export const validateMatch = (data: any, partial = false): ValidationResult => {
  const errors: Record<string, string[]> = {}

  if (!partial) {
    if (!data.home_team_id?.trim()) {
      errors.home_team_id = ['Home team ID is required']
    }

    if (!data.away_team_id?.trim()) {
      errors.away_team_id = ['Away team ID is required']
    }

    if (data.home_team_id === data.away_team_id) {
      errors.away_team_id = ['Teams must be different']
    }

    if (!data.scheduled_at) {
      errors.scheduled_at = ['Scheduled date/time is required']
    }
  }

  if (data.status && !['scheduled', 'in_progress', 'completed', 'cancelled'].includes(data.status)) {
    errors.status = ['Invalid match status']
  }

  if (data.home_score !== undefined && data.home_score < 0) {
    errors.home_score = ['Score cannot be negative']
  }

  if (data.away_score !== undefined && data.away_score < 0) {
    errors.away_score = ['Score cannot be negative']
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
