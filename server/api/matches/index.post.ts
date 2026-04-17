import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import { validateMatch } from '../../utils/validation'
import type { Match, ApiResponse } from '../../../types/models'

/**
 * POST /api/matches - Create a new match
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Match>> => {
  try {
    const body = await readBody(event)

    // Validate input
    const validation = validateMatch(body)
    if (!validation.valid) {
      throw createError({
        status: 400,
        message: 'Validation failed',
        data: validation.errors,
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('matches')
      .insert([
        {
          home_team_id: body.home_team_id,
          away_team_id: body.away_team_id,
          scheduled_at: body.scheduled_at,
          location: body.location,
          status: body.status || 'scheduled',
          notes: body.notes,
        },
      ])
      .select()
      .single()

    if (error) throw handleDatabaseError(error)

    setResponseStatus(event, 201)
    return {
      success: true,
      data,
      message: 'Match created successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Validation')) {
      throw error
    }
    console.error('Failed to create match:', error)
    throw createError({
      status: 500,
      message: 'Failed to create match',
    })
  }
})
