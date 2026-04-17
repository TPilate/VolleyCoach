import { getSupabaseClient } from '../../utils/supabase'
import type { ApiResponse } from '../../../types/models'

/**
 * POST /api/auth/logout - Logout user
 * Signs out user from Supabase
 */
export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    const supabase = getSupabaseClient()

    // Sign out user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Logout failed',
        message: error.message || 'Failed to logout',
      })
    }

    return {
      success: true,
      data: null,
      message: 'Logged out successfully',
    }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('Logout endpoint error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Server Error',
      message: 'Failed to logout',
    })
  }
})
