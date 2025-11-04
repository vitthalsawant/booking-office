import './globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: 'WorkSpace Pro - Office Booking Platform',
  description: 'Professional office spaces, meeting rooms, and coworking areas available on-demand',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}