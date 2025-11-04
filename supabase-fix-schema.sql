-- =============================================
-- FIX BOOKINGS TABLE SCHEMA
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- This will ensure all required columns exist
-- =============================================

-- Check if bookings table exists and add missing columns
DO $$ 
BEGIN
  -- Add number_of_people if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'number_of_people'
  ) THEN
    ALTER TABLE bookings ADD COLUMN number_of_people INTEGER DEFAULT 1;
    RAISE NOTICE 'Added number_of_people column';
  END IF;

  -- Add start_time if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'start_time'
  ) THEN
    ALTER TABLE bookings ADD COLUMN start_time TIME;
    RAISE NOTICE 'Added start_time column';
  END IF;

  -- Add end_time if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'end_time'
  ) THEN
    ALTER TABLE bookings ADD COLUMN end_time TIME;
    RAISE NOTICE 'Added end_time column';
  END IF;

  -- Add duration_package if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'duration_package'
  ) THEN
    ALTER TABLE bookings ADD COLUMN duration_package TEXT DEFAULT 'custom';
    RAISE NOTICE 'Added duration_package column';
  END IF;

  -- Add status if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'confirmed';
    RAISE NOTICE 'Added status column';
  END IF;

  -- Add updated_at if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column';
  END IF;
END $$;

-- Update existing bookings to have default values where needed
UPDATE bookings 
SET number_of_people = COALESCE(number_of_people, 1),
    status = COALESCE(status, 'confirmed'),
    duration_package = COALESCE(duration_package, 'custom')
WHERE number_of_people IS NULL 
   OR status IS NULL 
   OR duration_package IS NULL;

-- =============================================
-- SUCCESS! Schema fixed
-- =============================================
-- All required columns should now exist
-- Refresh your app and try again
-- =============================================

