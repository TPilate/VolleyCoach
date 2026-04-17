import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { ApiResponse } from '../../../types/models'

/**
 * DELETE /api/players/[id] - Delete a player
 */
export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        status: 400,
        message: 'Player ID is required',
      })
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id)

    if (error) throw handleDatabaseError(error)

    setResponseStatus(event, 204)
    return {
      success: true,
      data: null,
      message: 'Player deleted successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Player')) {
      throw error
    }
    console.error('Failed to delete player:', error)
    throw createError({
      status: 500,
      message: 'Failed to delete player',
    })
  }
})
