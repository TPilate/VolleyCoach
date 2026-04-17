import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { Match, ApiResponse } from '../../../types/models'

/**
 * GET /api/matches - List all matches with filtering
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Match[]>> => {
  try {
    const { page = 1, limit = 20, team_id, status } = getQuery(event)

    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20))
    const offset = (pageNum - 1) * limitNum

    const supabase = getSupabaseClient()
    let query = supabase.from('matches').select('*', { count: 'exact' })

    if (team_id) {
      query = query.or(`home_team_id.eq.${team_id},away_team_id.eq.${team_id}`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query
      .order('scheduled_at', { ascending: false })
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
    console.error('Failed to fetch matches:', error)
    throw createError({
      status: 500,
      message: 'Failed to fetch matches',
    })
  }
})
