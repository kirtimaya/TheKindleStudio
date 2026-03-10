# Admin Authentication Setup

## Backend Setup

### 1. Add Spring Security Dependency
The `pom.xml` has been updated to include Spring Security.

### 2. Initialize Admin Database Table
Run the following SQL script to create the `admins` table and add a default admin user:

```sql
-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (username: admin, password: admin123)
-- Password is hashed using BCrypt
INSERT INTO admins (username, password, full_name, active)
SELECT 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm', 'Admin User', TRUE
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');
```

Or if you have Supabase running locally, execute:
```bash
psql -U postgres -d postgres -c "$(cat backend/src/main/resources/init-admin.sql)"
```

### 3. New Backend Endpoints

**Login Endpoint:**
- `POST /api/admin/login`
- Request: `{ "username": "admin", "password": "admin123" }`
- Response: `{ "success": true, "adminId": "1", "username": "admin", "fullName": "Admin User" }`

**Get All Bookings (Admin):**
- `GET /api/bookings/admin/all` - Returns all bookings sorted by event date

**Get Specific Booking:**
- `GET /api/bookings/admin/{id}` - Get booking details by ID

**Update Booking:**
- `PUT /api/bookings/admin/{id}` - Update booking details and status

## Frontend Setup

### 1. Admin Login Page
- URL: `/admin/login`
- Enter credentials to authenticate

### 2. Admin Dashboard
- URL: `/admin` (Protected - requires login)
- View all bookings
- Filter by status (Pending, Confirmed, Cancelled)
- Edit booking details inline
- Change booking status
- Logout

## Default Admin Credentials

**Username:** `admin`
**Password:** `admin123`

⚠️ **Important:** Change these credentials in production!

## How to Create Additional Admin Users

Run this SQL query with your desired username/password (password must be BCrypt hashed):

```sql
INSERT INTO admins (username, password, full_name, active)
VALUES ('newadmin', '$2a$10$...', 'New Admin Name', TRUE);
```

To generate a BCrypt hash, you can use online tools or:
```bash
java -cp ":./*" org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder admin123
```

## Authentication Flow

1. Admin visits `/admin/login`
2. Enters username and password
3. System verifies credentials against the `admins` table
4. On success, session is stored in localStorage
5. Admin is redirected to `/admin` dashboard
6. Admin can now manage bookings
7. On logout, session is cleared and redirected to login page

## Logout

Click the "Logout" button in the admin dashboard to clear the session and return to the login page.
