# VolleyCoach Setup Guide

Complete setup instructions for the Nuxt + Supabase backend.

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- PostgreSQL database ready in Supabase

## 1. Environment Setup

Create a `.env.local` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for server-side only)
```

Get these values from your Supabase project settings:
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Go to Settings → API
- Copy `Project URL` and `anon public` key

## 2. Database Schema Setup

### Option A: Using Supabase SQL Editor

1. Open your Supabase dashboard
2. Go to SQL Editor
3. Create a new query
4. Copy the entire contents of `DATABASE_SCHEMA.sql`
5. Run the query

### Option B: Using CLI

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 5. Test API Endpoints

### Using cURL

```bash
# List teams
curl -X GET http://localhost:3000/api/teams \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create a team
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Team",
    "coach_id": "coach-uuid",
    "season": "2024",
    "level": "intermediate"
  }'
```

### Using Postman

1. Import the collection from `POSTMAN_COLLECTION.json` (if available)
2. Set environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `auth_token`: Your JWT token

## 6. Frontend Integration

### Using Composables in Components

```vue
<template>
  <div>
    <div v-if="isLoading">Loading teams...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <button @click="handleCreateTeam">Create Team</button>
      <ul>
        <li v-for="team in teams" :key="team.id">
          {{ team.name }} ({{ team.level }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { teams, isLoading, error, fetchTeams, createTeam } = useTeams()

onMounted(() => {
  fetchTeams()
})

const handleCreateTeam = async () => {
  const team = await createTeam({
    name: 'New Team',
    coach_id: 'coach-123',
    season: '2024',
    level: 'intermediate'
  })
  
  if (team) {
    console.log('Team created:', team)
  }
}
</script>
```

## 7. Best Practices

### Data Validation

Always validate input on the frontend before submitting:

```typescript
const validateTeamName = (name: string): boolean => {
  return name.trim().length >= 2 && name.length <= 255
}
```

### Error Handling

Implement proper error handling:

```typescript
const { createTeam, error } = useTeams()

const handleCreate = async (teamData) => {
  const team = await createTeam(teamData)
  
  if (!team) {
    console.error('Failed to create team:', error.value)
    // Show toast or alert to user
  }
}
```

### Loading States

Always show loading indicators:

```vue
<button @click="handleCreate" :disabled="isLoading">
  {{ isLoading ? 'Creating...' : 'Create Team' }}
</button>
```

## 8. Database Performance

### Indexes

All tables have indexes on frequently queried columns:
- `teams`: coach_id, season
- `players`: team_id, position, user_id
- `training_sessions`: team_id, scheduled_at
- `matches`: home_team_id, away_team_id, status

### Pagination

Always paginate large result sets:

```typescript
// Bad: Fetches all teams
const { data } = await supabase.from('teams').select()

// Good: Paginate results
const { data } = await supabase
  .from('teams')
  .select()
  .range(0, 19)  // Get first 20
```

### Caching

Implement caching for frequently accessed data:

```typescript
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const cachedTeams = ref<Team[]>([])
let lastFetch = 0

const fetchTeamsWithCache = async () => {
  const now = Date.now()
  
  if (cachedTeams.value.length && now - lastFetch < CACHE_DURATION) {
    return cachedTeams.value
  }
  
  const { teams, fetchTeams } = useTeams()
  await fetchTeams()
  
  cachedTeams.value = teams.value
  lastFetch = now
  
  return cachedTeams.value
}
```

## 9. Security

### JWT Token Management

Store JWT tokens securely:

```typescript
// Save token after login
const saveToken = (token: string) => {
  sessionStorage.setItem('auth_token', token) // Use sessionStorage, not localStorage
}

// Retrieve token for requests
const getToken = () => {
  return sessionStorage.getItem('auth_token')
}

// Clear token on logout
const clearToken = () => {
  sessionStorage.removeItem('auth_token')
}
```

### Row Level Security (RLS)

Enable RLS in Supabase for production:

```sql
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see teams they coach
CREATE POLICY team_coach_policy ON teams
  FOR SELECT
  USING (auth.uid() = coach_id);
```

## 10. Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Update `.env.local` with production Supabase project:

```env
SUPABASE_URL=https://your-production-project.supabase.co
SUPABASE_KEY=your-production-anon-key
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## 11. Troubleshooting

### Issue: "Missing SUPABASE_URL or SUPABASE_KEY"

**Solution:** Ensure `.env.local` is created with correct values

### Issue: "CORS Error"

**Solution:** Add your domain to Supabase allowed CORS origins

### Issue: "Authentication Failed"

**Solution:** Verify JWT token is valid and not expired

### Issue: "Database Connection Timeout"

**Solution:** Check Supabase connection pooling settings

## 12. Monitoring

### View Server Logs

Check the console output during development for request logs:

```
[GET] /api/teams - 200 (45ms)
[POST] /api/teams - 201 (120ms)
[PUT] /api/teams/uuid - 200 (60ms)
```

### Supabase Dashboard

Monitor database performance:
1. Go to Supabase Dashboard
2. Select your project
3. Go to Database → Monitoring
4. Check slow queries and connection stats

## 13. Next Steps

1. ✅ Set up database schema
2. ✅ Create API endpoints
3. ⏳ Build frontend pages and components
4. ⏳ Implement authentication
5. ⏳ Add Row Level Security (RLS)
6. ⏳ Set up CI/CD pipeline
7. ⏳ Deploy to production

## Support

For issues or questions:
- [Supabase Documentation](https://supabase.com/docs)
- [Nuxt Documentation](https://nuxt.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
