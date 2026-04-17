import type { Player, ApiResponse } from '~/types/models'

/**
 * usePlayers - Composable for player data management
 */
export const usePlayers = () => {
  const players = ref<Player[]>([])
  const selectedPlayer = ref<Player | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(50)
  const totalPlayers = ref(0)

  const fetchPlayers = async (filters?: { team_id?: string; position?: string }) => {
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
      if (filters?.position) {
        query.position = filters.position
      }

      const response = await $fetch<ApiResponse<Player[]>>('/api/players', { query })

      players.value = response.data
      totalPlayers.value = response.meta?.total || 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch players'
    } finally {
      isLoading.value = false
    }
  }

  const fetchPlayerById = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Player>>(`/api/players/${id}`)
      selectedPlayer.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch player'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createPlayer = async (playerData: Partial<Player>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Player>>('/api/players', {
        method: 'POST',
        body: playerData,
      })

      players.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create player'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updatePlayer = async (id: string, playerData: Partial<Player>) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Player>>(`/api/players/${id}`, {
        method: 'PUT',
        body: playerData,
      })

      const index = players.value.findIndex((p) => p.id === id)
      if (index > -1) {
        players.value[index] = response.data
      }
      if (selectedPlayer.value?.id === id) {
        selectedPlayer.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update player'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deletePlayer = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/players/${id}`, {
        method: 'DELETE',
      })

      players.value = players.value.filter((p) => p.id !== id)
      if (selectedPlayer.value?.id === id) {
        selectedPlayer.value = null
      }
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete player'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    players: readonly(players),
    selectedPlayer: readonly(selectedPlayer),
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentPage,
    pageSize,
    totalPlayers: readonly(totalPlayers),
    fetchPlayers,
    fetchPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
  }
}
