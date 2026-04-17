import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { Team, ApiResponse } from '../../../types/models'

/**
 * GET /api/teams/[id] - Get a single team by ID
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Team>> => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        status: 400,
        message: 'Team ID is required',
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
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
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Team')) {
      throw error
    }
    console.error('Failed to fetch team:', error)
    throw createError({
      status: 500,
      message: 'Failed to fetch team',
    })
  }
})
