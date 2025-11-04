# 🚀 Installation Guide - Office Booking Platform

## ✅ Step 1: Dependencies Installed

All required npm packages have been installed successfully! The project includes:
- Next.js 14
- React 18
- Supabase client
- shadcn/ui components
- Tailwind CSS
- Google Maps API
- All other dependencies from package.json

## 📝 Step 2: Environment Variables Setup

You need to create a `.env.local` file in the root directory with your Supabase credentials.

### How to get Supabase credentials:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Create `.env.local` file:

Create a file named `.env.local` in the root directory (`C:\Users\vitth\Downloads\booking-office\.env.local`) with this content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: CORS Origins (defaults to "*" if not set)
# CORS_ORIGINS=*
```

**Replace the placeholder values with your actual Supabase credentials!**

## 🗄️ Step 3: Setup Supabase Database

### Option A: Using the Fixed SQL File (Recommended)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Open the file `supabase-setup-fixed.sql` from this project
6. Copy ALL the SQL code
7. Paste into Supabase SQL Editor
8. Click **"Run"** (or press Ctrl+Enter)

### Option B: Using the Original SQL File

Alternatively, use `supabase-setup.sql` if you prefer the original setup with RLS policies.

### Verify Tables Created:

After running the SQL, you should see:
- ✅ `offices` table created
- ✅ `bookings` table created
- ✅ Indexes created
- ✅ RLS disabled (for demo purposes, using fixed version)

## 🎯 Step 4: Run the Development Server

Now you can start the application:

```bash
npm run dev
```

Or if you have yarn installed:

```bash
yarn dev
```

The app will be available at: **http://localhost:3000**

## ✨ Step 5: Verify Installation

1. Open http://localhost:3000 in your browser
2. You should see the homepage with:
   - Hero section with search bar
   - Office type cards
   - Stats section
   - Features section
3. Navigate to `/booking` to see the booking interface
4. The app will automatically populate dummy offices from the API route

## 📦 What's Installed

### Core Dependencies:
- ✅ `next@14.2.3` - Next.js framework
- ✅ `react@^18` - React library
- ✅ `react-dom@^18` - React DOM
- ✅ `@supabase/supabase-js@^2.78.0` - Supabase client
- ✅ All shadcn/ui components (40+ UI components)
- ✅ `tailwindcss@^3.4.1` - Tailwind CSS
- ✅ `lucide-react@^0.516.0` - Icon library

### UI Components:
All shadcn/ui components are installed in `components/ui/`:
- Button, Card, Input, Dialog, Select, Calendar, etc.
- Form components with react-hook-form
- Toast notifications
- And many more...

### Dev Dependencies:
- ✅ `tailwindcss@^3.4.1`
- ✅ `autoprefixer@^10.4.19`
- ✅ `postcss@^8`

## 🔧 Project Structure

```
booking-office/
├── app/
│   ├── api/[[...path]]/route.js    # API routes (Supabase)
│   ├── booking/page.js              # Booking page
│   ├── page.js                      # Homepage
│   ├── layout.js                    # Root layout
│   └── globals.css                  # Global styles
├── components/
│   ├── ui/                          # shadcn/ui components
│   └── MapComponent.js              # Google Maps component
├── lib/
│   └── utils.js                     # Utility functions
├── hooks/                           # Custom React hooks
├── supabase-setup.sql               # Database setup SQL
├── supabase-setup-fixed.sql         # Database setup SQL (fixed version)
├── package.json                     # Dependencies
├── tailwind.config.js               # Tailwind configuration
├── next.config.js                   # Next.js configuration
└── components.json                  # shadcn/ui configuration
```

## 🆘 Troubleshooting

### Issue: "Module not found" errors
**Solution:** Make sure you ran `npm install` successfully. If not, run:
```bash
npm install
```

### Issue: Supabase connection errors
**Solution:** 
1. Verify `.env.local` file exists in the root directory
2. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
3. Restart the dev server after creating/updating `.env.local`

### Issue: Tables don't exist in Supabase
**Solution:**
1. Go to Supabase SQL Editor
2. Run the SQL from `supabase-setup-fixed.sql`
3. Verify tables are created in the Table Editor

### Issue: Map not loading
**Solution:**
- Check if Google Maps API key is configured (if needed)
- Verify Maps JavaScript API is enabled in Google Cloud Console

### Issue: Port 3000 already in use
**Solution:** 
Change the port in `package.json` scripts or stop the process using port 3000.

## 📚 Next Steps

1. ✅ Create `.env.local` with Supabase credentials
2. ✅ Run Supabase SQL setup script
3. ✅ Start dev server: `npm run dev`
4. ✅ Test the application
5. ✅ Customize as needed!

## 🎉 You're All Set!

Once you've completed steps 2-4, your office booking platform will be fully functional!

For more details, see:
- `SETUP.md` - Detailed setup instructions
- `QUICKSTART.md` - Quick start guide
- `FINAL_STATUS.md` - Project status

---

**Need help?** Check the browser console for any errors and verify all environment variables are set correctly.

