import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { ApiResponse } from '../../../types/models'

/**
 * DELETE /api/training-sessions/[id] - Delete a training session
 */
export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        status: 400,
        message: 'Training session ID is required',
      })
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('training_sessions')
      .delete()
      .eq('id', id)

    if (error) throw handleDatabaseError(error)

    setResponseStatus(event, 204)
    return {
      success: true,
      data: null,
      message: 'Training session deleted successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Training')) {
      throw error
    }
    console.error('Failed to delete training session:', error)
    throw createError({
      status: 500,
      message: 'Failed to delete training session',
    })
  }
})
