import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import { validateTeam } from '../../utils/validation'
import type { Team, ApiResponse } from '../../../types/models'

/**
 * GET /api/teams - List all teams with pagination
 */
export default defineEventHandler(async (event): Promise<ApiResponse<Team[]>> => {
  try {
    const { page = 1, limit = 20, season } = getQuery(event)

    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20))
    const offset = (pageNum - 1) * limitNum

    const supabase = getSupabaseClient()
    let query = supabase.from('teams').select('*', { count: 'exact' })

    if (season) {
      query = query.eq('season', season)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1)

    if (error) throw handleDatabaseError(error)

    return {
      success: true,
      data: data || [],
      meta: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum),
      },
    }
  } catch (error) {
    console.error('Failed to fetch teams:', error)
    throw createError({
      status: 500,
      message: 'Failed to fetch teams',
    })
  }
})
