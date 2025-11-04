# 🔧 Fix Schema Error - "Could not find the column of 'bookings'"

## Problem
The error "Could not find the column of 'bookings' in the schema cache" means:
- The `bookings` table is missing the `number_of_people` column, OR
- The `bookings` table doesn't exist at all

## Solution

### Option 1: If you already have a bookings table (Quick Fix)

Run this SQL in Supabase SQL Editor:

```sql
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

-- Update existing bookings
UPDATE bookings 
SET number_of_people = 1 
WHERE number_of_people IS NULL;
```

Or use the file: `supabase-add-number-of-people.sql`

### Option 2: Complete Schema Fix (Recommended)

Run this SQL in Supabase SQL Editor:

Open `supabase-fix-schema.sql` and run it - it will add all missing columns automatically.

### Option 3: Recreate Tables (If you don't have data to keep)

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase-setup-bookings.sql` (this will drop and recreate tables)
3. ⚠️ **Warning**: This will delete all existing bookings!

## Steps to Fix

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Run the Fix SQL**
   - Copy the SQL from `supabase-fix-schema.sql`
   - Paste into SQL Editor
   - Click "Run" (or Ctrl+Enter)

4. **Verify the Fix**
   - Go to "Table Editor" → "bookings" table
   - Check that `number_of_people` column exists
   - If not, run the SQL again

5. **Refresh Your App**
   - Restart your dev server
   - Try booking again

## Quick Fix SQL (Copy & Paste)

```sql
-- Add number_of_people column
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS number_of_people INTEGER DEFAULT 1;

-- Update existing records
UPDATE bookings SET number_of_people = 1 WHERE number_of_people IS NULL;
```

## After Fixing

1. ✅ Restart your dev server
2. ✅ Try creating a booking again
3. ✅ Check "My Bookings" to see if it works

---

**Need help?** Check Supabase logs in Dashboard → Logs for more error details.

