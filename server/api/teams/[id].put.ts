import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import { validateTeam } from '../../utils/validation'
import type { Team, ApiResponse } from '../../../types/models'

/**
 * PUT /api/teams/[id] - Update a team
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Team>> => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        status: 400,
        message: 'Team ID is required',
      })
    }

    // Validate input (partial updates allowed)
    const validation = validateTeam(body, true)
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
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          status: 404,
          message: 'Team not found',
        })
      }
      throw handleDatabaseError(error)
    }

    return {
      success: true,
      data,
      message: 'Team updated successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Validation') || error instanceof Error && error.message.includes('Team')) {
      throw error
    }
    console.error('Failed to update team:', error)
    throw createError({
      status: 500,
      message: 'Failed to update team',
    })
  }
})
