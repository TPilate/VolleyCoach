# VolleyCoach - Complete Backend Implementation

Full-stack Nuxt 3 + Supabase PostgreSQL application for managing volleyball teams, players, training sessions, and matches.

## 📋 Project Overview

VolleyCoach provides a comprehensive management system for volleyball coaching with:
- **Team Management** - Create and manage teams by season and skill level
- **Player Profiles** - Track player positions, jersey numbers, and physical attributes
- **Training Sessions** - Schedule and organize practice sessions with focus areas
- **Match Tracking** - Record matches, scores, and player statistics
- **Performance Analytics** - Aggregate player statistics across matches

## 🗂️ Project Structure

```
VolleyCoach/
├── types/
│   └── models.ts                    # TypeScript interfaces for all entities
├── server/
│   ├── api/
│   │   ├── teams/                   # Team CRUD endpoints
│   │   ├── players/                 # Player CRUD endpoints
│   │   ├── training-sessions/       # Training session endpoints
│   │   └── matches/                 # Match management endpoints
│   ├── utils/
│   │   ├── supabase.ts             # Supabase client & connection pooling
│   │   └── validation.ts            # Input validation rules
│   └── middleware/
│       ├── auth.ts                  # JWT authentication
│       └── log.ts                   # Request logging
├── composables/
│   ├── useTeams.ts                 # Team data composable
│   ├── usePlayers.ts               # Player data composable
│   ├── useTrainingSessions.ts       # Training session composable
│   └── useMatches.ts               # Match data composable
├── DATABASE_SCHEMA.sql              # Complete SQL migration
├── API_DOCUMENTATION.md             # REST API reference
├── SETUP_GUIDE.md                   # Setup & deployment guide
└── README.md                        # This file
```

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Create .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### 2. Database Setup
- Copy contents of `DATABASE_SCHEMA.sql`
- Run in Supabase SQL Editor
- Creates all tables with indexes and constraints

### 3. Install & Run
```bash
npm install
npm run dev
```

## 📊 Data Models

### Teams
```typescript
interface Team {
  id: UUID
  name: string
  coach_id: UUID
  season: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  created_at: timestamp
  updated_at: timestamp
}
```

### Players
```typescript
interface Player {
  id: UUID
  user_id: UUID
  team_id: UUID (FK → teams)
  jersey_number: 1-99
  position: 'setter' | 'middle_blocker' | 'outside_hitter' | 'opposite' | 'libero'
  height_cm: 120-250
  weight_kg: 30-200
  dominant_hand: 'left' | 'right'
}
```

### Training Sessions
```typescript
interface TrainingSession {
  id: UUID
  team_id: UUID (FK → teams)
  coach_id: UUID
  name: string
  scheduled_at: timestamp
  duration_minutes: 1-480
  focus_areas: string[]
  location?: string
}
```

### Matches
```typescript
interface Match {
  id: UUID
  home_team_id: UUID (FK → teams)
  away_team_id: UUID (FK → teams)
  scheduled_at: timestamp
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  home_score?: number
  away_score?: number
}
```

## 🔌 API Endpoints

All endpoints follow REST conventions and require JWT authentication.

### Teams
```
GET    /api/teams              # List teams (paginated)
POST   /api/teams              # Create team
GET    /api/teams/:id          # Get team by ID
PUT    /api/teams/:id          # Update team
DELETE /api/teams/:id          # Delete team
```

### Players
```
GET    /api/players            # List players (with filters)
POST   /api/players            # Create player
GET    /api/players/:id        # Get player by ID
PUT    /api/players/:id        # Update player
DELETE /api/players/:id        # Delete player
```

### Training Sessions
```
GET    /api/training-sessions  # List sessions (paginated)
POST   /api/training-sessions  # Create session
GET    /api/training-sessions/:id  # Get session
PUT    /api/training-sessions/:id  # Update session
DELETE /api/training-sessions/:id  # Delete session
```

### Matches
```
GET    /api/matches            # List matches
POST   /api/matches            # Create match
GET    /api/matches/:id        # Get match by ID
PUT    /api/matches/:id        # Update match score
DELETE /api/matches/:id        # Delete match
```

## 🎯 Frontend Composables

### useTeams()
```typescript
const { 
  teams, selectedTeam, isLoading, error,
  fetchTeams, fetchTeamById, createTeam, updateTeam, deleteTeam 
} = useTeams()
```

