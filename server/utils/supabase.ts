import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

/**
 * Get or create Supabase client instance
 * Follows connection pooling best practices
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables')
  }

  supabaseClient = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Don't persist on server
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'volleyball-coach/1.0.0',
      },
    },
  })

  return supabaseClient
}

/**
 * Custom error handling for database operations
 */
export class DatabaseError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>,
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/**
 * Helper to extract and normalize Supabase errors
 */
export const handleDatabaseError = (error: any) => {
  if (error.code) {
    return new DatabaseError(error.code, error.message, error.details)
  }

  if (error.message?.includes('Failed to fetch')) {
    return new DatabaseError('NETWORK_ERROR', 'Network request failed', { original: error })
  }

  return new DatabaseError('UNKNOWN_ERROR', error.message || 'An unknown error occurred')
}
