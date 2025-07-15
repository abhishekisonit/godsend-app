# Scripts

This directory contains utility scripts for the Godsend application.

## ⚠️ PRODUCTION EXCLUSION NOTICE

**These scripts are for DEVELOPMENT and TESTING purposes only. They should NEVER be used in production environments.**

### Why Exclude from Production?

1. **Security Risk**: Scripts contain hardcoded test credentials
2. **Data Pollution**: Creates fake/sample data that could interfere with real user data
3. **Performance Impact**: Bulk operations could overwhelm production systems
4. **Compliance Issues**: Test data might violate data protection regulations

### Production Deployment Checklist

- [ ] Remove or exclude `scripts/` directory from production builds
- [ ] Ensure no test endpoints are accessible in production
- [ ] Verify no hardcoded credentials exist in production code
- [ ] Disable test authentication endpoints in production
- [ ] Add environment checks to prevent script execution in production

### Environment-Specific Usage

```bash
# Development (safe to use)
NODE_ENV=development npm run create-sample-requests

# Production (will be blocked)
NODE_ENV=production npm run create-sample-requests  # ❌ BLOCKED
```

## Available Scripts

### Database Setup

- `setup-database.ts` - Initialize and manage the database
- `create-test-users.ts` - Create test users for development

### Sample Data

- `create-sample-requests.ts` - Create sample requests for testing
- `update-request-statuses.ts` - Update request statuses for UI testing
- `delete-all-requests.ts` - Delete all requests for testing
- `generate-api-key.ts` - Generate API keys for testing

## Usage

### Create Sample Requests

This script creates sample requests via the API to populate your database with test data.

#### Prerequisites

1. Make sure your development server is running (`npm run dev`)
2. The database should be set up and running
3. Ensure you're in development environment
4. **Create test users first**: `npm run create-test-users`
5. **Create sample requests first**: `npm run create-sample-requests`

#### Running the Script

**Simple usage (automatic authentication):**

```bash
# Create 50 sample requests (default)
npm run create-sample-requests

# Create a specific number of requests
npm run create-sample-requests 25
```

**What the script does automatically:**

1. ✅ Verifies test users exist (requires `npm run create-test-users` first)
2. ✅ Authenticates using test credentials (`testuser1@example.com` / `password123`)
3. ✅ Generates API key automatically
4. ✅ Creates sample requests with realistic data
5. ✅ Provides detailed progress and results
6. ✅ **Invalidates session token for security**
7. ✅ **Clears all sensitive data from memory**
8. ✅ **Ensures no authentication holes remain**

#### Sample Data Generated

The script generates realistic sample requests with:

- **Categories**: Food, Medicine, Clothing, Electronics, Books, Other
- **Source Cities**: Indian cities (Mumbai, Delhi, Bangalore, etc.)
- **Delivery Cities**: International cities (New York, London, Toronto, etc.)
- **Items**: Category-specific items (e.g., "Homemade Biryani" for Food)
- **Quantities**: 1-10 items
- **Estimated Values**: Realistic pricing based on category
- **Due Dates**: Random future dates within 30 days

#### Output

The script provides detailed feedback:

- Progress updates for each request
- Summary of successful vs failed requests
- Detailed error messages for failed requests
- Total execution time

#### Example Output

```
⚠️  DEVELOPMENT ONLY: This script creates test data and should not be used in production!
📖 See README.md for production exclusion guidelines.

🔒 Clearing existing API_KEY from environment for security

🚀 Starting sample requests creation with automatic authentication...
👥 Creating test users...
✅ User testuser1@example.com exists and can authenticate
🔐 Authenticating with email: testuser1@example.com
✅ Authentication successful for testuser1@example.com

📋 Using API key for authentication
==================================================

📝 Creating 50 sample requests...
Creating request 1/50: Need Homemade Biryani from Mumbai
Creating request 2/50: Need Traditional Saree from Delhi
...
=== Results ===
Successful: 48
Failed: 2

🧹 Cleaning up session and sensitive data...
✅ Session invalidated successfully
✅ Sensitive data cleared from memory
✅ Session cleanup completed

🎉 Sample requests creation completed!
🔒 All sessions and sensitive data have been cleaned up
```

### Update Request Statuses

This script updates existing requests with different statuses to create variety for UI testing.

#### Prerequisites

1. Make sure your development server is running (`npm run dev`)
2. The database should be set up and running
3. Ensure you're in development environment
4. **Create test users first**: `npm run create-test-users`
5. **Create sample requests first**: `npm run create-sample-requests`

#### Running the Script

```bash
# Update statuses of existing requests
npm run update-request-statuses
```

**What the script does:**

1. ✅ Authenticates using test credentials
2. ✅ Fetches all existing requests
3. ✅ Updates request statuses with realistic distribution:
   - 40% OPEN (default state)
   - 30% IN_PROGRESS (being fulfilled)
   - 20% COMPLETED (successfully delivered)
   - 10% CANCELLED (cancelled by user)
4. ✅ Provides detailed progress and results
5. ✅ **Invalidates session token for security**
6. ✅ **Clears all sensitive data from memory**

#### Status Distribution

The script creates a realistic distribution of request statuses:

- **OPEN**: 40% - New requests waiting for fulfillment
- **IN_PROGRESS**: 30% - Requests being actively fulfilled
- **COMPLETED**: 20% - Successfully completed requests
- **CANCELLED**: 10% - Cancelled requests

