import { Suspense } from 'react'
import BookingPageClient from './BookingPageClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-8">Loading…</div></div>}>
      <BookingPageClient />
    </Suspense>
  )
}
