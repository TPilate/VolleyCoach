import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import { validateTrainingSession } from '../../utils/validation'
import type { TrainingSession, ApiResponse } from '../../../types/models'

/**
 * PUT /api/training-sessions/[id] - Update a training session
 */
export default defineEventHandler(async (event): Promise<ApiResponse<TrainingSession>> => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        status: 400,
        message: 'Training session ID is required',
      })
    }

    // Validate input (partial updates allowed)
    const validation = validateTrainingSession(body, true)
    if (!validation.valid) {
      throw createError({
        status: 400,
        message: 'Validation failed',
        data: validation.errors,
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('training_sessions')
      .update(body)
      .eq('id', id)
      .select()
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
      message: 'Training session updated successfully',
    }
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Validation') || error.message.includes('Training'))) {
      throw error
    }
    console.error('Failed to update training session:', error)
    throw createError({
      status: 500,
      message: 'Failed to update training session',
    })
  }
})