### usePlayers()
```typescript
const { 
  players, selectedPlayer, isLoading, error,
  fetchPlayers, fetchPlayerById, createPlayer, updatePlayer, deletePlayer 
} = usePlayers()
```

### useTrainingSessions()
```typescript
const { 
  sessions, selectedSession, isLoading, error,
  fetchSessions, fetchSessionById, createSession, updateSession, deleteSession 
} = useTrainingSessions()
```

### useMatches()
```typescript
const { 
  matches, selectedMatch, isLoading, error,
  fetchMatches, fetchMatchById, createMatch, updateMatch, deleteMatch 
} = useMatches()
```

## ✅ Features Implemented

- [x] TypeScript models for all entities
- [x] Supabase PostgreSQL integration
- [x] Complete CRUD endpoints (Teams, Players, Sessions, Matches)
- [x] Input validation with error handling
- [x] Pagination support
- [x] Authentication middleware
- [x] Request logging middleware
- [x] Frontend composables for data management
- [x] API documentation
- [x] Database schema with indexes
- [x] Setup & deployment guide

## 📈 Database Features

- **Constraints**: Primary keys, foreign keys, unique constraints, check constraints
- **Indexes**: On frequently queried columns for performance
- **Referential Integrity**: Cascading deletes on related records
- **Data Validation**: Column-level validation (jersey numbers, heights, positions)
- **Timestamps**: automatic `created_at` and `updated_at` tracking

## 🔒 Security Features

- JWT token verification middleware
- Input validation on all endpoints
- Foreign key constraints preventing orphaned records
- HTTP status codes (201 Created, 204 No Content, 404 Not Found, 400 Bad Request)
- Error message sanitization

## 📝 Usage Examples

### Create a Team
```typescript
const { createTeam } = useTeams()

const team = await createTeam({
  name: 'Elite Volleyball Club',
  coach_id: 'coach-uuid',
  season: '2024',
  level: 'professional'
})
```

### Add Player to Team
```typescript
const { createPlayer } = usePlayers()

const player = await createPlayer({
  user_id: 'user-uuid',
  team_id: 'team-uuid',
  jersey_number: 10,
  position: 'setter',
  height_cm: 185,
  weight_kg: 75,
  dominant_hand: 'right'
})
```

### Schedule Training Session
```typescript
const { createSession } = useTrainingSessions()

const session = await createSession({
  team_id: 'team-uuid',
  coach_id: 'coach-uuid',
  name: 'Defensive Drills',
  scheduled_at: new Date('2024-03-20T18:00:00Z').toISOString(),
  duration_minutes: 90,
  focus_areas: ['blocking', 'passing']
})
```

### Record Match Result
```typescript
const { createMatch, updateMatch } = useMatches()

// Create match
const match = await createMatch({
  home_team_id: 'team1-uuid',
  away_team_id: 'team2-uuid',
  scheduled_at: new Date('2024-03-25T19:00:00Z').toISOString()
})

// Update with final score
await updateMatch(match.id, {
  status: 'completed',
  home_score: 3,
  away_score: 1
})
```

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📚 Documentation Files

- **API_DOCUMENTATION.md** - Complete REST API reference with cURL examples
- **DATABASE_SCHEMA.sql** - SQL migration script for Supabase
- **SETUP_GUIDE.md** - Step-by-step setup, deployment, and troubleshooting

## 🔗 Dependencies

- **nuxt**: ^4.4.2 - Vue 3 meta-framework
- **@nuxtjs/supabase**: ^2.0.5 - Supabase integration
- **@supabase/supabase-js**: ^2.103.3 - Supabase client
- **@pinia/nuxt**: ^0.11.3 - State management
- **vue**: ^3.5.32 - Progressive JavaScript framework

## 🚢 Deployment

1. Build production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or any Node.js hosting
3. Set environment variables in production
4. Database migrations are managed in Supabase

## 🐛 Troubleshooting

See **SETUP_GUIDE.md** for common issues and solutions:
- Missing environment variables
- CORS errors
- Authentication failures
- Database connection timeouts

## 📞 Support

- [Supabase Docs](https://supabase.com/docs)
- [Nuxt Docs](https://nuxt.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

## 📄 License

See LICENSE file

---

**Last Updated:** April 17, 2026
