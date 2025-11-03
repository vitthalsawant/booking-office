import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Initialize database with dummy data
async function initializeDatabase() {
  // Check if tables exist and have data
  const { data: existingOffices } = await supabase
    .from('offices')
    .select('id')
    .limit(1)

  if (existingOffices && existingOffices.length > 0) {
    return // Already initialized
  }

  // Dummy offices data across all categories and locations
  const dummyOffices = [
    // Meeting Rooms
    {
      name: 'Executive Meeting Room - Connaught Place',
      type: 'meeting-room',
      location: 'Connaught Place, Delhi',
      address: 'Block A, Connaught Place, New Delhi 110001',
      latitude: 28.6315,
      longitude: 77.2167,
      base_price_per_hour: 500,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Whiteboard', 'Video Conferencing', 'Coffee/Tea', 'Air Conditioning'],
      description: 'Premium meeting room with state-of-the-art facilities in the heart of Delhi',
      capacity: 10,
      availability_status: 'available'
    },
    {
      name: 'Boardroom - BKC Mumbai',
      type: 'meeting-room',
      location: 'Bandra Kurla Complex, Mumbai',
      address: 'G Block, BKC, Mumbai 400051',
      latitude: 19.0625,
      longitude: 72.8687,
      base_price_per_hour: 600,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Video Conferencing', 'Whiteboard', 'Parking', 'Coffee/Tea'],
      description: 'Elegant boardroom perfect for client meetings and presentations',
      capacity: 12,
      availability_status: 'available'
    },
    {
      name: 'Conference Room - Indiranagar',
      type: 'meeting-room',
      location: 'Indiranagar, Bangalore',
      address: '100 Feet Road, Indiranagar, Bangalore 560038',
      latitude: 12.9716,
      longitude: 77.6412,
      base_price_per_hour: 450,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Whiteboard', 'Air Conditioning', 'Coffee/Tea'],
      description: 'Modern conference space in Bangalore\'s tech hub',
      capacity: 8,
      availability_status: 'available'
    },
    
    // Day Offices
    {
      name: 'Private Day Office - Cyber City',
      type: 'day-office',
      location: 'Cyber City, Gurgaon',
      address: 'DLF Cyber City, Gurgaon 122002',
      latitude: 28.4950,
      longitude: 77.0890,
      base_price_per_hour: 350,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Air Conditioning', 'Coffee/Tea', 'Parking'],
      description: 'Fully furnished private office available for day use',
      capacity: 4,
      availability_status: 'available'
    },
    {
      name: 'Executive Day Office - Powai',
      type: 'day-office',
      location: 'Powai, Mumbai',
      address: 'Hiranandani Business Park, Powai, Mumbai 400076',
      latitude: 19.1197,
      longitude: 72.9061,
      base_price_per_hour: 400,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Premium day office with lake view and modern amenities',
      capacity: 6,
      availability_status: 'available'
    },
    {
      name: 'Business Day Office - Whitefield',
      type: 'day-office',
      location: 'Whitefield, Bangalore',
      address: 'ITPL Main Road, Whitefield, Bangalore 560066',
      latitude: 12.9698,
      longitude: 77.7500,
      base_price_per_hour: 380,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Air Conditioning', 'Parking'],
      description: 'Professional day office in IT corridor',
      capacity: 5,
      availability_status: 'available'
    },
    
    // Day Co-working
    {
      name: 'CoWork Hub - Nehru Place',
      type: 'day-coworking',
      location: 'Nehru Place, Delhi',
      address: 'Nehru Place, New Delhi 110019',
      latitude: 28.5494,
      longitude: 77.2500,
      base_price_per_hour: 150,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Air Conditioning', 'Printer/Scanner'],
      description: 'Vibrant coworking space with hot desks and common areas',
      capacity: 50,
      availability_status: 'available'
    },
    {
      name: 'Creative CoSpace - Lower Parel',
      type: 'day-coworking',
      location: 'Lower Parel, Mumbai',
      address: 'Kamala Mills, Lower Parel, Mumbai 400013',
      latitude: 19.0095,
      longitude: 72.8295,
      base_price_per_hour: 180,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Printer/Scanner', 'Air Conditioning'],
      description: 'Trendy coworking space in Mumbai\'s creative district',
      capacity: 40,
      availability_status: 'available'
    },
    {
      name: 'Tech CoWork - Koramangala',
      type: 'day-coworking',
      location: 'Koramangala, Bangalore',
      address: '80 Feet Road, Koramangala, Bangalore 560095',
      latitude: 12.9352,
      longitude: 77.6245,
      base_price_per_hour: 160,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Startup-friendly coworking space with great community',
      capacity: 60,
      availability_status: 'available'
    },
    {
      name: 'Innovation Hub - HSR Layout',
      type: 'day-coworking',
      location: 'HSR Layout, Bangalore',
      address: 'Sector 1, HSR Layout, Bangalore 560102',
      latitude: 12.9121,
      longitude: 77.6446,
      base_price_per_hour: 140,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Printer/Scanner'],
      description: 'Modern coworking with flexible seating options',
      capacity: 35,
      availability_status: 'available'
    },
    
    // Private Offices
    {
      name: 'Premium Private Office - Saket',
      type: 'private-office',
      location: 'Saket, Delhi',
      address: 'District Centre, Saket, New Delhi 110017',
      latitude: 28.5244,
      longitude: 77.2066,
      base_price_per_hour: 700,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Whiteboard', 'Air Conditioning', 'Coffee/Tea', 'Parking'],
      description: 'Exclusive private office suite with premium furnishings',
      capacity: 10,
      availability_status: 'available'
    },
    {
      name: 'Corporate Private Office - Andheri',
      type: 'private-office',
      location: 'Andheri East, Mumbai',
      address: 'Marol, Andheri East, Mumbai 400059',
      latitude: 19.1176,
      longitude: 72.8697,
      base_price_per_hour: 650,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Printer/Scanner', 'Air Conditioning', 'Parking'],
      description: 'Sophisticated private office near airport',
      capacity: 8,
      availability_status: 'available'
    },
    {
      name: 'Deluxe Private Office - MG Road',
      type: 'private-office',
      location: 'MG Road, Bangalore',
      address: 'MG Road, Bangalore 560001',
      latitude: 12.9756,
      longitude: 77.6073,
      base_price_per_hour: 750,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Luxury private office in prime business district',
      capacity: 12,
      availability_status: 'available'
    },
    
    // Custom Offices
    {
      name: 'Custom Office Suite - Vasant Vihar',
      type: 'custom-office',
      location: 'Vasant Vihar, Delhi',
      address: 'Vasant Vihar, New Delhi 110057',
      latitude: 28.5677,
      longitude: 77.1588,
      base_price_per_hour: 800,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Printer/Scanner', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Fully customizable office space tailored to your needs',
      capacity: 15,
      availability_status: 'available'
    },
    {
      name: 'Bespoke Office - Nariman Point',
      type: 'custom-office',
      location: 'Nariman Point, Mumbai',
      address: 'Nariman Point, Mumbai 400021',
      latitude: 18.9263,
      longitude: 72.8230,
      base_price_per_hour: 900,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Printer/Scanner', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'High-end custom office with breathtaking sea views',
      capacity: 20,
      availability_status: 'available'
    },
    {
      name: 'Tailored Workspace - Electronic City',
      type: 'custom-office',
      location: 'Electronic City, Bangalore',
      address: 'Phase 1, Electronic City, Bangalore 560100',
      latitude: 12.8456,
      longitude: 77.6603,
      base_price_per_hour: 700,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Printer/Scanner', 'Air Conditioning', 'Parking'],
      description: 'Customizable workspace for tech companies',
      capacity: 18,
      availability_status: 'available'
    },
  ]

  // Insert dummy offices
  const { error } = await supabase
    .from('offices')
    .insert(dummyOffices)

  if (error) {
    console.error('Error initializing offices:', error)
  }
}

