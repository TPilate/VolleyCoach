import { getSupabaseClient } from '../../utils/supabase'
import type { ApiResponse } from '../../../types/models'

interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

interface RegisterResponse {
  user: {
    id: string
    email: string
  }
  message: string
}

/**
 * POST /api/auth/register - Register new user
 * Creates user in Supabase Auth and sets up profile
 * Step 1 of 3: Profile Setup (Full Name, Email, Password)
 */
export default defineEventHandler(
  async (event): Promise<ApiResponse<RegisterResponse>> => {
    try {
      const body = await readBody<RegisterRequest>(event)

      // Validate input
      if (!body.fullName?.trim()) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Validation Error',
          message: 'Full name is required',
        })
      }

      if (!body.email?.trim()) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Validation Error',
          message: 'Email is required',
        })
      }

      if (!body.password || body.password.length < 8) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Validation Error',
          message: 'Password must be at least 8 characters',
        })
      }

      const supabase = getSupabaseClient()

      // Sign up new user
      const { data, error } = await supabase.auth.signUp({
        email: body.email.toLowerCase().trim(),
        password: body.password,
        options: {
          data: {
            full_name: body.fullName || '',
          },
        },
      })

      if (error) {
        console.error('Signup error:', error)
        throw createError({
          statusCode: 400,
          statusMessage: 'Registration failed',
          message:
            error.message === 'User already registered'
              ? 'This email is already registered. Please login instead.'
              : error.message || 'Failed to register',
        })
      }

      if (!data.user) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Registration Error',
          message: 'User creation failed',
        })
      }

      setResponseStatus(event, 201)
      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email || '',
          },
          message: 'Registration successful! Please check your email to confirm.',
        },
      }
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      console.error('Register endpoint error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Server Error',
        message: 'Failed to register user',
      })
    }
  }
)
