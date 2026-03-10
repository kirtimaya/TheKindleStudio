# Quick Start Guide - Payment & OTP System

## Prerequisites
- Backend running: `mvn spring-boot:run` (http://localhost:8080)
- Frontend running: `pnpm dev` (http://localhost:3000)
- PostgreSQL/Supabase running on port 54322

## Testing the Features

### 1. Test Add-ons Display
1. Navigate to `http://localhost:3000/book`
2. Scroll to add-ons section for both spaces
3. Add-ons items should display with orange gradient background (since actual images aren't present)
4. Click add-ons to select them
5. Summary should show selected items and total price

### 2. Test User OTP Login
1. Click **Login** button in navigation
2. Enter any 10-digit phone number (e.g., 9876543210)
3. Click **Send OTP**
4. An alert will show the test OTP (e.g., 123456)
5. Enter the OTP in the verification field
6. Click **Verify OTP**
7. Redirects to home page with user session
8. Navigation now shows masked phone number and **Logout** button

### 3. Test Payment Flow
1. Go to `/book` page
2. Select add-ons (optional)
3. Select a date and time slot
4. Click **Book This Space**
5. Fill in booking details:
   - Name
   - Phone number
   - Event date (should auto-populate)
   - Time slot (should auto-populate)
6. Click **Book Now** button
7. Redirected to `/payment` page with:
   - Phone number filled in
   - Booking ID and space name in summary
   - Amount and add-ons total calculated

### 4. Test Payment Methods

#### Card Payment:
1. Select **Debit / Credit Card**
2. Enter test card details:
   - **Card Holder Name**: Any name
   - **Card Number**: 4532 1111 1111 1111 (Visa)
   - **Expiry**: Any future date (12/25)
   - **CVV**: Any 3 digits (123)
3. Click **Pay ₹XXXX**
4. Wait for 2-second processing
5. Redirected to `/payment-success` page with:
   - Order ID (ORD-{timestamp}-{uuid})
   - Confirmation details
   - Next steps
   - Download receipt button

#### UPI Payment:
1. Select **UPI**
2. Enter UPI ID: `demo@okhdfcbank`
3. Click **Pay ₹XXXX**
4. Same success flow as card payment

### 5. Test Payment Success Page
- View order ID
- See next steps
- Click **Download Receipt** to save receipt as text file
- Click **Back to Home** to return to landing page

### 6. Admin Panel (Unchanged)
- Still available at `/admin/login`
- Credentials: admin / admin123
- View and manage all bookings

## Database Tables Auto-Created

The following tables will be created automatically on first run:

```sql
-- Users table for OTP authentication
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    otp_code VARCHAR(6),
    otp_expiry TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Payments table for order tracking
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    amount BIGINT NOT NULL,
    payment_source VARCHAR(50) NOT NULL,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    upi_id VARCHAR(100),
    booking_id BIGINT,
    addons_total BIGINT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

## API Testing with curl/Postman

### Send OTP
```bash
curl -X POST http://localhost:8080/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210"}'
```

Response:
```json
{
  "success": true,
  "message": "OTP sent to 9876543210. For demo purposes, OTP is: 123456"
}
```

### Verify OTP
```bash
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210","otp":"123456"}'
```

Response:
```json
{
  "success": true,
  "message": "OTP verified successfully!",
  "phoneNumber": "9876543210"
}
```

### Create Payment
```bash
curl -X POST http://localhost:8080/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "amount": 500000,
    "paymentSource": "CARD",
    "cardLastFour": "1111",
    "cardBrand": "VISA",
    "bookingId": 1,
    "addonsTotal": 200000
  }'
```

Response:
```json
{
  "orderId": "ORD-1704067200000-ABC12345",
  "phoneNumber": "9876543210",
  "amount": 500000,
  "paymentSource": "CARD",
  "status": "PENDING",
  "createdAt": "2024-03-08T12:00:00Z"
}
```

### Complete Payment
```bash
curl -X PUT http://localhost:8080/api/payments/ORD-1704067200000-ABC12345/complete
```

## Troubleshooting

### OTP Not Appearing:
- Check browser console for alerts
- OTP is shown in JavaScript alert() for demo purposes
- In production, integrate with SMS service (Twilio, AWS SNS)

### Payment Not Processing:
- Ensure backend is running on localhost:8080
- Check that CORS is enabled in SecurityConfig
- Verify `application.yml` has correct database configuration

### Images Not Showing in Add-ons:
- This is expected - images are displayed as gradient backgrounds with text
- Images will display once actual image files are added to `/public/images/`

### User Session Not Persisting:
- Check that localStorage is not disabled in browser
- Clear browser cache and try again
- Ensure you're on the same domain (localhost:3000)

## Feature Highlights

### ✨ Payment Gateway Features
- 🔒 Secure form with validation
- 💳 Support for Card and UPI
- 📱 Mobile-friendly payment form
- 🎯 Order summary sidebar
- ✅ Payment status tracking
- 📥 Order ID generation
- 📜 Receipt generation

### 🔐 OTP Authentication Features
- 📱 Phone number verification
- ⏱️ 10-minute OTP validity with countdown
- 🔄 Resend OTP functionality
- 📊 User session management
- 🔓 Logout capability
- ✨ Seamless integration with booking flow

### 📊 Integration Features
- Booking → Payment seamless flow
- Order tracking with order ID
- Add-ons total calculation
- User authentication integration
- Navigation updates with user state
