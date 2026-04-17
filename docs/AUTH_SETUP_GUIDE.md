# Supabase Auth Setup Guide

Complete guide for setting up and using Supabase authentication in VolleyCoach.

## Architecture

```
Frontend (Nuxt)
    ↓
useAuth() composable
    ↓
API Endpoints (/api/auth/*)
    ↓
Supabase Auth
    ↓
JWT Token Management
```

## How It Works

### 1. **JWT Token Flow**

```
User Login
    ↓
POST /api/auth/login (email + password)
    ↓
Supabase generates JWT token
    ↓
Token stored in sessionStorage
    ↓
Token sent in Authorization header on API calls
    ↓
Supabase verifies token automatically (RLS enforced)
```

### 2. **RLS Policies Automatically Enforced**

Once you have a token, Supabase automatically enforces RLS:
- Coaches see only their teams
- Players see only their teams
- No manual filtering needed!

---

## API Endpoints

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "coach@example.com",
    "password": "secure_password_123",
    "fullName": "John Coach"
  }'

# Response:
# {
#   "success": true,
#   "data": {
#     "user": {
#       "id": "user-uuid",
#       "email": "coach@example.com"
#     },
#     "message": "Registration successful! Please check your email to confirm."
#   }
# }
```

### Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "coach@example.com",
    "password": "secure_password_123"
  }'

# Response:
# {
#   "success": true,
#   "data": {
#     "user": {
#       "id": "user-uuid",
#       "email": "coach@example.com"
#     },
#     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#     "refreshToken": "xxxxx"
#   }
# }
```

### Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Response:
# {
#   "success": true,
#   "data": {
#     "id": "user-uuid",
#     "email": "coach@example.com",
#     "fullName": "John Coach",
#     "createdAt": "2024-04-17T10:00:00Z"
#   }
# }
```

### Logout User

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Response:
# {
#   "success": true,
#   "data": null,
#   "message": "Logged out successfully"
# }
```

---

## Frontend Usage

### Register

```vue
<template>
  <form @submit.prevent="handleRegister">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <input v-model="fullName" type="text" placeholder="Full Name (optional)" />
    <button type="submit" :disabled="isLoading">Register</button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
const email = ref('')
const password = ref('')
const fullName = ref('')

const { register, isLoading, error } = useAuth()

const handleRegister = async () => {
  const result = await register(
    email.value,
    password.value,
    fullName.value
  )

  if (result.success) {
    // Redirect to login page
    await navigateTo('/login')
  }
}
</script>
```

### Login

```vue
<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit" :disabled="isLoading">Login</button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
const email = ref('')
const password = ref('')
const router = useRouter()

const { login, isLoading, error, isAuthenticated } = useAuth()

const handleLogin = async () => {
  const result = await login(email.value, password.value)

  if (result.success) {
    // Redirect to dashboard
    await router.push('/dashboard')
  }
}
</script>
```

### Logout

```vue
<template>
  <button @click="handleLogout" :disabled="isLoading">
    Logout
  </button>
</template>

<script setup>
const router = useRouter()
const { logout, isLoading } = useAuth()

const handleLogout = async () => {
  const result = await logout()

  if (result.success) {
    // Redirect to login
    await router.push('/login')
  }
}
</script>
```

### Protected Pages

```vue
<template>
  <div v-if="isAuthenticated">
    <h1>Welcome {{ user?.email }}</h1>
    <!-- Page content -->
  </div>
  <div v-else>
    <p>Please login to access this page</p>
  </div>
</template>

<script setup>
const { isAuthenticated, user } = useAuth()

// Optional: Redirect if not authenticated
onMounted(() => {
  if (!isAuthenticated.value) {
    navigateTo('/login')
  }
})
</script>
```

---

## Testing the Auth Flow

### Step 1: Register User

```bash
# Terminal
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "fullName": "Test User"
  }'
```

### Step 2: Login

```bash
# Save the token from login response
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }' | jq '.data.accessToken' -r > token.txt

TOKEN=$(cat token.txt)
```

### Step 3: Create Team (With Auth)

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "My Team",
    "season": "2024",
    "level": "intermediate"
  }'
```

### Step 4: Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Security Features

✅ **Password Security**
- Minimum 6 characters
- Hashed by Supabase
- Never stored in plain text

✅ **JWT Token Security**
- Issued by Supabase
- Verified on every request
- Automatic RLS enforcement

✅ **Row Level Security (RLS)**
- Database enforces access control
- Can't be bypassed
- Automatic with authenticated requests

✅ **Error Handling**
- Generic error messages (no user enumeration)
- No sensitive data in responses
- Proper HTTP status codes

---

## Common Issues

### Issue: "No authorization token provided"

**Cause**: Token not sent in request

**Fix**: Include Authorization header
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" ...
```

### Issue: "Invalid or expired token"

**Cause**: Token expired or invalid

**Fix**: Login again to get new token

### Issue: RLS returns empty results

**Cause**: User doesn't have access to resource

**Fix**: This is correct behavior! RLS is working.

---

## Environment Variables Needed

```bash
# .env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key  # or service role key for backend
```

---

## Next Steps

1. ✅ Register a test user via API or Supabase Dashboard
2. ✅ Login to get JWT token
3. ✅ Use token to create teams/players
4. ✅ Build frontend login/register pages
5. ✅ Add protected routes (redirect to login if not authenticated)

---

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [JWT Tokens](https://jwt.io/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
