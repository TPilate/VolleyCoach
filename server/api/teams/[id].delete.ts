import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { ApiResponse } from '../../../types/models'

/**
 * DELETE /api/teams/[id] - Delete a team
 */
export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        status: 400,
        message: 'Team ID is required',
      })
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)

    if (error) throw handleDatabaseError(error)

    setResponseStatus(event, 204)
    return {
      success: true,
      data: null,
      message: 'Team deleted successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Team')) {
      throw error
    }
    console.error('Failed to delete team:', error)
    throw createError({
      status: 500,
      message: 'Failed to delete team',
    })
  }
})
