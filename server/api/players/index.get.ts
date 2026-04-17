import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { Player, ApiResponse } from '../../../types/models'

/**
 * GET /api/players - List all players with optional team filter
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Player[]>> => {
  try {
    const { page = 1, limit = 50, team_id, position } = getQuery(event)

    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50))
    const offset = (pageNum - 1) * limitNum

    const supabase = getSupabaseClient()
    let query = supabase.from('players').select('*', { count: 'exact' })

    if (team_id) {
      query = query.eq('team_id', team_id)
    }

    if (position) {
      query = query.eq('position', position)
    }

    const { data, error, count } = await query
      .order('jersey_number', { ascending: true })
      .range(offset, offset + limitNum - 1)

    if (error) throw handleDatabaseError(error)

    return {
      success: true,
      data: data || [],
      meta: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
      },
    }
  } catch (error) {
    console.error('Failed to fetch players:', error)
    throw createError({
      status: 500,
      message: 'Failed to fetch players',
    })
  }
})
