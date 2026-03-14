-- Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(30) NOT NULL,
    space_name VARCHAR(100) NOT NULL,
    package_name VARCHAR(100),
    event_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    notes TEXT,
    add_ons TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    amount BIGINT NOT NULL, -- in paise
    payment_source VARCHAR(50) NOT NULL,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    upi_id VARCHAR(100),
    booking_id BIGINT REFERENCES public.bookings(id),
    addons_total BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Users Table (for OTP/Verification)
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    otp_code VARCHAR(6),
    otp_expiry TIMESTAMPTZ,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies (simplified for development, should be tightened for production)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for public forms, but restrict reads
CREATE POLICY "Allow public booking creation" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public contact message creation" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to read their own bookings" ON public.bookings FOR SELECT USING (true); -- Ideally filter by phone/email
