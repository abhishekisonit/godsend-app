# Postman Testing Guide for Godsend Request APIs

## Overview

This guide helps you test the Request APIs in Postman while maintaining session authentication. The APIs use NextAuth.js with JWT strategy, which requires special handling in Postman.

## Authentication Methods

### Method 1: API Key Authentication (Recommended for Postman)

1. **Get a Session Token**

   ```
   POST http://localhost:3000/api/test-auth
   Content-Type: application/json

   {
     "email": "your-email@example.com",
     "password": "your-password"
   }
   ```

2. **Use the Session Token**
   - Copy the `sessionToken` from the response
   - Add it as a header in all subsequent requests:
   ```
   x-api-key: <sessionToken>
   ```

### Method 2: Cookie-Based Authentication (Advanced)

1. **Login through the web interface**
   - Go to `http://localhost:3000/auth/signin`
   - Login with your credentials
   - Open browser dev tools → Application → Cookies
   - Copy the `next-auth.session-token` value

2. **Use the session cookie**
   - Add to Postman headers:
   ```
   Cookie: next-auth.session-token=<session-token-value>
   ```

## API Endpoints to Test

### 1. Authentication Test

```
GET http://localhost:3000/api/test-auth
Headers: x-api-key: <your-session-token>
```

### 2. Create a Request

```
POST http://localhost:3000/api/requests
Headers:
  Content-Type: application/json
  x-api-key: <your-session-token>

Body:
{
  "title": "Need medicine from Delhi",
  "description": "Looking for specific medicine available in Delhi",
  "category": "Medicine",
  "quantity": 2,
  "estimatedValue": 500,
  "sourceCity": "Delhi",
  "sourceShop": "Medical Store",
  "sourceAddress": "Connaught Place",
  "deliveryCity": "Mumbai",
  "meetupArea": "Andheri",
  "dueDate": "2024-02-15T10:00:00.000Z"
}
```

### 3. Get All Requests

```
GET http://localhost:3000/api/requests
Headers: x-api-key: <your-session-token>

Optional Query Parameters:
- category: Food|Medicine|Clothing|Electronics|Books|Other
- status: OPEN|IN_PROGRESS|COMPLETED|CANCELLED
- deliveryCity: string
- limit: number (1-50)
- offset: number
```

### 4. Get Specific Request

```
GET http://localhost:3000/api/requests/{requestId}
Headers: x-api-key: <your-session-token>
```

### 5. Update Request

```
PUT http://localhost:3000/api/requests/{requestId}
Headers:
  Content-Type: application/json
  x-api-key: <your-session-token>

Body:
{
  "title": "Updated title",
  "description": "Updated description",
  "estimatedValue": 600
}
```

### 6. Cancel Request

```
DELETE http://localhost:3000/api/requests/{requestId}
Headers: x-api-key: <your-session-token>
```

### 7. Fulfill Request

```
POST http://localhost:3000/api/requests/{requestId}/fulfill
Headers: x-api-key: <your-session-token>
```

### 8. Get Messages for Request

```
GET http://localhost:3000/api/requests/{requestId}/messages
Headers: x-api-key: <your-session-token>
```

### 9. Send Message

```
POST http://localhost:3000/api/requests/{requestId}/messages
Headers:
  Content-Type: application/json
  x-api-key: <your-session-token>

Body:
{
  "content": "Hello! I can help you with this request."
}
```

## Postman Collection Setup

### 1. Create Environment Variables

Create a Postman environment with these variables:

- `base_url`: `http://localhost:3000`
- `session_token`: (will be set after login)

### 2. Pre-request Script for Authentication

Add this script to automatically set the API key header:

```javascript
if (pm.environment.get('session_token')) {
  pm.request.headers.add({
    key: 'x-api-key',
    value: pm.environment.get('session_token'),
  });
}
```

### 3. Test Script for Session Management

Add this to your login request to automatically save the session token:

```javascript
pm.test('Login successful', function () {
  pm.response.to.have.status(200);
});

if (pm.response.code === 200) {
  const response = pm.response.json();
  if (response.sessionToken) {
    pm.environment.set('session_token', response.sessionToken);
    console.log('Session token saved:', response.sessionToken);
  }
}
```

## Common Issues and Solutions

### Issue 1: "Unauthorized" Error

**Cause**: Missing or invalid session token
**Solution**:

1. Re-authenticate using the test-auth endpoint
2. Check that the `x-api-key` header is set correctly
3. Verify the session token hasn't expired (24 hours)

### Issue 2: "User not found" Error

**Cause**: User doesn't exist in database
**Solution**:

1. Create a user account first
2. Use the correct email/password combination

### Issue 3: "Not authorized" Error

**Cause**: Trying to access/modify someone else's request
**Solution**:

1. Use the same user account that created the request
2. Check request ownership in the database

### Issue 4: Session Token Expired

**Cause**: Token is older than 24 hours
**Solution**: Re-authenticate using the test-auth endpoint

## Testing Scenarios

### Scenario 1: Complete Request Lifecycle

1. Create a request (User A)
2. Get all requests (User B)
3. Fulfill request (User B)
4. Send messages between users
5. Update request (User A)
6. Cancel request (User A)

### Scenario 2: Error Handling

1. Try to access non-existent request
2. Try to update someone else's request
3. Try to fulfill your own request
4. Try to send message without authentication

### Scenario 3: Pagination and Filtering

1. Create multiple requests with different categories
2. Test filtering by category, status, delivery city
3. Test pagination with limit and offset

## Database Setup

Before testing, ensure your database is set up:

