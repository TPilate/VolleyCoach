import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import { validatePlayer } from '../../utils/validation'
import type { Player, ApiResponse } from '../../../types/models'

/**
 * PUT /api/players/[id] - Update a player
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Player>> => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        status: 400,
        message: 'Player ID is required',
      })
    }

    // Validate input (partial updates allowed)
    const validation = validatePlayer(body, true)
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
      .update(body)
      .eq('id', id)
      .select()
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
      message: 'Player updated successfully',
    }
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Validation') || error.message.includes('Player'))) {
      throw error
    }
    console.error('Failed to update player:', error)
    throw createError({
      status: 500,
      message: 'Failed to update player',
    })
  }
})
