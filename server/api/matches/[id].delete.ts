import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { ApiResponse } from '../../../types/models'

/**
 * DELETE /api/matches/[id] - Delete a match
 */
export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        status: 400,
        message: 'Match ID is required',
      })
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id)

    if (error) throw handleDatabaseError(error)

    setResponseStatus(event, 204)
    return {
      success: true,
      data: null,
      message: 'Match deleted successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Match')) {
      throw error
    }
    console.error('Failed to delete match:', error)
    throw createError({
      status: 500,
      message: 'Failed to delete match',
    })
  }
})
