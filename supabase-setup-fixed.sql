-- =============================================
-- UPDATED SUPABASE TABLE SETUP for Office Booking Platform
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

-- Create bookings table with duration package support
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_office_id ON bookings(office_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

-- Disable Row Level Security for demo purposes
ALTER TABLE offices DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- =============================================
-- SUCCESS! Tables created successfully
-- Now your app will automatically load all offices
-- =============================================