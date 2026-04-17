# VolleyCoach API Documentation

Complete REST API for managing volleyball teams, players, training sessions, and matches using Supabase PostgreSQL backend.

## Authentication

All requests require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Base URL

```
http://localhost:3000/api
```

## Response Format

All API responses follow a consistent format:

```typescript
{
  success: boolean
  data: T
  message?: string
  meta?: {
    page: number
    limit: number
    total: number
  }
}
```

## Error Handling

Error responses include status codes and messages:

```typescript
{
  status: 400|404|500
  message: string
  data?: { field: string[] }
}
```

---

## Teams

### List Teams

```
GET /teams?page=1&limit=20&season=2024
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `season` (string, optional) - Filter by season

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Volleyball Elite",
      "description": "Professional team",
      "coach_id": "uuid",
      "season": "2024",
      "level": "professional",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

### Get Team by ID

```
GET /teams/:id
```

### Create Team

```
POST /teams
Content-Type: application/json

{
  "name": "Team Name",
  "description": "Team description",
  "coach_id": "coach_uuid",
  "season": "2024",
  "level": "intermediate"
}
```

**Required Fields:** `name`, `coach_id`, `season`, `level`

**Level Options:** `beginner`, `intermediate`, `advanced`, `professional`

### Update Team

```
PUT /teams/:id
Content-Type: application/json

{
  "name": "Updated Team Name",
  "level": "advanced"
}
```

### Delete Team

```
DELETE /teams/:id
```

---

## Players

### List Players

```
GET /players?page=1&limit=50&team_id=uuid&position=setter
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50, max: 100)
- `team_id` (string, optional) - Filter by team
- `position` (string, optional) - Filter by position

**Position Options:** `setter`, `middle_blocker`, `outside_hitter`, `opposite`, `libero`

### Get Player by ID

```
GET /players/:id
```

### Create Player

```
POST /players
Content-Type: application/json

{
  "user_id": "uuid",
  "team_id": "uuid",
  "jersey_number": 10,
  "position": "setter",
  "height_cm": 185,
  "weight_kg": 75,
  "dominant_hand": "right"
}
```

**Required Fields:** `user_id`, `team_id`, `jersey_number`, `position`, `dominant_hand`

### Update Player

```
PUT /players/:id
Content-Type: application/json

{
  "position": "middle_blocker",
  "height_cm": 190
}
```

### Delete Player

```
DELETE /players/:id
```

---

## Training Sessions

### List Training Sessions

```
GET /training-sessions?page=1&limit=20&team_id=uuid&upcoming=true
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `team_id` (string, optional)
- `coach_id` (string, optional)
- `upcoming` (boolean, optional) - Show only future sessions

### Get Training Session by ID

```
GET /training-sessions/:id
```

### Create Training Session

```
POST /training-sessions
Content-Type: application/json

{
  "team_id": "uuid",
  "coach_id": "uuid",
  "name": "Defensive Drills",
  "description": "Focus on blocking techniques",
  "scheduled_at": "2024-03-15T18:00:00Z",
  "duration_minutes": 90,
  "location": "Gym A",
  "focus_areas": ["blocking", "passing"],
  "notes": "Bring water bottles"
}
```

**Required Fields:** `team_id`, `coach_id`, `name`, `scheduled_at`, `duration_minutes`

**Duration:** 1-480 minutes

### Update Training Session

```
PUT /training-sessions/:id
Content-Type: application/json

{
  "status": "in_progress",
  "attendance": 12
}
```

### Delete Training Session

```
DELETE /training-sessions/:id
```

---

## Matches

### List Matches

```
GET /matches?page=1&limit=20&team_id=uuid&status=scheduled
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `team_id` (string, optional) - Matches involving this team
- `status` (string, optional) - Filter by status

**Status Options:** `scheduled`, `in_progress`, `completed`, `cancelled`

### Get Match by ID

```
GET /matches/:id
```

### Create Match

```
POST /matches
Content-Type: application/json

{
  "home_team_id": "uuid",
  "away_team_id": "uuid",
  "scheduled_at": "2024-03-20T19:00:00Z",
  "location": "Main Arena",
  "status": "scheduled"
}
```

**Required Fields:** `home_team_id`, `away_team_id`, `scheduled_at`

**Teams must be different:** `home_team_id ≠ away_team_id`

### Update Match

```
PUT /matches/:id
Content-Type: application/json

{
  "status": "completed",
  "home_score": 3,
  "away_score": 1,
  "duration_minutes": 95
}
```

### Delete Match

```
DELETE /matches/:id
```

---

## Frontend Composables

### useTeams()

```typescript
const { 
  teams, 
  selectedTeam, 
  isLoading, 
  error,
  fetchTeams, 
  fetchTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} = useTeams()

// Fetch all teams
await fetchTeams()

// Filter by season
await fetchTeams('2024')

// Create team
const team = await createTeam({
  name: 'New Team',
  coach_id: 'coach123',
  season: '2024',
  level: 'intermediate'
})
```

### usePlayers()

```typescript
const { 
  players, 
  selectedPlayer,
  isLoading,
  error,
  fetchPlayers,
  fetchPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = usePlayers()

// Fetch players by team and position
await fetchPlayers({
  team_id: 'team123',
  position: 'setter'
})
```

### useTrainingSessions()

```typescript
const {
  sessions,
  selectedSession,
  isLoading,
  error,
  fetchSessions,
  fetchSessionById,
  createSession,
  updateSession,
  deleteSession
} = useTrainingSessions()

// Fetch upcoming sessions for a team
await fetchSessions({
  team_id: 'team123',
  upcoming: true
})
```

### useMatches()

```typescript
const {
  matches,
  selectedMatch,
  isLoading,
  error,
  fetchMatches,
  fetchMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} = useMatches()

// Fetch scheduled matches
await fetchMatches({
  team_id: 'team123',
  status: 'scheduled'
})
```

---

## Database Schema

### Teams Table

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  coach_id UUID NOT NULL,
  season VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Players Table

```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id),
  jersey_number INTEGER NOT NULL,
  position VARCHAR(50) NOT NULL,
  height_cm INTEGER,
  weight_kg DECIMAL,
  dominant_hand VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, jersey_number)
);
```

### Training Sessions Table

```sql
CREATE TABLE training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id),
  coach_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  location VARCHAR(255),
  focus_areas TEXT[],
  attendance INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Matches Table

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team_id UUID NOT NULL REFERENCES teams(id),
  away_team_id UUID NOT NULL REFERENCES teams(id),
  scheduled_at TIMESTAMP NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Best Practices

1. **Pagination:** Always paginate large result sets (use `limit=20` or `limit=50`)
2. **Filtering:** Use query parameters to filter results server-side
3. **Error Handling:** Check `success` field and handle errors gracefully
4. **Performance:** Use composables for reactive data binding
5. **Security:** Always include Authorization header with valid JWT token
6. **Data Validation:** Frontend should validate before sending; server validates all input

---

## Example: Creating a Complete Match Flow

```typescript
// 1. Fetch teams
const { teams, fetchTeams } = useTeams()
await fetchTeams('2024')

// 2. Create match
const { createMatch } = useMatches()
const match = await createMatch({
  home_team_id: teams.value[0].id,
  away_team_id: teams.value[1].id,
  scheduled_at: new Date().toISOString(),
  location: 'Main Arena'
})

// 3. Fetch match details
const { fetchMatchById, selectedMatch } = useMatches()
await fetchMatchById(match.id)

// 4. Update match with final score
await updateMatch(match.id, {
  status: 'completed',
  home_score: 3,
  away_score: 2
})
```