export async function GET(request) {
  const { pathname } = new URL(request.url)
  
  // Initialize database on first request
  await initializeDatabase()

  // GET /api/offices - Fetch all offices
  if (pathname === '/api/offices') {
    try {
      const { data, error } = await supabase
        .from('offices')
        .select('*')
        .order('location')

      if (error) throw error

      return NextResponse.json({ success: true, offices: data || [] })
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
  }

  // GET /api/bookings - Fetch all bookings
  if (pathname === '/api/bookings') {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return NextResponse.json({ success: true, bookings: data || [] })
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { success: false, error: 'Route not found' },
    { status: 404 }
  )
}

export async function POST(request) {
  const { pathname } = new URL(request.url)

  // POST /api/bookings - Create new booking
  if (pathname === '/api/bookings') {
    try {
      const body = await request.json()
      
      const bookingData = {
        office_id: body.officeId,
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        company_name: body.companyName || '',
        purpose: body.purpose,
        booking_date: body.bookingDate,
        start_time: body.startTime,
        end_time: body.endTime,
        total_price: body.totalPrice,
        preferred_amenities: body.amenities || [],
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()

      if (error) throw error

      return NextResponse.json({ success: true, booking: data[0] })
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { success: false, error: 'Route not found' },
    { status: 404 }
  )
}
