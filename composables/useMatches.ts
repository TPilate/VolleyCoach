import type { Match, ApiResponse } from '~/types/models'

/**
 * useMatches - Composable for match data management
 */
export const useMatches = () => {
  const matches = ref<Match[]>([])
  const selectedMatch = ref<Match | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const totalMatches = ref(0)

  const fetchMatches = async (filters?: { team_id?: string; status?: string }) => {
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
      if (filters?.status) {
        query.status = filters.status
      }

      const response = await $fetch<ApiResponse<Match[]>>('/api/matches', { query })

      matches.value = response.data
      totalMatches.value = response.meta?.total || 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch matches'
    } finally {
      isLoading.value = false
    }
  }

  const fetchMatchById = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Match>>(`/api/matches/${id}`)
      selectedMatch.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch match'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createMatch = async (matchData: Partial<Match>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Match>>('/api/matches', {
        method: 'POST',
        body: matchData,
      })

      matches.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create match'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateMatch = async (id: string, matchData: Partial<Match>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Match>>(`/api/matches/${id}`, {
        method: 'PUT',
        body: matchData,
      })

      const index = matches.value.findIndex((m) => m.id === id)
      if (index > -1) {
        matches.value[index] = response.data
      }
      if (selectedMatch.value?.id === id) {
        selectedMatch.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update match'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteMatch = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/matches/${id}`, {
        method: 'DELETE',
      })

      matches.value = matches.value.filter((m) => m.id !== id)
      if (selectedMatch.value?.id === id) {
        selectedMatch.value = null
      }
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete match'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    matches: readonly(matches),
    selectedMatch: readonly(selectedMatch),
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentPage,
    pageSize,
    totalMatches: readonly(totalMatches),
    fetchMatches,
    fetchMatchById,
    createMatch,
    updateMatch,
    deleteMatch,
  }
}
