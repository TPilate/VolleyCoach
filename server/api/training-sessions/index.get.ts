import { getSupabaseClient, handleDatabaseError } from '../../utils/supabase'
import type { TrainingSession, ApiResponse } from '../../../types/models'

/**
 * GET /api/training-sessions - List all training sessions
 */
export default defineEventHandler(async (event): Promise<ApiResponse<TrainingSession[]>> => {
  try {
    const { page = 1, limit = 20, team_id, coach_id, upcoming } = getQuery(event)

    const pageNum = Math.max(1, parseInt(page as string) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20))
    const offset = (pageNum - 1) * limitNum

    const supabase = getSupabaseClient()
    let query = supabase.from('training_sessions').select('*', { count: 'exact' })

    if (team_id) {
      query = query.eq('team_id', team_id)
    }

    if (coach_id) {
      query = query.eq('coach_id', coach_id)
    }

    if (upcoming === 'true') {
      const now = new Date().toISOString()
      query = query.gte('scheduled_at', now)
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
    console.error('Failed to fetch training sessions:', error)
    throw createError({
      status: 500,
      message: 'Failed to fetch training sessions',
    })
  }
})
