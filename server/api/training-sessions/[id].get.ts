import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { TrainingSession, ApiResponse } from '../../../types/models'

/**
 * GET /api/training-sessions/[id] - Get a single training session by ID
 */
export default defineEventHandler(async (event): Promise<ApiResponse<TrainingSession>> => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        status: 400,
        message: 'Training session ID is required',
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          status: 404,
          message: 'Training session not found',
        })
      }
      throw handleDatabaseError(error)
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Training')) {
      throw error
    }
    console.error('Failed to fetch training session:', error)
    throw createError({
      status: 500,
      message: 'Failed to fetch training session',
    })
  }
})
