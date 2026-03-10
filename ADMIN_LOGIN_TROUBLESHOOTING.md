# Troubleshooting Guide for Admin Login

## Issue: "An error occurred. Please try again."

### 1. Check Backend is Running
```bash
# Terminal 1 - Start the backend
cd /Users/kirtimayaswain/Downloads/TheKindleStudio/backend
mvn clean install
mvn spring-boot:run
```

The backend should start on `http://localhost:8080`

### 2. Verify Database Connection
Make sure Supabase is running locally:
```bash
# Check if Supabase is running
docker ps | grep supabase
```

If not running, start it:
```bash
cd /Users/kirtimayaswain/Downloads/TheKindleStudio
supabase start
```

### 3. Check API Response
Test the login endpoint directly:
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "adminId": "1",
  "username": "admin",
  "fullName": "Admin User"
}
```

### 4. Verify Admin Table Exists
Run this in Supabase:
```sql
SELECT * FROM admins;
```

If the table doesn't exist, run:
```sql
CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (username, password, full_name, active)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm', 'Admin User', TRUE);
```

### 5. Check Browser Console
Open browser Developer Tools (F12) → Console tab and look for detailed error messages.

### 6. Check Backend Logs
Look for errors in the Spring Boot logs when you attempt to login.

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| "Failed to parse response" | Backend is returning HTML error. Check Spring Boot logs. |
| CORS error | Ensure SecurityConfig allows localhost:3000 origin. |
| 404 error | Backend not running or endpoint not registered. |
| Invalid credentials | Check that admin user exists in database. |
| No admin table | Run Flyway migration or SQL script manually. |

## Credentials
- **Username:** `admin`
- **Password:** `admin123`

## Steps to Debug

1. **Clear browser cache** - Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Hard refresh** - Ctrl+F5 (or Cmd+Shift+R on Mac)
3. **Check localhost resolves** - Try `http://127.0.0.1:3000` instead of `http://localhost:3000`
4. **Rebuild backend** - `mvn clean install`
5. **Restart both services** - Kill and restart frontend and backend
