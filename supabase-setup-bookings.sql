-- =============================================
-- ENHANCED SUPABASE SETUP for Office Booking Platform
-- With User Bookings Support
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- =============================================

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS offices CASCADE;

-- Create offices table
CREATE TABLE offices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  base_price_per_hour INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  description TEXT,
  capacity INTEGER DEFAULT 1,
  availability_status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for offices
CREATE INDEX IF NOT EXISTS idx_offices_type ON offices(type);
CREATE INDEX IF NOT EXISTS idx_offices_location ON offices(location);
CREATE INDEX IF NOT EXISTS idx_offices_availability ON offices(availability_status);

-- Create bookings table with enhanced fields for user bookings
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_id UUID REFERENCES offices(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  purpose TEXT NOT NULL,
  booking_date DATE NOT NULL,
  duration_package TEXT NOT NULL DEFAULT 'custom',
  start_time TIME,
  end_time TIME,
  total_price INTEGER NOT NULL,
  preferred_amenities TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for bookings (optimized for user queries)
CREATE INDEX IF NOT EXISTS idx_bookings_office_id ON bookings(office_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Create a composite index for efficient user booking queries
CREATE INDEX IF NOT EXISTS idx_bookings_email_date ON bookings(email, booking_date DESC);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on bookings
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for user bookings with office details (optional, for easier querying)
CREATE OR REPLACE VIEW user_bookings_view AS
SELECT 
  b.id,
  b.office_id,
  b.full_name,
  b.email,
  b.phone,
  b.company_name,
  b.purpose,
  b.booking_date,
  b.duration_package,
  b.start_time,
  b.end_time,
  b.total_price,
  b.preferred_amenities,
  b.status,
  b.created_at,
  b.updated_at,
  o.name AS office_name,
  o.type AS office_type,
  o.location AS office_location,
  o.address AS office_address,
  o.base_price_per_hour,
  o.capacity
FROM bookings b
LEFT JOIN offices o ON b.office_id = o.id
ORDER BY b.created_at DESC;

-- Disable Row Level Security for demo purposes (allows public access)
ALTER TABLE offices DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Grant permissions (if needed)
GRANT ALL ON offices TO authenticated;
GRANT ALL ON bookings TO authenticated;
GRANT ALL ON user_bookings_view TO authenticated;

-- =============================================
-- SUCCESS! Tables created successfully
-- =============================================
-- Features:
-- ✅ Offices table with all required fields
-- ✅ Bookings table with user booking support
-- ✅ Optimized indexes for fast queries
-- ✅ Email index for user-specific bookings
-- ✅ Status tracking (pending, confirmed, cancelled, completed)
-- ✅ Auto-updating updated_at timestamp
-- ✅ View for easy booking queries with office details
-- ✅ All users can view and create bookings
-- =============================================
-- 
-- Next steps:
-- 1. The app will automatically populate offices via API
-- 2. Users can create bookings which will be saved to this table
-- 3. "My Bookings" will fetch all bookings from this table
-- 4. Bookings can be filtered by email if needed
-- =============================================

