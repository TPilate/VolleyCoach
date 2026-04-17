import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import { validateMatch } from '../../utils/validation'
import type { Match, ApiResponse } from '../../../types/models'

/**
 * PUT /api/matches/[id] - Update a match
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Match>> => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        status: 400,
        message: 'Match ID is required',
      })
    }

    // Validate input (partial updates allowed)
    const validation = validateMatch(body, true)
    if (!validation.valid) {
      throw createError({
        status: 400,
        message: 'Validation failed',
        data: validation.errors,
      })
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('matches')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          status: 404,
          message: 'Match not found',
        })
      }
      throw handleDatabaseError(error)
    }

    return {
      success: true,
      data,
      message: 'Match updated successfully',
    }
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Validation') || error.message.includes('Match'))) {
      throw error
    }
    console.error('Failed to update match:', error)
    throw createError({
      status: 500,
      message: 'Failed to update match',
    })
  }
})
