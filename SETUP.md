# 🏢 Office Booking Platform - Setup Guide

## ✅ What's Already Done

Your professional office booking platform (Regus-style) is **fully built** with:

### 🎨 Frontend Features
- ✅ Beautiful homepage with hero section
- ✅ Office type selection (5 types: Meeting Room, Day Office, Day Co-working, Private Office, Custom Office)
- ✅ Search functionality by city/location
- ✅ Google Maps integration showing all office locations
- ✅ Interactive office listings with filters
- ✅ Complete booking form with date/time selection
- ✅ **Dynamic pricing** - calculates price based on duration
- ✅ Amenities selection
- ✅ Responsive design with Tailwind CSS

### ⚙️ Backend Features
- ✅ Supabase integration for database
- ✅ API routes for offices and bookings
- ✅ **16 dummy offices** across all 5 categories in multiple cities:
  - Delhi (Connaught Place, Nehru Place, Saket, Vasant Vihar)
  - Gurgaon (Cyber City)
  - Mumbai (BKC, Powai, Lower Parel, Andheri, Nariman Point)
  - Bangalore (Indiranagar, Whitefield, Koramangala, HSR Layout, MG Road, Electronic City)

---

## 🚀 Final Setup Step - Create Supabase Tables

### Step 1: Go to Supabase Dashboard
1. Open your browser and go to: https://supabase.com/dashboard
2. Select your project: `rkhmsmfitaeuxfjhwdsw`

### Step 2: Open SQL Editor
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### Step 3: Run the Setup SQL
1. Open the file: `/app/supabase-setup.sql`
2. Copy ALL the SQL code from that file
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** button (or press Cmd/Ctrl + Enter)

### Step 4: Verify Tables Created
After running the SQL, you should see:
- ✅ `offices` table created
- ✅ `bookings` table created
- ✅ Indexes created
- ✅ RLS policies enabled

### Step 5: Refresh Your App
1. Go back to your application
2. Refresh the page
3. The app will automatically populate with 16 dummy offices! 🎉

---

## 🗺️ Google Maps Configuration

Your Google Maps API key is already configured:
- ✅ API Key: `AIzaSyBTjWnvo8cic2rzpPz18GuPb-NmbQLMcnM`
- ✅ Configured in `.env` file
- ✅ Integrated in MapComponent

**Important:** Make sure these APIs are enabled in your Google Cloud Console:
- Maps JavaScript API
- Places API

---

## 📱 How to Use the Platform

### Homepage Features:
1. **Search Bar** - Search offices by city or area
2. **Office Type Cards** - Click any office type to filter
3. **Book Now Button** - Start booking process

### Booking Interface:
1. **Filter offices** by type and location
2. **Select an office** from the list (shows on map)
3. **Fill booking form**:
   - Personal details (name, email, phone)
   - Company name (optional)
   - Purpose of booking
   - Date and time range
   - Select preferred amenities
4. **See dynamic pricing** calculated automatically
5. **Submit booking** - confirmation toast appears

### Map Features:
- 📍 All offices shown as markers
- 🗺️ Click marker to see office details
- 🎯 Selected office highlighted in blue
- 📏 Auto-zooms to fit all offices

---

## 💰 Pricing Structure (per hour)

- **Meeting Room**: ₹450-600/hr
- **Day Office**: ₹350-400/hr
- **Day Co-working**: ₹140-180/hr
- **Private Office**: ₹650-750/hr
- **Custom Office**: ₹700-900/hr

*Price automatically calculated based on duration*

---

## 🏢 Dummy Offices Included

### Meeting Rooms (3 offices)
- Executive Meeting Room - Connaught Place, Delhi
- Boardroom - BKC, Mumbai
- Conference Room - Indiranagar, Bangalore

### Day Offices (3 offices)
- Private Day Office - Cyber City, Gurgaon
- Executive Day Office - Powai, Mumbai
- Business Day Office - Whitefield, Bangalore

### Day Co-working (4 offices)
- CoWork Hub - Nehru Place, Delhi
- Creative CoSpace - Lower Parel, Mumbai
- Tech CoWork - Koramangala, Bangalore
- Innovation Hub - HSR Layout, Bangalore

### Private Offices (3 offices)
- Premium Private Office - Saket, Delhi
- Corporate Private Office - Andheri, Mumbai
- Deluxe Private Office - MG Road, Bangalore

### Custom Offices (3 offices)
- Custom Office Suite - Vasant Vihar, Delhi
- Bespoke Office - Nariman Point, Mumbai
- Tailored Workspace - Electronic City, Bangalore

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with React
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Maps**: Google Maps JavaScript API
- **Icons**: Lucide React

---

## 📊 Database Schema

### `offices` table
- `id` - UUID (primary key)
- `name` - Office name
- `type` - Office type (meeting-room, day-office, etc.)
- `location` - City/area
- `address` - Full address
- `latitude`, `longitude` - GPS coordinates
- `base_price_per_hour` - Hourly rate
- `amenities` - Array of amenities
- `description` - Office description
- `capacity` - Number of people
- `availability_status` - Available/unavailable

### `bookings` table
- `id` - UUID (primary key)
- `office_id` - Foreign key to offices
- `full_name`, `email`, `phone` - User details
- `company_name` - Optional company name
- `purpose` - Booking purpose
- `booking_date` - Date of booking
- `start_time`, `end_time` - Time range
- `total_price` - Calculated price
- `preferred_amenities` - Selected amenities
- `created_at` - Timestamp

---

## 🎯 Next Steps (Optional Enhancements)

After the MVP is working, you can add:
- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] User authentication & user dashboard
- [ ] Admin panel to manage offices
- [ ] Email notifications for bookings
- [ ] Availability calendar
- [ ] Reviews and ratings
- [ ] Photo gallery for offices
- [ ] Advanced filters (price range, capacity, ratings)

---

## 🆘 Troubleshooting

### Map not loading?
- Check Google Maps API key is valid
- Ensure Maps JavaScript API is enabled
- Check browser console for errors

### Offices not showing?
- Verify Supabase tables are created
- Check browser console for API errors
- Refresh the page

### Booking not working?
- Ensure all required fields are filled
- Check end time is after start time
- Verify Supabase connection

---

## 📞 Support

If you need any help or want to add features, just let me know! 🚀
