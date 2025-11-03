const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function setupTables() {
  console.log('Setting up Supabase tables...')
  
  // Note: Tables need to be created via Supabase dashboard or SQL
  // This script will verify and provide instructions
  
  try {
    // Test offices table
    console.log('\nChecking offices table...')
    const { data: officesData, error: officesError } = await supabase
      .from('offices')
      .select('*')
      .limit(1)
    
    if (officesError) {
      console.error('❌ Offices table error:', officesError.message)
      console.log('\n📋 Please create the offices table with this SQL in Supabase SQL Editor:')
      console.log(`
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

CREATE INDEX IF NOT EXISTS idx_offices_type ON offices(type);
CREATE INDEX IF NOT EXISTS idx_offices_location ON offices(location);
      `)
    } else {
      console.log('✅ Offices table exists')
    }
    
    // Test bookings table
    console.log('\nChecking bookings table...')
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1)
    
    if (bookingsError) {
      console.error('❌ Bookings table error:', bookingsError.message)
      console.log('\n📋 Please create the bookings table with this SQL in Supabase SQL Editor:')
      console.log(`
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

CREATE INDEX IF NOT EXISTS idx_bookings_office_id ON bookings(office_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
      `)
    } else {
      console.log('✅ Bookings table exists')
    }
    
    console.log('\n✨ Setup check complete!')
    console.log('\nTo create tables:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Run the SQL statements shown above')
    
  } catch (error) {
    console.error('Error during setup:', error)
  }
}

setupTables()
