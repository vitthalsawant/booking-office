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

  // Comprehensive dummy offices data - All categories for every major location
  const dummyOffices = [
    // ========== DELHI - Meeting Rooms ==========
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
      name: 'Conference Center - Nehru Place',
      type: 'meeting-room',
      location: 'Nehru Place, Delhi',
      address: 'Nehru Place, New Delhi 110019',
      latitude: 28.5494,
      longitude: 77.2500,
      base_price_per_hour: 450,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Whiteboard', 'Video Conferencing', 'Coffee/Tea'],
      description: 'Modern meeting space in Delhi business hub',
      capacity: 8,
      availability_status: 'available'
    },
    {
      name: 'Boardroom - Saket',
      type: 'meeting-room',
      location: 'Saket, Delhi',
      address: 'District Centre, Saket, New Delhi 110017',
      latitude: 28.5244,
      longitude: 77.2066,
      base_price_per_hour: 480,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Video Conferencing', 'Whiteboard', 'Coffee/Tea', 'Parking'],
      description: 'Professional boardroom for executive meetings',
      capacity: 12,
      availability_status: 'available'
    },
    {
      name: 'Meeting Suite - Vasant Vihar',
      type: 'meeting-room',
      location: 'Vasant Vihar, Delhi',
      address: 'Vasant Vihar, New Delhi 110057',
      latitude: 28.5677,
      longitude: 77.1588,
      base_price_per_hour: 520,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Whiteboard', 'Video Conferencing', 'Coffee/Tea', 'Air Conditioning'],
      description: 'Elegant meeting space in upscale neighborhood',
      capacity: 10,
      availability_status: 'available'
    },

    // ========== DELHI - Day Offices ==========
    {
      name: 'Day Office - Connaught Place',
      type: 'day-office',
      location: 'Connaught Place, Delhi',
      address: 'Inner Circle, Connaught Place, New Delhi 110001',
      latitude: 28.6320,
      longitude: 77.2190,
      base_price_per_hour: 380,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Air Conditioning', 'Coffee/Tea'],
      description: 'Convenient day office in central Delhi',
      capacity: 5,
      availability_status: 'available'
    },
    {
      name: 'Business Day Office - Saket',
      type: 'day-office',
      location: 'Saket, Delhi',
      address: 'Select Citywalk, Saket, New Delhi 110017',
      latitude: 28.5250,
      longitude: 77.2070,
      base_price_per_hour: 360,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Coffee/Tea', 'Parking'],
      description: 'Day office near shopping district',
      capacity: 4,
      availability_status: 'available'
    },

    // ========== DELHI - Day Co-working ==========
    {
      name: 'CoWork Hub - Nehru Place',
      type: 'day-coworking',
      location: 'Nehru Place, Delhi',
      address: 'Nehru Place, New Delhi 110019',
      latitude: 28.5494,
      longitude: 77.2500,
      base_price_per_hour: 150,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Air Conditioning', 'Printer/Scanner'],
      description: 'Vibrant coworking space with hot desks',
      capacity: 50,
      availability_status: 'available'
    },
    {
      name: 'Startup Space - Connaught Place',
      type: 'day-coworking',
      location: 'Connaught Place, Delhi',
      address: 'Outer Circle, Connaught Place, New Delhi 110001',
      latitude: 28.6340,
      longitude: 77.2200,
      base_price_per_hour: 170,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Printer/Scanner', 'Air Conditioning'],
      description: 'Collaborative workspace for entrepreneurs',
      capacity: 40,
      availability_status: 'available'
    },

    // ========== DELHI - Private Offices ==========
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
      name: 'Executive Office - Connaught Place',
      type: 'private-office',
      location: 'Connaught Place, Delhi',
      address: 'Connaught Place, New Delhi 110001',
      latitude: 28.6328,
      longitude: 77.2185,
      base_price_per_hour: 750,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Printer/Scanner', 'Whiteboard', 'Coffee/Tea', 'Air Conditioning'],
      description: 'Prime private office in Delhi\'s business center',
      capacity: 12,
      availability_status: 'available'
    },

    // ========== DELHI - Custom Offices ==========
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
      name: 'Tailored Workspace - Nehru Place',
      type: 'custom-office',
      location: 'Nehru Place, Delhi',
      address: 'Nehru Place Complex, New Delhi 110019',
      latitude: 28.5500,
      longitude: 77.2510,
      base_price_per_hour: 720,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Printer/Scanner', 'Air Conditioning'],
      description: 'Custom designed workspace for growing businesses',
      capacity: 14,
      availability_status: 'available'
    },

    // ========== MUMBAI - Meeting Rooms ==========
    {
      name: 'Boardroom - BKC Mumbai',
      type: 'meeting-room',
      location: 'Bandra Kurla Complex, Mumbai',
      address: 'G Block, BKC, Mumbai 400051',
      latitude: 19.0625,
      longitude: 72.8687,
      base_price_per_hour: 600,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Video Conferencing', 'Whiteboard', 'Parking', 'Coffee/Tea'],
      description: 'Elegant boardroom perfect for client meetings',
      capacity: 12,
      availability_status: 'available'
    },
    {
      name: 'Conference Room - Lower Parel',
      type: 'meeting-room',
      location: 'Lower Parel, Mumbai',
      address: 'Kamala Mills, Lower Parel, Mumbai 400013',
      latitude: 19.0095,
      longitude: 72.8295,
      base_price_per_hour: 550,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Whiteboard', 'Video Conferencing', 'Coffee/Tea', 'Air Conditioning'],
      description: 'Modern conference space in creative district',
      capacity: 10,
      availability_status: 'available'
    },
    {
      name: 'Meeting Hub - Andheri',
      type: 'meeting-room',
      location: 'Andheri East, Mumbai',
      address: 'Marol, Andheri East, Mumbai 400059',
      latitude: 19.1176,
      longitude: 72.8697,
      base_price_per_hour: 480,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Whiteboard', 'Coffee/Tea', 'Parking'],
      description: 'Professional meeting space near airport',
      capacity: 8,
      availability_status: 'available'
    },
    {
      name: 'Executive Boardroom - Powai',
      type: 'meeting-room',
      location: 'Powai, Mumbai',
      address: 'Hiranandani Business Park, Powai, Mumbai 400076',
      latitude: 19.1197,
      longitude: 72.9061,
      base_price_per_hour: 520,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Video Conferencing', 'Whiteboard', 'Coffee/Tea', 'Air Conditioning'],
      description: 'Lakeside meeting room with premium amenities',
      capacity: 10,
      availability_status: 'available'
    },

    // ========== MUMBAI - Day Offices ==========
    {
      name: 'Executive Day Office - Powai',
      type: 'day-office',
      location: 'Powai, Mumbai',
      address: 'Hiranandani Business Park, Powai, Mumbai 400076',
      latitude: 19.1197,
      longitude: 72.9061,
      base_price_per_hour: 400,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Premium day office with lake view',
      capacity: 6,
      availability_status: 'available'
    },
    {
      name: 'Business Office - BKC',
      type: 'day-office',
      location: 'Bandra Kurla Complex, Mumbai',
      address: 'BKC, Mumbai 400051',
      latitude: 19.0630,
      longitude: 72.8700,
      base_price_per_hour: 420,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Air Conditioning', 'Coffee/Tea', 'Parking'],
      description: 'Professional day office in business district',
      capacity: 5,
      availability_status: 'available'
    },
    {
      name: 'Day Office - Andheri',
      type: 'day-office',
      location: 'Andheri East, Mumbai',
      address: 'Andheri East, Mumbai 400059',
      latitude: 19.1180,
      longitude: 72.8700,
      base_price_per_hour: 370,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Coffee/Tea', 'Parking'],
      description: 'Convenient day office near metro',
      capacity: 4,
      availability_status: 'available'
    },

    // ========== MUMBAI - Day Co-working ==========
    {
      name: 'Creative CoSpace - Lower Parel',
      type: 'day-coworking',
      location: 'Lower Parel, Mumbai',
      address: 'Kamala Mills, Lower Parel, Mumbai 400013',
      latitude: 19.0095,
      longitude: 72.8295,
      base_price_per_hour: 180,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Printer/Scanner', 'Air Conditioning'],
      description: 'Trendy coworking space in creative district',
      capacity: 40,
      availability_status: 'available'
    },
    {
      name: 'BKC CoWork Space',
      type: 'day-coworking',
      location: 'Bandra Kurla Complex, Mumbai',
      address: 'BKC, Mumbai 400051',
      latitude: 19.0635,
      longitude: 72.8710,
      base_price_per_hour: 190,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Printer/Scanner', 'Air Conditioning', 'Parking'],
      description: 'Premium coworking in financial hub',
      capacity: 45,
      availability_status: 'available'
    },
    {
      name: 'Startup Hub - Powai',
      type: 'day-coworking',
      location: 'Powai, Mumbai',
      address: 'Powai, Mumbai 400076',
      latitude: 19.1200,
      longitude: 72.9070,
      base_price_per_hour: 160,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Printer/Scanner'],
      description: 'Community-focused coworking space',
      capacity: 35,
      availability_status: 'available'
    },

    // ========== MUMBAI - Private Offices ==========
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
      name: 'Premium Office - BKC',
      type: 'private-office',
      location: 'Bandra Kurla Complex, Mumbai',
      address: 'BKC, Mumbai 400051',
      latitude: 19.0640,
      longitude: 72.8720,
      base_price_per_hour: 780,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Printer/Scanner', 'Coffee/Tea', 'Parking'],
      description: 'Luxury private office in prime location',
      capacity: 10,
      availability_status: 'available'
    },

    // ========== MUMBAI - Custom Offices ==========
    {
      name: 'Bespoke Office - Nariman Point',
      type: 'custom-office',
      location: 'Nariman Point, Mumbai',
      address: 'Nariman Point, Mumbai 400021',
      latitude: 18.9263,
      longitude: 72.8230,
      base_price_per_hour: 900,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Printer/Scanner', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'High-end custom office with sea views',
      capacity: 20,
      availability_status: 'available'
    },
    {
      name: 'Custom Workspace - Lower Parel',
      type: 'custom-office',
      location: 'Lower Parel, Mumbai',
      address: 'Lower Parel, Mumbai 400013',
      latitude: 19.0100,
      longitude: 72.8310,
      base_price_per_hour: 820,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Printer/Scanner', 'Air Conditioning'],
      description: 'Customizable office in trendy area',
      capacity: 16,
      availability_status: 'available'
    },

    // ========== BANGALORE - Meeting Rooms ==========
    {
      name: 'Conference Room - Indiranagar',
      type: 'meeting-room',
      location: 'Indiranagar, Bangalore',
      address: '100 Feet Road, Indiranagar, Bangalore 560038',
      latitude: 12.9716,
      longitude: 77.6412,
      base_price_per_hour: 450,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Whiteboard', 'Air Conditioning', 'Coffee/Tea'],
      description: 'Modern conference space in tech hub',
      capacity: 8,
      availability_status: 'available'
    },
    {
      name: 'Meeting Room - Koramangala',
      type: 'meeting-room',
      location: 'Koramangala, Bangalore',
      address: '80 Feet Road, Koramangala, Bangalore 560095',
      latitude: 12.9352,
      longitude: 77.6245,
      base_price_per_hour: 480,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Video Conferencing', 'Whiteboard', 'Coffee/Tea', 'Air Conditioning'],
      description: 'Professional meeting space in startup hub',
      capacity: 10,
      availability_status: 'available'
    },
    {
      name: 'Boardroom - Whitefield',
      type: 'meeting-room',
      location: 'Whitefield, Bangalore',
      address: 'ITPL Main Road, Whitefield, Bangalore 560066',
      latitude: 12.9698,
      longitude: 77.7500,
      base_price_per_hour: 460,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Whiteboard', 'Video Conferencing', 'Coffee/Tea', 'Parking'],
      description: 'Executive boardroom in IT corridor',
      capacity: 12,
      availability_status: 'available'
    },
    {
      name: 'Conference Center - MG Road',
      type: 'meeting-room',
      location: 'MG Road, Bangalore',
      address: 'MG Road, Bangalore 560001',
      latitude: 12.9756,
      longitude: 77.6073,
      base_price_per_hour: 520,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Video Conferencing', 'Whiteboard', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Premium conference room in city center',
      capacity: 14,
      availability_status: 'available'
    },

    // ========== BANGALORE - Day Offices ==========
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
    {
      name: 'Day Office - Koramangala',
      type: 'day-office',
      location: 'Koramangala, Bangalore',
      address: 'Koramangala, Bangalore 560095',
      latitude: 12.9360,
      longitude: 77.6250,
      base_price_per_hour: 360,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Coffee/Tea', 'Air Conditioning'],
      description: 'Convenient day office in startup district',
      capacity: 4,
      availability_status: 'available'
    },
    {
      name: 'Executive Office - MG Road',
      type: 'day-office',
      location: 'MG Road, Bangalore',
      address: 'MG Road, Bangalore 560001',
      latitude: 12.9760,
      longitude: 77.6080,
      base_price_per_hour: 400,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Premium day office in business district',
      capacity: 6,
      availability_status: 'available'
    },

    // ========== BANGALORE - Day Co-working ==========
    {
      name: 'Tech CoWork - Koramangala',
      type: 'day-coworking',
      location: 'Koramangala, Bangalore',
      address: '80 Feet Road, Koramangala, Bangalore 560095',
      latitude: 12.9352,
      longitude: 77.6245,
      base_price_per_hour: 160,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Startup-friendly coworking space',
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
      description: 'Modern coworking with flexible seating',
      capacity: 35,
      availability_status: 'available'
    },
    {
      name: 'CoWork Space - Whitefield',
      type: 'day-coworking',
      location: 'Whitefield, Bangalore',
      address: 'Whitefield, Bangalore 560066',
      latitude: 12.9700,
      longitude: 77.7510,
      base_price_per_hour: 150,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Printer/Scanner', 'Air Conditioning', 'Parking'],
      description: 'Tech-focused coworking space',
      capacity: 50,
      availability_status: 'available'
    },
    {
      name: 'Startup Space - Indiranagar',
      type: 'day-coworking',
      location: 'Indiranagar, Bangalore',
      address: 'Indiranagar, Bangalore 560038',
      latitude: 12.9720,
      longitude: 77.6420,
      base_price_per_hour: 155,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Printer/Scanner', 'Air Conditioning'],
      description: 'Vibrant coworking community',
      capacity: 42,
      availability_status: 'available'
    },

    // ========== BANGALORE - Private Offices ==========
    {
      name: 'Deluxe Private Office - MG Road',
      type: 'private-office',
      location: 'MG Road, Bangalore',
      address: 'MG Road, Bangalore 560001',
      latitude: 12.9756,
      longitude: 77.6073,
      base_price_per_hour: 750,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Luxury private office in prime location',
      capacity: 12,
      availability_status: 'available'
    },
    {
      name: 'Premium Office - Koramangala',
      type: 'private-office',
      location: 'Koramangala, Bangalore',
      address: 'Koramangala, Bangalore 560095',
      latitude: 12.9358,
      longitude: 77.6252,
      base_price_per_hour: 680,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Printer/Scanner', 'Whiteboard', 'Coffee/Tea', 'Air Conditioning'],
      description: 'Modern private office for tech teams',
      capacity: 10,
      availability_status: 'available'
    },
    {
      name: 'Executive Office - Whitefield',
      type: 'private-office',
      location: 'Whitefield, Bangalore',
      address: 'Whitefield, Bangalore 560066',
      latitude: 12.9705,
      longitude: 77.7515,
      base_price_per_hour: 670,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Printer/Scanner', 'Air Conditioning', 'Parking'],
      description: 'Professional office in IT park',
      capacity: 9,
      availability_status: 'available'
    },

    // ========== BANGALORE - Custom Offices ==========
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
    {
      name: 'Custom Suite - Koramangala',
      type: 'custom-office',
      location: 'Koramangala, Bangalore',
      address: 'Koramangala, Bangalore 560095',
      latitude: 12.9365,
      longitude: 77.6258,
      base_price_per_hour: 750,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Printer/Scanner', 'Coffee/Tea', 'Air Conditioning'],
      description: 'Fully customizable startup office',
      capacity: 16,
      availability_status: 'available'
    },

    // ========== GURGAON - All Categories ==========
    {
      name: 'Executive Meeting Room - Cyber City',
      type: 'meeting-room',
      location: 'Cyber City, Gurgaon',
      address: 'DLF Cyber City, Gurgaon 122002',
      latitude: 28.4950,
      longitude: 77.0890,
      base_price_per_hour: 490,
      amenities: ['High-Speed Wi-Fi', 'Projector', 'Video Conferencing', 'Whiteboard', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Modern meeting room in corporate hub',
      capacity: 10,
      availability_status: 'available'
    },
    {
      name: 'Private Day Office - Cyber City',
      type: 'day-office',
      location: 'Cyber City, Gurgaon',
      address: 'DLF Cyber City, Gurgaon 122002',
      latitude: 28.4950,
      longitude: 77.0890,
      base_price_per_hour: 350,
      amenities: ['High-Speed Wi-Fi', 'Printer/Scanner', 'Air Conditioning', 'Coffee/Tea', 'Parking'],
      description: 'Fully furnished private office',
      capacity: 4,
      availability_status: 'available'
    },
    {
      name: 'Cyber Hub CoWork',
      type: 'day-coworking',
      location: 'Cyber City, Gurgaon',
      address: 'Cyber Hub, Gurgaon 122002',
      latitude: 28.4955,
      longitude: 77.0895,
      base_price_per_hour: 165,
      amenities: ['High-Speed Wi-Fi', 'Coffee/Tea', 'Printer/Scanner', 'Air Conditioning', 'Parking'],
      description: 'Professional coworking in corporate area',
      capacity: 48,
      availability_status: 'available'
    },
    {
      name: 'Corporate Office - Cyber City',
      type: 'private-office',
      location: 'Cyber City, Gurgaon',
      address: 'DLF Cyber City, Gurgaon 122002',
      latitude: 28.4960,
      longitude: 77.0900,
      base_price_per_hour: 720,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Printer/Scanner', 'Whiteboard', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Premium private office space',
      capacity: 11,
      availability_status: 'available'
    },
    {
      name: 'Custom Business Suite - Cyber City',
      type: 'custom-office',
      location: 'Cyber City, Gurgaon',
      address: 'DLF Cyber City, Gurgaon 122002',
      latitude: 28.4965,
      longitude: 77.0905,
      base_price_per_hour: 780,
      amenities: ['High-Speed Wi-Fi', 'Video Conferencing', 'Projector', 'Whiteboard', 'Printer/Scanner', 'Coffee/Tea', 'Air Conditioning', 'Parking'],
      description: 'Tailored office solution for enterprises',
      capacity: 17,
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
