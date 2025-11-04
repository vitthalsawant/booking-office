## WorkSpace Pro – Portal Overview and Implementation Guide

### What this portal does
- Search and filter professional workspaces (meeting rooms, day office, coworking, private, custom)
- Live, case-insensitive filtering by city/area with type-ahead city suggestions
- Dynamic pricing based on selected time range and office base hourly price
- Book a workspace and store the booking in Supabase as Confirmed
- View all past bookings in a “My Bookings” modal with office details, date/time, people, price, and status

---

### End-to-end user flow
1. Select space type, date, time-from, time-until, number of people
2. Type city/area in Location (case-insensitive; auto-suggested cities from office data)
3. See “Available Offices” update instantly with computed price for the chosen time range
4. Click an office → complete booking form → Submit
5. Booking is saved to Supabase with status = Confirmed
6. “My Bookings” opens and shows the new booking (and all previous), with office, location, date, time, people, total price

---

### Pricing logic (how price increases with time)
- Each office has a `base_price_per_hour`
- When a user selects a time range (Time from → Time until), we compute the duration in hours as:
  - `durationHours = (endMinutes - startMinutes) / 60`
  - `totalPrice = round(base_price_per_hour * durationHours)`
- This means: increasing the duration increases price linearly by the base hourly rate.

Note: The UI also includes “duration packages” (1 Hour, Half Day, etc.), but for consistency the booking and listings use the time range selection to compute the live price shown and the price saved with the booking.

---

### Live filtering and city suggestions
- Location filtering is case-insensitive and trimmed
- Suggestions are derived from office `location` fields by extracting the last comma-separated token (e.g., "Connaught Place, Delhi" → "Delhi")
- Suggestions dropdown appears while typing; clicking a suggestion fills Location and filters immediately

---

### What gets saved when you book (Supabase)
When you submit the booking form, we create a booking record with these key fields:
- `office_id`: selected office
- `full_name`, `email`, `phone`, `company_name`, `purpose`
- `booking_date`: from the Date filter (read-only in the booking form so it matches search)
- `start_time`, `end_time`: from Time from / Time until filters (read-only in the booking form)
- `number_of_people`: from No of people filter
- `total_price`: computed from base price per hour × durationHours
- `duration_package`: retained for compatibility (defaults to 'custom')
- `preferred_amenities`: array of amenities
- `status`: always `confirmed` on submission

Displayed in “My Bookings”:
- Office name, location, date, time range, number of people, total price, and a Confirmed badge

---

### Database schema (key tables)
`offices` (simplified):
- `id (uuid)`, `name`, `type`, `location`, `address`, `latitude`, `longitude`, `base_price_per_hour`, `amenities[]`, `capacity`, `created_at`

`bookings` (relevant fields):
- `id (uuid)`, `office_id (uuid → offices.id)`
- `full_name`, `email`, `phone`, `company_name`, `purpose`
- `booking_date (date)`, `start_time (time)`, `end_time (time)`, `number_of_people (int)`
- `total_price (int)`, `preferred_amenities (text[])`
- `duration_package (text)`, `status (text)`
- `created_at (timestamptz)`, `updated_at (timestamptz)`

RLS is disabled for demo purposes in setup SQL so all users can read/write.

---

### API routes
- `GET /api/offices`: returns all offices
- `GET /api/bookings`: returns all bookings with nested office details (name, type, location, etc.)
- `POST /api/bookings`: inserts a booking; status is set to `confirmed` and office details are returned in response

---

### Implementation notes (key UI behaviors)
- The “Location” input filters instantly, no separate search button required
- Filtering is case-insensitive and uses `trim()` on both user query and office fields
- City suggestions are shown under the Location field (top 8 matches)
- Booking form repeats the date/time/people values but read-only to match the search filters and prevent mismatches
- On successful booking:
  - A toast notification says “Booking Confirmed”
  - The app refreshes bookings and opens the “My Bookings” modal automatically

---

### How to run
1. Install dependencies: `npm install`
2. Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In Supabase, run `supabase-setup-bookings.sql` (or `supabase-fix-schema.sql` if you already created tables and need to align columns)
4. Start dev server: `npm run dev` (default at http://localhost:3001)

If port 3001 is busy: stop the running Node process using port 3001 or change the port in `package.json`.

---

### Troubleshooting
- “Could not find the column of 'bookings'” → run `supabase-fix-schema.sql` to add any missing columns (e.g., `number_of_people`)
- Empty results → verify Supabase URL/key and that tables exist
- Pricing incorrect → ensure time range is valid and office `base_price_per_hour` is set

---

### Where to change logic
- Pricing: search for `calculatePriceFromTime` and `calculatePrice`
- Filtering: see the `useEffect` that recalculates `filteredOffices` on `searchFilters` or `searchQuery` changes
- Suggestions: Location input block and the dropdown directly beneath it
- Booking persistence: `app/api/[[...path]]/route.js` in `POST /api/bookings`


