import { getSupabaseClient, requireAuth } from '../../utils/supabase'
import type { ApiResponse } from '../../../types/models'

interface UserResponse {
  id: string
  email: string
  fullName?: string
  createdAt: string
}

/**
 * GET /api/auth/me - Get current authenticated user
 * Returns the currently logged-in user info
 */
export default defineEventHandler(
  async (event): Promise<ApiResponse<UserResponse>> => {
    try {
      // Verify user is authenticated
      const user = await requireAuth(event)

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || undefined,
          createdAt: user.created_at || new Date().toISOString(),
        },
      }
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      console.error('Get user endpoint error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Server Error',
        message: 'Failed to get user info',
      })
    }
  }
)
