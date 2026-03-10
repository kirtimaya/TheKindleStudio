# The Kindle Studio - Production Deployment Guide

## Current Issue
The production application at https://the-kindle-studio.vercel.app/ cannot connect to the backend because:
1. Backend is not deployed to a production server
2. Frontend is trying to connect to `localhost:8080` which doesn't exist in production
3. `NEXT_PUBLIC_API_BASE_URL` environment variable is not configured in Vercel

## Solution

### Step 1: Deploy Backend (Spring Boot)

Choose one of these options:

#### Option A: Deploy to Render.com (Recommended - Free tier available)
1. Go to https://render.com/
2. Create account and connect GitHub
3. Create new Web Service
4. Select your GitHub repository
5. Configure:
   - Name: `the-kindle-studio-backend`
   - Runtime: `Java 17`
   - Build Command: `mvn clean install`
   - Start Command: `java -jar target/kindle-studio-backend-0.0.1-SNAPSHOT.jar`
6. Add Environment Variables:
   - `SPRING_DATASOURCE_URL`: Your PostgreSQL database URL
   - `SPRING_DATASOURCE_USERNAME`: Database username
   - `SPRING_DATASOURCE_PASSWORD`: Database password
   - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
7. Deploy and get your backend URL (e.g., `https://the-kindle-studio-backend.onrender.com`)

#### Option B: Deploy to Railway.app
1. Go to https://railway.app/
2. Connect GitHub repository
3. Add PostgreSQL plugin
4. Deploy Spring Boot application
5. Set environment variables for database connection
6. Get backend URL from Railway dashboard

#### Option C: Deploy to AWS/Azure
Use EC2 or Azure App Service for more control and scalability

### Step 2: Configure Frontend (Vercel)

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `the-kindle-studio`
3. Go to **Settings** → **Environment Variables**
4. Add new environment variable:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: Your backend URL (e.g., `https://the-kindle-studio-backend.onrender.com`)
   - **Environments**: Select Production, Preview, Development
5. Click **Save**
6. Redeploy the frontend:
   - Go to **Deployments**
   - Click the three dots on latest deployment
   - Select **Redeploy**

### Step 3: Configure Backend CORS

Update `WebCorsConfig.java` to include your production domain:

```java
@Configuration
public class WebCorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Add both development and production domains
        config.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "https://the-kindle-studio.vercel.app"  // Add your production URL
        ));
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### Step 4: Configure Production Database

If using Supabase (PostgreSQL):
1. Create a new PostgreSQL database on Supabase
2. Get connection string
3. Set environment variables in backend:
   - `SPRING_DATASOURCE_URL`: Your Supabase connection string
   - `SPRING_DATASOURCE_USERNAME`: postgres (or your username)
   - `SPRING_DATASOURCE_PASSWORD`: Your Supabase password

### Step 5: Test Functionality

After deployment:
1. Visit https://the-kindle-studio.vercel.app/
2. Click "Book Your Slot" or "My Bookings" button
3. Should connect to backend without errors
4. Test Admin Login at https://the-kindle-studio.vercel.app/admin/login

## Troubleshooting

### Still getting connection errors?
1. Check browser console (F12 → Console) for actual error messages
2. Verify backend URL is accessible: `https://your-backend-url.com/api/admin/login` (should show 404 but not connection error)
3. Check CORS headers in backend response
4. Verify database is accessible from backend server

### Environment Variables not taking effect?
1. Make sure you saved the environment variables in Vercel
2. Redeploy the frontend after adding env variables
3. Wait 2-3 minutes for deployment to complete

### Database connection errors in backend?
1. Verify database credentials are correct
2. Check if database server is accessible from deployment location
3. Ensure SSL mode is properly configured for PostgreSQL

## API Endpoints (Test in Browser/Postman)

After deployment, these should work:
- Admin Login: `POST https://your-backend.com/api/admin/login`
- Send OTP: `POST https://your-backend.com/api/users/send-otp`
- Verify OTP: `POST https://your-backend.com/api/users/verify-otp`
- Get Bookings: `GET https://your-backend.com/api/bookings/by-phone?phone=9876543210`

## Database Schema

The application automatically creates tables on first run with these entities:
- `bookings` - Booking records
- `admins` - Admin credentials
- `users` - User OTP data
- `payments` - Payment records

## Next Steps

1. Choose a backend hosting provider
2. Set up PostgreSQL database (Supabase recommended for easy setup)
3. Deploy backend with environment variables
4. Update CORS configuration with production URL
5. Set `NEXT_PUBLIC_API_BASE_URL` in Vercel
6. Redeploy frontend
7. Test all functionalities

## Support

For issues:
1. Check browser console for error messages
2. Check backend logs in your hosting provider's dashboard
3. Verify network requests in browser DevTools (F12 → Network tab)
4. Test with Postman to isolate frontend vs backend issues
