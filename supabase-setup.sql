-- =============================================
-- SUPABASE TABLE SETUP for Office Booking Platform
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- =============================================

-- Create offices table
CREATE TABLE IF NOT EXISTS offices (
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

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  office_id UUID REFERENCES offices(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  purpose TEXT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price INTEGER NOT NULL,
  preferred_amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_office_id ON bookings(office_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

-- Enable Row Level Security (RLS)
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to offices
CREATE POLICY "Allow public read access to offices"
  ON offices FOR SELECT
  USING (true);

-- Create policies for public insert access to bookings
CREATE POLICY "Allow public insert access to bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Create policies for public read access to bookings
CREATE POLICY "Allow public read access to bookings"
  ON bookings FOR SELECT
  USING (true);

-- =============================================
-- SUCCESS! Tables created successfully
-- Now refresh your app to load dummy data
-- =============================================
