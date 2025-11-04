-- =============================================
-- ADD number_of_people COLUMN TO EXISTING BOOKINGS TABLE
-- =============================================
-- Run this SQL in your Supabase SQL Editor if you already have a bookings table
-- (Dashboard > SQL Editor > New Query)
-- =============================================

-- Add number_of_people column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'number_of_people'
  ) THEN
    ALTER TABLE bookings ADD COLUMN number_of_people INTEGER DEFAULT 1;
  END IF;
END $$;

-- Update existing bookings to have number_of_people = 1 if NULL
UPDATE bookings 
SET number_of_people = 1 
WHERE number_of_people IS NULL;

-- =============================================
-- SUCCESS! Column added successfully
-- =============================================