This distribution provides good coverage for testing all UI states and filters.

#### Example Output

```
🚀 Starting request status updates for UI testing...
🔐 Authenticating with email: testuser1@example.com
✅ Authentication successful for testuser1@example.com

📋 Using API key for authentication
==================================================

📝 Fetching existing requests...
Found 50 requests to update

🔄 Updating request statuses for UI testing...
✅ Updated request "Need Homemade Biryani from Mumbai" to OPEN
✅ Updated request "Need Traditional Saree from Delhi" to IN_PROGRESS
✅ Updated request "Need Mobile Phone from Bangalore" to COMPLETED
...

=== Results ===
Successful updates: 50
Failed updates: 0

Status Distribution:
- OPEN: 20 requests
- IN_PROGRESS: 15 requests
- COMPLETED: 10 requests
- CANCELLED: 5 requests

🧹 Cleaning up session and sensitive data...
✅ Session invalidated successfully
✅ Sensitive data cleared from memory
✅ Session cleanup completed

🎉 Request status updates completed!
🔒 All sessions and sensitive data have been cleaned up
```

### Delete All Requests

This script deletes all existing requests from the database. Useful for resetting the database state during development and testing.

#### Prerequisites

1. Make sure your development server is running (`npm run dev`)
2. The database should be set up and running
3. Ensure you're in development environment
4. **Create test users first**: `npm run create-test-users`

#### Running the Script

```bash
# Delete all requests (with confirmation)
npm run delete-all-requests
```

**What the script does:**

1. ✅ Authenticates using test credentials
2. ✅ Fetches all existing requests
3. ✅ Shows confirmation warning with 5-second delay
4. ✅ Deletes all requests with progress tracking
5. ✅ Provides detailed results and error handling
6. ✅ **Invalidates session token for security**
7. ✅ **Clears all sensitive data from memory**

#### Safety Features

- **Confirmation Delay**: 5-second delay to allow cancellation (Ctrl+C)
- **Progress Tracking**: Shows which request is being deleted
- **Error Handling**: Continues even if some deletions fail
- **Production Blocked**: Cannot run in production environment
- **Detailed Logging**: Shows exactly what's being deleted

#### Use Cases

- **Reset Database**: Clean slate for fresh testing
- **Development Cycles**: Remove old test data
- **UI Testing**: Start with empty state
- **Performance Testing**: Clear database for load tests

#### Example Output

```
🚀 Starting deletion of all requests...
🔐 Authenticating with email: testuser1@example.com
✅ Authentication successful for testuser1@example.com

📋 Using API key for authentication
==================================================

📝 Fetching existing requests...
Found 50 requests to delete

⚠️  WARNING: This will delete ALL 50 requests!
This action cannot be undone.
Press Ctrl+C to cancel, or wait 5 seconds to continue...

🗑️  Deleting all requests...
Deleting request 1/50: "Need Homemade Biryani from Mumbai" (OPEN)
Deleting request 2/50: "Need Traditional Saree from Delhi" (IN_PROGRESS)
Deleting request 3/50: "Need Mobile Phone from Bangalore" (COMPLETED)
...

=== Results ===
Successfully deleted: 48
Failed to delete: 2

✅ Successfully deleted 48 requests
🗄️  Database is now clean and ready for fresh test data

🧹 Cleaning up session and sensitive data...
✅ Session invalidated successfully
✅ Sensitive data cleared from memory
✅ Session cleanup completed

🎉 Request deletion completed!
🔒 All sessions and sensitive data have been cleaned up
```

#### Complete Development Workflow

Here's the complete workflow for managing test data:

```bash
# 1. Set up database and users
npm run db:setup
npm run create-test-users

# 2. Create fresh test data
npm run create-sample-requests

# 3. Update statuses for UI testing
npm run update-request-statuses

# 4. When you want to start fresh
npm run delete-all-requests

# 5. Repeat from step 2 for new test data
npm run create-sample-requests
npm run update-request-statuses
```

This gives you complete control over your test data lifecycle!

#### Error Handling

The script handles various error scenarios:

- Network connectivity issues
- Authentication failures
- Invalid data format
- Server errors

Failed requests are logged but don't stop the script execution.

#### Customization

You can modify the script to:

- Add more categories or items
- Change the source/delivery cities
- Adjust pricing ranges
- Modify the request descriptions
- Add more realistic data patterns

The script is designed to be easily extensible for different testing scenarios.

## Security Considerations

### Test Credentials

The script uses hardcoded test credentials:

- Email: `test@example.com`
- Password: `password123`

**Never use these credentials in production!**

### API Key Security

- API keys are generated for testing only
- Keys expire after 24 hours
- Keys should never be committed to version control

### Environment Variables

- No sensitive environment variables required
- Script handles authentication internally
- Safe for development environments

## Troubleshooting

### Common Issues

1. **Server not running:**

   ```bash
   npm run dev  # Start development server first
   ```

2. **Database not set up:**

   ```bash
   npm run db:setup  # Set up database first
   ```

3. **Authentication failed:**

   ```bash
   npm run create-test-users  # Create test users first
   ```

4. **Port conflicts:**
   ```bash
   # Check if port 3000 is available
   netstat -ano | findstr :3000
   ```

### Debug Mode

For detailed debugging, check the server logs:

```bash
# In another terminal
npm run dev
# Watch for authentication and API call logs
```
