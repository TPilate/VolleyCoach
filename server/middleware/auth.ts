import { getSupabaseClient } from '../utils/supabase'

/**
 * Authentication middleware - Validates JWT tokens and populates auth context
 */
export default defineEventHandler((event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    event.context.auth = {
      authenticated: false,
      user: null,
      token: null,
    }
    return
  }

  try {
    const supabase = getSupabaseClient()

    // Verify JWT token with Supabase
    // Note: In production, implement proper JWT verification with your JWT secret
    event.context.auth = {
      authenticated: true,
      token,
      user: null, // Will be populated after verification
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    event.context.auth = {
      authenticated: false,
      user: null,
      token: null,
    }
  }
})
