'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false })

const officeTypes = [
  { id: 'meeting-room', name: 'Meeting Room' },
  { id: 'day-office', name: 'Day Office' },
  { id: 'day-coworking', name: 'Day Co-working' },
  { id: 'private-office', name: 'Private Office' },
  { id: 'custom-office', name: 'Custom Office' },
]

const amenitiesList = [
  'High-Speed Wi-Fi',
  'Projector',
  'Whiteboard',
  'Video Conferencing',
  'Printer/Scanner',
  'Coffee/Tea',
  'Air Conditioning',
  'Parking',
]

export default function BookingPage() {
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '')
  const [offices, setOffices] = useState([])
  const [filteredOffices, setFilteredOffices] = useState([])
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    purpose: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    amenities: [],
  })

  useEffect(() => {
    fetchOffices()
  }, [])

  useEffect(() => {
    let filtered = offices

    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter(office => office.type === selectedType)
    }

    if (searchQuery) {
      filtered = filtered.filter(office => 
        office.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredOffices(filtered)
  }, [offices, selectedType, searchQuery])

  const fetchOffices = async () => {
    try {
      const response = await fetch('/api/offices')
      const data = await response.json()
      if (data.success) {
        setOffices(data.offices)
        setFilteredOffices(data.offices)
      }
    } catch (error) {
      console.error('Error fetching offices:', error)
    }
  }

  const calculatePrice = () => {
    if (!bookingData.startTime || !bookingData.endTime || !selectedOffice) return 0

    const [startHour, startMin] = bookingData.startTime.split(':').map(Number)
    const [endHour, endMin] = bookingData.endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    const durationHours = (endMinutes - startMinutes) / 60
    
    if (durationHours <= 0) return 0
    
    return Math.round(selectedOffice.base_price_per_hour * durationHours)
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    setLoading(true)

    const totalPrice = calculatePrice()

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          officeId: selectedOffice.id,
          totalPrice,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Booking Confirmed! 🎉',
          description: `Your booking at ${selectedOffice.name} has been confirmed for ${bookingData.bookingDate}`,
        })
        setBookingData({
          fullName: '',
          email: '',
          phone: '',
          companyName: '',
          purpose: '',
          bookingDate: '',
          startTime: '',
          endTime: '',
          amenities: [],
        })
        setSelectedOffice(null)
      } else {
        toast({
          title: 'Booking Failed',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create booking',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAmenityToggle = (amenity) => {
    setBookingData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">WorkSpace Pro</h1>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Book Your Workspace</h1>
          <p className="text-muted-foreground text-lg">Select your preferred office type, location, and book instantly</p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block font-semibold">Space Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {officeTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block font-semibold">Search Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="City or area..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Booking Form and Office List */}
          <div className="space-y-6">
            {/* Available Offices */}
            <Card>
              <CardHeader>
                <CardTitle>Available Offices ({filteredOffices.length})</CardTitle>
                <CardDescription>Select an office to book</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {filteredOffices.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No offices found. Try different filters or check back later.</p>
                    </div>
                  ) : (
                    filteredOffices.map((office) => (
                      <Card
                        key={office.id}
                        className={`cursor-pointer transition-all ${
                          selectedOffice?.id === office.id
                            ? 'border-primary ring-2 ring-primary'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedOffice(office)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{office.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {office.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">₹{office.base_price_per_hour}/hr</p>
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Available
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{office.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {office.amenities?.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                            {office.amenities?.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{office.amenities.length - 3} more</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            {selectedOffice && (
              <Card>
                <CardHeader>
                  <CardTitle>Book {selectedOffice.name}</CardTitle>
                  <CardDescription>Fill in your details to complete booking</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          required
                          value={bookingData.fullName}
                          onChange={(e) => setBookingData({...bookingData, fullName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={bookingData.email}
                          onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          value={bookingData.companyName}
                          onChange={(e) => setBookingData({...bookingData, companyName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="purpose">Purpose of Booking *</Label>
                      <Textarea
                        id="purpose"
                        required
                        value={bookingData.purpose}
                        onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          required
                          value={bookingData.bookingDate}
                          onChange={(e) => setBookingData({...bookingData, bookingDate: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime">Start Time *</Label>
                        <Input
                          id="startTime"
                          type="time"
                          required
                          value={bookingData.startTime}
                          onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time *</Label>
                        <Input
                          id="endTime"
                          type="time"
                          required
                          value={bookingData.endTime}
                          onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Preferred Amenities</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {amenitiesList.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={amenity}
                              checked={bookingData.amenities.includes(amenity)}
                              onChange={() => handleAmenityToggle(amenity)}
                              className="rounded"
                            />
                            <label htmlFor={amenity} className="text-sm cursor-pointer">
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {bookingData.startTime && bookingData.endTime && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total Price:</span>
                          <span className="text-2xl font-bold text-primary">₹{calculatePrice()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Duration: {((new Date(`2000-01-01T${bookingData.endTime}`) - new Date(`2000-01-01T${bookingData.startTime}`)) / 3600000).toFixed(1)} hours
                        </p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Map */}
          <div className="lg:sticky lg:top-24 h-[600px]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Office Locations</CardTitle>
                <CardDescription>Click on a marker to see details</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <MapComponent offices={filteredOffices} selectedOffice={selectedOffice} onSelectOffice={setSelectedOffice} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
