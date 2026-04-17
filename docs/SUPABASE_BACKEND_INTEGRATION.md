# Supabase Migration - Nuxt Backend Integration Guide

Guide for updating your Nuxt/Node.js backend to work with RLS-enabled schema and connection pooling.

---

## Quick Start

### 1. Environment Variables

Update `.env` with pooler URL:

```bash
# .env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Connection pooler (for backend queries)
# Format: postgres://[user]:[password]@[host]:6543/[database]
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:6543/postgres
```

**Where to find these:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy the URLs shown

### 2. Update Supabase Client

#### File: `server/utils/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

// For authenticated requests (uses RLS)
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,  // Server-side, no session needed
    }
  }
)

// For server-side queries (bypasses RLS when needed)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    }
  }
)
```

---

## API Endpoints with RLS

### Pattern: User Gets Their Own Data

Most queries now automatically filter via RLS.

```typescript
// server/api/teams/index.get.ts
import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  // RLS automatically returns only user's teams
  // No need to manually filter!
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
  
  if (error) throw createError({
    statusCode: 400,
    statusMessage: error.message
  })
  
  return teams
})
```

### Pattern: Public Read with RLS

Some tables allow public reads (like matches):

```typescript
// server/api/matches/upcoming.get.ts
export default defineEventHandler(async (event) => {
  // Matches are readable by all authenticated users
  const { data: matches } = await supabase
    .from('upcoming_matches')  // Using the view we created
    .select('*')
    .order('scheduled_at', { ascending: true })
  
  return matches
})
```

### Pattern: Admin Operations (Bypass RLS)

Use `supabaseAdmin` when you need to bypass RLS:

```typescript
// server/api/admin/teams/index.get.ts
import { supabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  // Only admins should access this
  const user = await requireAuth(event)
  if (!user.isAdmin) throw createError({ statusCode: 403 })
  
  // Bypass RLS to get ALL teams
  const { data: allTeams } = await supabaseAdmin
    .from('teams')
    .select('*')
  
  return allTeams
})
```

---

## Examples: Updating API Endpoints

### Example 1: Get Teams for Coach

#### Before (No RLS)
```typescript
// server/api/teams/index.get.ts
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  // Manual filtering
  const { data } = await supabase
    .from('teams')
    .select('*')
    .eq('coach_id', user.id)  // ❌ Manual filter needed
  
  return data
})
```

#### After (With RLS)
```typescript
// server/api/teams/index.get.ts
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  
  // RLS automatically filters
  const { data } = await supabase
    .from('teams')
    .select('*')
    // ✅ No filter needed, RLS handles it
  
  return data
})
```

### Example 2: Get Players on a Team

#### Before (No RLS)
```typescript
// server/api/teams/[id]/players.get.ts
export default defineEventHandler(async (event) => {
  const teamId = getRouterParam(event, 'id')
  
  // Manual access check
  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .single()
  
  if (!team) throw createError({ statusCode: 404 })
  
  // Manual filtering
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', teamId)
  
  return players
})
```

#### After (With RLS)
```typescript
// server/api/teams/[id]/players.get.ts
export default defineEventHandler(async (event) => {
  const teamId = getRouterParam(event, 'id')
  
  // RLS automatically validates access
  // If user can't see the team, this will return empty
  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', teamId)
  
  return players  // ✅ Safe, RLS-protected
})
```

### Example 3: Create Player

#### Before (No RLS)
```typescript
// server/api/players/index.post.ts
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  
  // Verify user is coach of this team
  const { data: team } = await supabase
    .from('teams')
    .select('*')
    .eq('id', body.team_id)
    .eq('coach_id', user.id)
    .single()
  
  if (!team) throw createError({ 
    statusCode: 403,
    statusMessage: 'Not authorized for this team'
  })
  
  // Create player
  const { data } = await supabase
    .from('players')
    .insert([body])
  
  return data
})
```

#### After (With RLS)
```typescript
// server/api/players/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // RLS handles authorization
  // If user isn't coach of team, INSERT will fail
  const { data, error } = await supabase
    .from('players')
    .insert([body])
  
  if (error) throw createError({
    statusCode: 403,
    statusMessage: error.message
  })
  
  return data  // ✅ Safe, RLS-protected
})
```

---

## Composables Update

### Before: composables/useTeams.ts

```typescript
export const useTeams = () => {
  const teams = ref([])
  
  const fetchTeams = async () => {
    const { data } = await $fetch('/api/teams')
    teams.value = data
  }
  
  return { teams, fetchTeams }
}
```

### After: composables/useTeams.ts

```typescript
export const useTeams = () => {
  const teams = ref([])
  
  // No changes needed! API handles RLS
  const fetchTeams = async () => {
    teams.value = await $fetch('/api/teams')
  }
  
  return { teams, fetchTeams }
}
```

---

## Common Patterns

### Pattern 1: Filter by Relationship

```typescript
// Get training sessions for coach
const { data } = await supabase
  .from('training_sessions')
  .select('*')
  .eq('coach_id', userId)
// RLS enforces: only coach can see their sessions ✅
```

### Pattern 2: Join Tables

```typescript
// Get teams with players
const { data } = await supabase
  .from('teams')
  .select(`
    *,
    players (
      id,
      user_id,
      position,
      jersey_number
    )
  `)
