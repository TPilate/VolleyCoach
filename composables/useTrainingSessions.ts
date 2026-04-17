import type { TrainingSession, ApiResponse } from '~/types/models'

/**
 * useTrainingSessions - Composable for training session data management
 */
export const useTrainingSessions = () => {
  const sessions = ref<TrainingSession[]>([])
  const selectedSession = ref<TrainingSession | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const totalSessions = ref(0)

  const fetchSessions = async (filters?: { team_id?: string; coach_id?: string; upcoming?: boolean }) => {
    isLoading.value = true
    error.value = null

    try {
      const query: Record<string, any> = {
        page: currentPage.value,
        limit: pageSize.value,
      }

      if (filters?.team_id) {
        query.team_id = filters.team_id
      }
      if (filters?.coach_id) {
        query.coach_id = filters.coach_id
      }
      if (filters?.upcoming) {
        query.upcoming = 'true'
      }

      const response = await $fetch<ApiResponse<TrainingSession[]>>('/api/training-sessions', { query })

      sessions.value = response.data
      totalSessions.value = response.meta?.total || 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch training sessions'
    } finally {
      isLoading.value = false
    }
  }

  const fetchSessionById = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<TrainingSession>>(`/api/training-sessions/${id}`)
      selectedSession.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch training session'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createSession = async (sessionData: Partial<TrainingSession>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<TrainingSession>>('/api/training-sessions', {
        method: 'POST',
        body: sessionData,
      })

      sessions.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create training session'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateSession = async (id: string, sessionData: Partial<TrainingSession>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<TrainingSession>>(`/api/training-sessions/${id}`, {
        method: 'PUT',
        body: sessionData,
      })

      const index = sessions.value.findIndex((s) => s.id === id)
      if (index > -1) {
        sessions.value[index] = response.data
      }
      if (selectedSession.value?.id === id) {
        selectedSession.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update training session'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteSession = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/training-sessions/${id}`, {
        method: 'DELETE',
      })

      sessions.value = sessions.value.filter((s) => s.id !== id)
      if (selectedSession.value?.id === id) {
        selectedSession.value = null
      }
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete training session'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    sessions: readonly(sessions),
    selectedSession: readonly(selectedSession),
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentPage,
    pageSize,
    totalSessions: readonly(totalSessions),
    fetchSessions,
    fetchSessionById,
    createSession,
    updateSession,
    deleteSession,
  }
}
