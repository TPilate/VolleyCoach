import type { Team, ApiResponse } from '~/types/models'

/**
 * useTeams - Composable for team data management
 */
export const useTeams = () => {
  const teams = ref<Team[]>([])
  const selectedTeam = ref<Team | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const totalTeams = ref(0)

  const fetchTeams = async (season?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const query: Record<string, any> = {
        page: currentPage.value,
        limit: pageSize.value,
      }

      if (season) {
        query.season = season
      }

      const response = await $fetch<ApiResponse<Team[]>>('/api/teams', {
        query,
      })

      teams.value = response.data
      totalTeams.value = response.meta?.total || 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch teams'
    } finally {
      isLoading.value = false
    }
  }

  const fetchTeamById = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Team>>(`/api/teams/${id}`)
      selectedTeam.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch team'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createTeam = async (teamData: Partial<Team>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Team>>('/api/teams', {
        method: 'POST',
        body: teamData,
      })

      teams.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create team'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateTeam = async (id: string, teamData: Partial<Team>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Team>>(`/api/teams/${id}`, {
        method: 'PUT',
        body: teamData,
      })

      const index = teams.value.findIndex((t) => t.id === id)
      if (index > -1) {
        teams.value[index] = response.data
      }
      if (selectedTeam.value?.id === id) {
        selectedTeam.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update team'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteTeam = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/teams/${id}`, {
        method: 'DELETE',
      })

      teams.value = teams.value.filter((t) => t.id !== id)
      if (selectedTeam.value?.id === id) {
        selectedTeam.value = null
      }
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete team'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    teams: readonly(teams),
    selectedTeam: readonly(selectedTeam),
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentPage,
    pageSize,
    totalTeams: readonly(totalTeams),
    fetchTeams,
    fetchTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
  }
}
