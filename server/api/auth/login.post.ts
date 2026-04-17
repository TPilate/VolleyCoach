import { getSupabaseClient } from '../../utils/supabase'
import type { ApiResponse } from '../../../types/models'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: {
    id: string
    email: string
  }
  accessToken: string
  refreshToken: string
}

/**
 * POST /api/auth/login - Login user
 * Authenticates user with Supabase and returns tokens
 */
export default defineEventHandler(
  async (event): Promise<ApiResponse<LoginResponse>> => {
    try {
      const body = await readBody<LoginRequest>(event)

      // Validate input
      if (!body.email?.trim()) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Validation Error',
          message: 'Email is required',
        })
      }

      if (!body.password) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Validation Error',
          message: 'Password is required',
        })
      }

      const supabase = getSupabaseClient()

      // Sign in user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: body.email.toLowerCase().trim(),
        password: body.password,
      })

      if (error) {
        console.error('Login error:', error)
        throw createError({
          statusCode: 401,
          statusMessage: 'Authentication Failed',
          message:
            error.message === 'Invalid login credentials'
              ? 'Email or password is incorrect'
              : error.message || 'Login failed',
        })
      }

      if (!data.user || !data.session) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Authentication Error',
          message: 'Login failed - no session created',
        })
      }

      setResponseStatus(event, 200)
      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email || '',
          },
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token || '',
        },
      }
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      console.error('Login endpoint error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Server Error',
        message: 'Failed to login',
      })
    }
  }
)
