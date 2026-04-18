import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TrainingSession {
  id: string
  teamName: string
  teamLevel: 'Advanced Tactics' | 'Basic Fundamentals' | 'Match Preparation'
  description: string
  time: string
  date: string
  status: 'upcoming' | 'ongoing' | 'completed'
  court?: {
    positions: Array<{ x: number; y: number; type: 'attacker' | 'defender' }>
  }
}

export interface RecentAction {
  id: string
  userName: string
  userAvatar: string
  action: string
  type: 'pass' | 'error' | 'block' | 'kill'
  value: string
  timestamp: string
}

export interface PerformanceMetric {
  label: string
  value: number
  color: 'primary' | 'orange' | 'blue' | 'gray'
}

export interface DashboardStats {
  activePlayersCount: number
  exercisesInLibraryCount: number
  winRate: string
  lastMatchesCount: number
  recentActions: RecentAction[]
  performanceMetrics: PerformanceMetric[]
}

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const coachName = ref<string>('Sarah')
  const upcomingTraining = ref<TrainingSession | null>(null)
  const stats = ref<DashboardStats>({
    activePlayersCount: 24,
    exercisesInLibraryCount: 142,
    winRate: '68%',
    lastMatchesCount: 10,
    recentActions: [
      {
        id: '1',
        userName: 'Elena R.',
        userAvatar: 'ER',
        action: 'Perfect Pass',
        type: 'pass',
        value: '+3 pts',
        timestamp: 'Just now',
      },
      {
        id: '2',
        userName: 'Marcus K.',
        userAvatar: 'MK',
        action: 'Service Error',
        type: 'error',
        value: '-1 pt',
        timestamp: '5 min ago',
      },
      {
        id: '3',
        userName: 'David S.',
        userAvatar: 'DS',
        action: 'Block Kill',
        type: 'block',
        value: '+2 pts',
        timestamp: '15 min ago',
      },
    ],
    performanceMetrics: [
      { label: 'Passes', value: 68, color: 'primary' },
      { label: 'Sets', value: 45, color: 'gray' },
      { label: 'Hits', value: 32, color: 'orange' },
      { label: 'Blocks', value: 28, color: 'blue' },
    ],
  })

  // Initialize with mock data
  const initializeDashboard = () => {
    upcomingTraining.value = {
      id: '1',
      teamName: 'Team A - Advanced Tactics',
      teamLevel: 'Advanced Tactics',
      description:
        'Focus on rotational defense and out-of-system attacking. High intensity expected.',
      time: '6:00 PM',
      date: 'TONIGHT',
      status: 'upcoming',
      court: {
        positions: [
          { x: 30, y: 40, type: 'attacker' },
          { x: 60, y: 50, type: 'defender' },
          { x: 70, y: 35, type: 'attacker' },
        ],
      },
    }
  }

  // Fetch or update dashboard data
  const fetchDashboardData = async () => {
    try {
      // This would normally be an API call
      // const response = await $fetch('/api/dashboard')
      // stats.value = response
      initializeDashboard()
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  // Get dashboard data
  const getDashboardData = computed(() => ({
    coachName: coachName.value,
    upcomingTraining: upcomingTraining.value,
    stats: stats.value,
  }))

  return {
    coachName,
    upcomingTraining,
    stats,
    initializeDashboard,
    fetchDashboardData,
    getDashboardData,
  }
})
