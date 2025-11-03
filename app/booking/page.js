'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, ArrowLeft, Calendar } from 'lucide-react'
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

// Duration packages with pricing multipliers
const durationPackages = [
  { id: '1-hour', name: '1 Hour', hours: 1, multiplier: 1, description: 'Quick meeting' },
  { id: 'half-day', name: 'Half Day', hours: 4, multiplier: 3.5, description: '4 hours (9 AM - 1 PM or 2 PM - 6 PM)' },
  { id: '10am-7pm', name: '10 AM - 7 PM', hours: 9, multiplier: 7, description: 'Business hours (9 hours)' },
  { id: 'full-day', name: 'Full Day', hours: 12, multiplier: 9, description: '12 hours (8 AM - 8 PM)' },
  { id: 'custom', name: 'Custom Duration', hours: 0, multiplier: 1, description: 'Set your own start and end time' },
]

export default function BookingPage() {
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '')
  const [offices, setOffices] = useState([])
  const [filteredOffices, setFilteredOffices] = useState([])
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showBookings, setShowBookings] = useState(false)
  const { toast } = useToast()

  // Search form state
  const [searchFilters, setSearchFilters] = useState({
    spaceType: 'day-coworking',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    timeFrom: '09:00',
    timeUntil: '10:00',
    numberOfPeople: 1,
    location: ''
  })

  // Dummy existing bookings data (empty initially, populated after actual bookings)
  const [existingBookings, setExistingBookings] = useState([])
  
  // Modal state for viewing bookings
  const [showBookingsModal, setShowBookingsModal] = useState(false)
  
  // Booking form visibility
  const [showBookingForm, setShowBookingForm] = useState(false)

  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    purpose: '',
    bookingDate: '',
    duration: '',
    customStartTime: '',
    customEndTime: '',
    amenities: [],
  })

  useEffect(() => {
    fetchOffices()
  }, [])

  useEffect(() => {
    let filtered = offices

    // Filter by search form space type
    if (searchFilters.spaceType) {
      filtered = filtered.filter(office => office.type === searchFilters.spaceType)
    }

    // Filter by selected type from URL params (office type cards from homepage)
    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter(office => office.type === selectedType)
    }

    // Filter by location from search bar or homepage search
    if (searchQuery) {
      filtered = filtered.filter(office => 
        office.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by search form location
    if (searchFilters.location) {
      filtered = filtered.filter(office => 
        office.location.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
        office.address.toLowerCase().includes(searchFilters.location.toLowerCase())
      )
    }

    // Filter by capacity (number of people)
    if (searchFilters.numberOfPeople > 1) {
      filtered = filtered.filter(office => office.capacity >= searchFilters.numberOfPeople)
    }

    setFilteredOffices(filtered)
  }, [offices, selectedType, searchQuery, searchFilters])

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

  const calculatePriceFromTime = (office, timeFrom, timeUntil) => {
    if (!office || !timeFrom || !timeUntil) return 0
    
    const [startHour, startMin] = timeFrom.split(':').map(Number)
    const [endHour, endMin] = timeUntil.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    const durationHours = (endMinutes - startMinutes) / 60
    
    if (durationHours <= 0) return 0
    
    return Math.round(office.base_price_per_hour * durationHours)
  }

  const calculatePrice = () => {
    if (!selectedOffice) return 0

    // If custom duration is selected, calculate based on custom times
    if (bookingData.duration === 'custom') {
      if (!bookingData.customStartTime || !bookingData.customEndTime) return 0
      
      const [startHour, startMin] = bookingData.customStartTime.split(':').map(Number)
      const [endHour, endMin] = bookingData.customEndTime.split(':').map(Number)
      
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      
      const durationHours = (endMinutes - startMinutes) / 60
      
      if (durationHours <= 0) return 0
      
      return Math.round(selectedOffice.base_price_per_hour * durationHours)
    }

    // For predefined duration packages
    const selectedPackage = durationPackages.find(pkg => pkg.id === bookingData.duration)
    if (!selectedPackage) return 0
    
    return Math.round(selectedOffice.base_price_per_hour * selectedPackage.multiplier)
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
          timeFrom: searchFilters.timeFrom,
          timeUntil: searchFilters.timeUntil,
          numberOfPeople: searchFilters.numberOfPeople,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add the booking to local state
        const newBooking = {
          id: data.booking.id,
          office_name: selectedOffice.name,
          location: selectedOffice.location,
          date: bookingData.bookingDate,
          time: `${searchFilters.timeFrom} - ${searchFilters.timeUntil}`,
          duration: bookingData.duration || 'Custom',
          people: searchFilters.numberOfPeople,
          price: totalPrice,
          status: 'pending'
        }
        
        setExistingBookings(prev => [newBooking, ...prev])
        
        toast({
          title: 'Booking Submitted! 🎉',
          description: `Your booking request has been submitted for ${selectedOffice.name}. Status: Pending confirmation.`,
        })
        
        // Reset form
        setBookingData({
          fullName: '',
          email: '',
          phone: '',
          companyName: '',
          purpose: '',
          bookingDate: '',
          duration: '',
          customStartTime: '',
          customEndTime: '',
          amenities: [],
        })
        setSelectedOffice(null)
        setShowBookingForm(false)
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
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Book Your Workspace</CardTitle>
            <CardDescription>Find the perfect space for your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label className="text-sm font-semibold">Space type required</Label>
                <Select 
                  value={searchFilters.spaceType} 
                  onValueChange={(value) => setSearchFilters({...searchFilters, spaceType: value})}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {officeTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-semibold">Date</Label>
                <Input
                  type="date"
                  className="h-10"
                  value={searchFilters.date}
                  onChange={(e) => setSearchFilters({...searchFilters, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <Label className="text-sm font-semibold">Time from</Label>
                <Input
                  type="time"
                  className="h-10"
                  value={searchFilters.timeFrom}
                  onChange={(e) => setSearchFilters({...searchFilters, timeFrom: e.target.value})}
                />
              </div>
              
              <div>
                <Label className="text-sm font-semibold">Time until</Label>
                <Input
                  type="time"
                  className="h-10"
                  value={searchFilters.timeUntil}
                  onChange={(e) => setSearchFilters({...searchFilters, timeUntil: e.target.value})}
                />
              </div>
              
              <div>
                <Label className="text-sm font-semibold">No of people</Label>
                <Input
                  type="number"
                  className="h-10"
                  min="1"
                  max="50"
                  value={searchFilters.numberOfPeople}
                  onChange={(e) => setSearchFilters({...searchFilters, numberOfPeople: parseInt(e.target.value) || 1})}
                />
              </div>
              
              <div>
                <Label className="text-sm font-semibold">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="City or area"
                    className="pl-10 h-10"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Found {filteredOffices.length} spaces for {searchFilters.numberOfPeople} {searchFilters.numberOfPeople === 1 ? 'person' : 'people'}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowBookings(!showBookings)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {showBookings ? 'Hide' : 'View'} My Bookings ({existingBookings.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Side - Bookings History (when toggled) */}
          {showBookings && (
            <div className="xl:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    My Bookings
                  </CardTitle>
                  <CardDescription>Your recent and upcoming bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {existingBookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-sm">{booking.office_name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{booking.location}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="font-medium">Date:</span>
                                <br />
                                {new Date(booking.date).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Time:</span>
                                <br />
                                {booking.time}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="font-medium">People:</span> {booking.people}
                              </div>
                              <div>
                                <span className="font-medium">Price:</span> ₹{booking.price}
                              </div>
                            </div>
                            <div className="text-xs">
                              <span className="font-medium">Package:</span> {booking.duration}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content - Office List and Booking Form */}
          <div className={`${showBookings ? 'xl:col-span-3' : 'xl:col-span-4'}`}>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label htmlFor="duration">Duration Package *</Label>
                        <Select 
                          value={bookingData.duration} 
                          onValueChange={(value) => setBookingData({...bookingData, duration: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {durationPackages.map(pkg => (
                              <SelectItem key={pkg.id} value={pkg.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{pkg.name}</span>
                                  <span className="text-xs text-muted-foreground">{pkg.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Custom time fields - only show when custom duration is selected */}
                    {bookingData.duration === 'custom' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customStartTime">Start Time *</Label>
                          <Input
                            id="customStartTime"
                            type="time"
                            required
                            value={bookingData.customStartTime}
                            onChange={(e) => setBookingData({...bookingData, customStartTime: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="customEndTime">End Time *</Label>
                          <Input
                            id="customEndTime"
                            type="time"
                            required
                            value={bookingData.customEndTime}
                            onChange={(e) => setBookingData({...bookingData, customEndTime: e.target.value})}
                          />
                        </div>
                      </div>
                    )}

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

                    {bookingData.duration && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total Price:</span>
                          <span className="text-2xl font-bold text-primary">₹{calculatePrice()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {bookingData.duration === 'custom' && bookingData.customStartTime && bookingData.customEndTime ? (
                            `Duration: ${((new Date(`2000-01-01T${bookingData.customEndTime}`) - new Date(`2000-01-01T${bookingData.customStartTime}`)) / 3600000).toFixed(1)} hours`
                          ) : (
                            `Package: ${durationPackages.find(pkg => pkg.id === bookingData.duration)?.name || ''}`
                          )}
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
      </div>
    </div>
  )
}
