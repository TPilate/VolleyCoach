import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { Match, ApiResponse } from '../../../types/models'

/**
 * GET /api/matches/[id] - Get a single match by ID
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Match>> => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        status: 400,
        message: 'Match ID is required',
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          status: 404,
          message: 'Match not found',
        })
      }
      throw handleDatabaseError(error)
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Match')) {
      throw error
    }
    console.error('Failed to fetch match:', error)
    throw createError({
      status: 500,
      message: 'Failed to fetch match',
    })
  }
})
