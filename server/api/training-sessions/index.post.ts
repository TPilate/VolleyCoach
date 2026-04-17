import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import { validateTrainingSession } from '../../utils/validation'
import type { TrainingSession, ApiResponse } from '../../../types/models'

/**
 * POST /api/training-sessions - Create a new training session
 */
export default defineEventHandler(async (event): Promise<ApiResponse<TrainingSession>> => {
  try {
    const body = await readBody(event)

    // Validate input
    const validation = validateTrainingSession(body)
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
      .insert([
        {
          team_id: body.team_id,
          coach_id: body.coach_id,
          name: body.name,
          description: body.description,
          scheduled_at: body.scheduled_at,
          duration_minutes: body.duration_minutes,
          location: body.location,
          focus_areas: body.focus_areas,
          notes: body.notes,
        },
      ])
      .select()
      .single()

    if (error) throw handleDatabaseError(error)

    setResponseStatus(event, 201)
    return {
      success: true,
      data,
      message: 'Training session created successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Validation')) {
      throw error
    }
    console.error('Failed to create training session:', error)
    throw createError({
      status: 500,
      message: 'Failed to create training session',
    })
  }
})