```bash
# Start the database
npm run db:setup

# Or if using Docker
docker-compose up -d
```

## Environment Variables

Make sure these environment variables are set in your `.env.local`:

```
DATABASE_URL="postgresql://postgres:prisma@localhost:5432/postgres?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Troubleshooting

### Check if server is running

```bash
npm run dev
```

### Check database connection

```bash
npm run db:status
```

### Reset database (if needed)

```bash
npm run db:reset
```

### View database in Prisma Studio

```bash
npm run db:studio
```

## Security Notes

⚠️ **Important**: The API key authentication method is for testing purposes only. In production:

- Use proper JWT tokens with shorter expiration
- Implement rate limiting
- Add additional security measures
- Use HTTPS in production

The session tokens created by the test-auth endpoint are base64 encoded and should only be used for development/testing.

## Production Deployment Strategy

### 🔴 **Testing-Only Changes (Should NOT be in production)**

#### 1. **Test Authentication Endpoint** (`/api/test-auth`)

- **Purpose**: Creates session tokens for Postman testing
- **Why not for production**:
  - Bypasses NextAuth's security mechanisms
  - Creates base64 tokens instead of proper JWTs
  - No rate limiting or proper token validation
  - **Security risk**: Anyone can get session tokens with email/password

#### 2. **Test User Creation Script** (`scripts/create-test-users.ts`)

- **Purpose**: Creates test users with known credentials
- **Why not for production**:
  - Hardcoded credentials
  - Creates predictable test data
  - Should be removed or disabled in production

#### 3. **API Key Authentication in Middleware**

- **Purpose**: Allows `x-api-key` header for Postman testing
- **Why not for production**:
  - Bypasses NextAuth's session management
  - Less secure than proper JWT tokens
  - No proper token expiration handling
  - **Security risk**: API keys can be intercepted

### 🟢 **App-Required Changes (Should be in production)**

#### 1. **Authentication Middleware Structure** (`/lib/auth-middleware.ts`)

- **Purpose**: Centralized authentication logic
- **Why for production**:
  - Clean separation of concerns
  - Reusable across all API endpoints
  - Easier to maintain and update
  - Can be extended for different auth strategies

#### 2. **Updated API Endpoints** (like `/api/requests`)

- **Purpose**: Use the new authentication middleware
- **Why for production**:
  - More consistent authentication handling
  - Better error messages
  - Cleaner code structure
  - Easier to add new auth methods later

#### 3. **Postman Testing Guide** (`POSTMAN_TESTING_GUIDE.md`)

- **Purpose**: Documentation for API testing
- **Why for production**:
  - Helps other developers test the APIs
  - Documents API behavior and error handling
  - Useful for QA testing

### 🟡 **Conditional Changes (Depends on your needs)**

#### 1. **Enhanced Error Messages**

- The new error messages are more user-friendly
- Could be kept in production for better UX
- But not strictly required

#### 2. **Console Logging**

- Added more detailed logging for debugging
- Useful in development, should be removed in production
- Or replaced with proper logging framework

## Future Production Deployment Options

### **Option 1: Complete Removal (Recommended)**

Remove all testing-specific code entirely from production:

```bash
# Files to remove in production
- src/app/api/test-auth/route.ts
- scripts/create-test-users.ts
- API key authentication logic in auth-middleware.ts
- Console.log statements
```

**Pros**: Clean, secure, no testing code in production
**Cons**: Need to maintain separate dev/prod codebases

### **Option 2: Environment-Gated Features**

Use environment variables to conditionally enable testing features:

```typescript
// In auth-middleware.ts
if (process.env.NODE_ENV === 'development') {
  // Enable API key authentication
  const apiKey = request.headers.get('x-api-key');
  // ... API key logic
}

// In API routes
if (process.env.ENABLE_TEST_ENDPOINTS === 'true') {
  // Enable test-auth endpoint
}
```

**Pros**: Single codebase, easy to manage
**Cons**: Slightly larger production bundle

### **Option 3: Separate Testing Module**

Move all testing features to a separate module:

```typescript
// Create /src/testing/ directory
-/src/eginstt / test -
  auth.ts -
  /src/eginstt / test -
  users.ts -
  /src/eginstt / auth -
  middleware.ts;

// Import only in development
if (process.env.NODE_ENV === 'development') {
  import('./testing/auth-middleware');
}
```

**Pros**: Clean separation, easy to exclude from production builds
**Cons**: More complex build configuration

## Recommended Production Strategy

### **Keep in Production:**

```typescript
// ✅ Keep these
- /lib/auth-middleware.ts (with NextAuth only)
- Updated API endpoints using the middleware
- POSTMAN_TESTING_GUIDE.md
- Enhanced error handling
```

### **Remove/Disable in Production:**

```typescript
// ❌ Remove these
- /api/test-auth endpoint
- API key authentication in middleware
- create-test-users.ts script
- Console.log statements
```

### **Environment-Based Configuration:**

```typescript
// 🔧 Make conditional
if (process.env.NODE_ENV === 'development') {
  // Enable test endpoints and API key auth
} else {
  // Disable test endpoints, use only NextAuth
}
```

## Implementation Timeline

### **Phase 1: Development (Current)**

- ✅ All testing features enabled
- ✅ API key authentication working
- ✅ Test users available

### **Phase 2: Staging**

- 🔧 Environment-gated testing features
- 🔧 Conditional API key authentication
- 🔧 Production-like environment

### **Phase 3: Production**

- 🚀 Testing features disabled/removed
- 🚀 Only NextAuth authentication
- 🚀 Proper logging and monitoring
