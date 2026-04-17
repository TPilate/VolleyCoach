import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import { validateTeam } from '../../utils/validation'
import type { Team, ApiResponse } from '../../../types/models'

/**
 * POST /api/teams - Create a new team
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Team>> => {
  try {
    const body = await readBody(event)

    // Validate input
    const validation = validateTeam(body)
    if (!validation.valid) {
      throw createError({
        status: 400,
        message: 'Validation failed',
        data: validation.errors,
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          name: body.name,
          description: body.description,
          coach_id: body.coach_id,
          season: body.season,
          level: body.level,
        },
      ])
      .select()
      .single()

    if (error) throw handleDatabaseError(error)

    setResponseStatus(event, 201)
    return {
      success: true,
      data,
      message: 'Team created successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Validation')) {
      throw error
    }
    console.error('Failed to create team:', error)
    throw createError({
      status: 500,
      message: 'Failed to create team',
    })
  }
})
