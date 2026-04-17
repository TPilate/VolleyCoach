import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { Player, ApiResponse } from '../../../types/models'

/**
 * GET /api/players/[id] - Get a single player by ID
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Player>> => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        status: 400,
        message: 'Player ID is required',
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          status: 404,
          message: 'Player not found',
        })
      }
      throw handleDatabaseError(error)
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Player')) {
      throw error
    }
    console.error('Failed to fetch player:', error)
    throw createError({
      status: 500,
      message: 'Failed to fetch player',
    })
  }
})
