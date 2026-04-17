import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import { validatePlayer } from '../../utils/validation'
import type { Player, ApiResponse } from '../../../types/models'

/**
 * POST /api/players - Create a new player
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Player>> => {
  try {
    const body = await readBody(event)

    // Validate input
    const validation = validatePlayer(body)
    if (!validation.valid) {
      throw createError({
        status: 400,
        message: 'Validation failed',
        data: validation.errors,
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('players')
      .insert([
        {
          user_id: body.user_id,
          team_id: body.team_id,
          jersey_number: body.jersey_number,
          position: body.position,
          height_cm: body.height_cm,
          weight_kg: body.weight_kg,
          dominant_hand: body.dominant_hand,
        },
      ])
      .select()
      .single()

    if (error) throw handleDatabaseError(error)

    setResponseStatus(event, 201)
    return {
      success: true,
      data,
      message: 'Player created successfully',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Validation')) {
      throw error
    }
    console.error('Failed to create player:', error)
    throw createError({
      status: 500,
      message: 'Failed to create player',
    })
  }
})