// RLS enforces on both teams AND players ✅
```

### Pattern 3: Aggregate Functions

```typescript
// Get attendance count for session
const { data } = await supabase
  .from('attendance')
  .select('status, count(*)', { count: 'exact' })
  .eq('training_session_id', sessionId)
// RLS enforces: user only sees their session's attendance ✅
```

### Pattern 4: Real-time Subscriptions

```typescript
// Listen for team changes (RLS enforced)
const subscription = supabase
  .channel('teams')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'teams' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
// RLS enforces: only see changes to your teams ✅
```

---

## Error Handling

### Handle RLS Rejections

```typescript
export default defineEventHandler(async (event) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows (RLS rejected or not found)
        throw createError({ statusCode: 404 })
      }
      throw createError({ 
        statusCode: 400,
        statusMessage: error.message 
      })
    }
    
    return data
  } catch (err) {
    console.error('Database error:', err)
    throw createError({ statusCode: 500 })
  }
})
```

---

## Testing with Different Users

### Test RLS Policies

```typescript
// server/utils/test-rls.ts
export async function testRLS() {
  const user1 = 'coach-1-id'
  const user2 = 'coach-2-id'
  
  // Create test data as admin
  const { data: team1 } = await supabaseAdmin
    .from('teams')
    .insert([{ name: 'Team 1', coach_id: user1, season: '2024' }])
    .single()
  
  // Try to access as user2
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
  
  // Should be empty if RLS working correctly
  console.assert(
    !teams?.find(t => t.id === team1.id),
    'RLS FAILED: User2 can see User1 teams!'
  )
}
```

---

## Connection Pooling Best Practices

### Use Connection Pooler URL

```bash
# For production backend:
DATABASE_URL=postgres://postgres:password@db.xxxxx.supabase.co:6543/postgres
#                                                                   ↑ Note port 6543

# For local development (direct connection):
# postgres://postgres:password@db.xxxxx.supabase.co:5432/postgres
#                                                    ↑ Note port 5432
```

### Transaction Mode (Default)

```typescript
// Works with transaction mode (default pooler setting)
const transaction = await supabase.rpc('some_function')

// Each query is independent (can't hold locks across queries)
const { data: data1 } = await supabase.from('table1').select('*')
const { data: data2 } = await supabase.from('table2').select('*')
// ✅ Good for web apps
```

### Session Mode (If Needed)

```typescript
// For prepared statements or temp tables, use session mode
// Set in Supabase project settings: Database > Connection Pool
// But most web apps should use Transaction mode!
```

---

## Monitoring Queries

### Log Slow Queries

```typescript
// server/middleware/db-logging.ts
export default defineEventHandler(async (event) => {
  const start = Date.now()
  
  await event.node.res.on('finish', () => {
    const duration = Date.now() - start
    if (duration > 100) {  // Log queries > 100ms
      console.warn(`Slow query (${duration}ms): ${event.node.req.url}`)
    }
  })
})
```

### Check Active Connections

```typescript
// Monitor from Supabase dashboard:
// Settings → Database → Connections
// or query directly:

const { data } = await supabaseAdmin
  .rpc('get_db_stats')  // If function exists

// Or check via SQL:
// SELECT count(*) as active_connections FROM pg_stat_activity;
```

---

## Migration Checklist

- [ ] Update `.env` with pooler URL
- [ ] Update `server/utils/supabase.ts` (add admin client)
- [ ] Test API endpoints with new RLS
- [ ] Verify no manual filters needed
- [ ] Test error handling
- [ ] Monitor connection count
- [ ] Load test with connection pooling
- [ ] Update documentation

---

## Troubleshooting

### Issue: "Rows not found" but data exists

**Cause**: RLS policy rejecting access

**Solution**:
```typescript
// Check if policy is working
const user = await auth.getUser()
console.log('Current user:', user.id)

// Verify policy references this user
// Example policy should have: using (coach_id = auth.uid())
```

### Issue: Composite indexes not being used

**Cause**: Query not matching index column order

**Solution**:
```typescript
// Index: idx_training_sessions_team_scheduled
// Columns: (team_id, scheduled_at)

// ✅ Good: Uses index
select * from training_sessions 
where team_id = 'x' and scheduled_at > now()

// ❌ Bad: Won't use index (wrong order)
select * from training_sessions 
where scheduled_at > now() and team_id = 'x'
```

### Issue: Too many connections

**Cause**: Not using connection pooler

**Solution**:
```bash
# Use port 6543 (pooler) not 5432 (direct)
postgres://user:pass@host:6543/database  # ✅ Good
postgres://user:pass@host:5432/database  # ❌ Bad
```

---

## Performance Verification

### Before Deploying

```bash
# Run these in server/api endpoints to verify:

# 1. Check query uses index
EXPLAIN ANALYZE SELECT * FROM training_sessions WHERE team_id = 'x';
# Should show "Index Scan" not "Seq Scan"

# 2. Check RLS is working
SET request.jwt.claims = '{"sub":"user-id"}';
SELECT * FROM teams;  # Should only show user's teams

# 3. Check composite index
EXPLAIN ANALYZE SELECT * FROM training_sessions 
  WHERE team_id = 'x' AND scheduled_at > now();
# Should show "Index Scan" using composite index
```

---

## Next Steps

1. ✅ Deploy migration to Supabase
2. ✅ Update environment variables
3. ✅ Update `server/utils/supabase.ts`
4. ✅ Test API endpoints
5. ✅ Verify RLS is working
6. ✅ Load test with pooler
7. ✅ Deploy to production

