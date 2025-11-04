## WorkSpace Pro – Office Booking Portal

Modern workspace booking portal built with Next.js 14, Tailwind CSS, shadcn/ui, and Supabase.

### Features
- Live search and filters (type, date, time, people, location)
- Case-insensitive location filtering with type-ahead city suggestions
- Dynamic pricing based on selected time range and hourly rates
- Booking flow with confirmation toast and automatic “My Bookings” modal
- Supabase persistence (bookings saved as Confirmed)
- “My Bookings” shows office, location, date, time, people, price, status

#### Quick tour (start here)
Follow the arrows to explore the portal effectively:

1) Open the portal → http://localhost:3001

2) Choose your space type → Meeting Room / Day Office / Co-working / Private / Custom
   → This filters offices by category in real-time

3) Set the date → pick from the date picker
   → Price and availability reflect this date

4) Set time range → Time from → Time until
   → Price updates instantly based on duration ⟶ longer time = higher price

5) Set number of people → 1..50
   → Only offices with enough capacity are shown

6) Type a city/area in Location → suggestions appear below
   → Click a suggestion to auto-fill and instantly filter

7) Explore results list (left) ⟷ Map (right)
   → Click an office card to open the booking form

8) Review Price Summary at the top of the form
   → Confirms duration, people, date, and shows computed total

9) Fill your details → Submit Booking Request
   → You’ll see “Booking Confirmed” and the My Bookings modal opens

10) My Bookings modal
    → Shows office, location, date/time, people, total price, and Confirmed status
    → Use Refresh to pull the latest bookings

---

## Installation

Prerequisites:
- Node.js 18+
- A Supabase project

1) Clone and install
```bash
npm install
```

2) Environment variables
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Find these in Supabase → Project Settings → API.

3) Database setup
- New setup (fresh): open Supabase Dashboard → SQL Editor → run `supabase-setup-bookings.sql`
- Existing tables (add missing columns): run `supabase-fix-schema.sql`

This will create:
- `offices` table
- `bookings` table (with `number_of_people`, `start_time`, `end_time`, `status`, etc.)
- Helpful indexes; RLS disabled for demo

4) Run the dev server
```bash
npm run dev
```
Default: http://localhost:3001

If port is in use, either stop the process on 3001 or change the port in `package.json` scripts (replace `--port 3001`).

---

## How to use the portal (step-by-step)

1) Open http://localhost:3001
2) Choose:
   - Space type (Meeting Room / Day Office / Day Co-working / Private Office / Custom)
   - Date (defaults to tomorrow)
   - Time from / Time until
   - Number of people
   - Location (type a city/area; case-insensitive; suggestions appear)
3) Available offices update instantly with a computed price for the selected time range
4) Click an office → “Complete Your Booking” appears
5) Fill in personal details and click “Submit Booking Request”
6) Toast shows “Booking Confirmed”; the “My Bookings” modal opens with the new booking

---

## Pricing logic (how price increases with time)

Each office has `base_price_per_hour`. For the chosen time range:
```
durationHours = (endMinutes - startMinutes) / 60
totalPrice    = round(base_price_per_hour * durationHours)
```
This is used for both listing cards and the booking you save.

---

## Data model (key fields)

### offices
- `id (uuid)`, `name`, `type`, `location`, `address`, `latitude`, `longitude`
- `base_price_per_hour (int)`, `amenities (text[])`, `capacity (int)`

### bookings
- `id (uuid)`, `office_id (uuid → offices.id)`
- `full_name`, `email`, `phone`, `company_name`, `purpose`
- `booking_date (date)`, `start_time (time)`, `end_time (time)`
- `number_of_people (int)`, `total_price (int)`, `preferred_amenities (text[])`
- `duration_package (text)`, `status (text)` (set to `confirmed` on submission)
- `created_at`, `updated_at`

---

## API routes
- `GET /api/offices`: all offices
- `GET /api/bookings`: all bookings, including office details
- `POST /api/bookings`: create a booking; status is `confirmed`

---

## Supabase connection guide

1) Create a Supabase project at `https://supabase.com`
2) From the project:
   - Project Settings → API
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3) Add both to `.env.local`
4) Run SQL (in Supabase SQL Editor):
   - Fresh setup: `supabase-setup-bookings.sql`
   - Align missing columns: `supabase-fix-schema.sql`
5) Restart the app if `.env.local` changed

---

## Troubleshooting

Port 3001 in use:
```powershell
# Kill Windows process using port 3001
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```

Schema error: “Could not find the column of 'bookings'”
- Run `supabase-fix-schema.sql` (adds missing columns like `number_of_people`)
- Verify in Table Editor that columns exist

Toast not visible:
- Ensure `<Toaster />` is included in `app/layout.js`

Empty results:
- Verify `.env.local` is correct
- Check that you ran the SQL and have data in `offices`

---

## Customize
- Pricing: `calculatePriceFromTime` and `calculatePrice` in `app/booking/page.js`
- Filtering & suggestions: same file (search filters effect and Location input block)
- API behavior: `app/api/[[...path]]/route.js`

---

## Scripts
```bash
npm run dev      # start dev server (defaults to port 3001)
npm run build    # build production
npm start        # start production server
```


