'use client'

import { useState, useEffect } from 'react'
import { MapPin, ArrowLeft, Calendar, Users } from 'lucide-react'
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

export default function BookingPageClient() {
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '')
  const [offices, setOffices] = useState([])
  const [filteredOffices, setFilteredOffices] = useState([])
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [searchFilters, setSearchFilters] = useState({
    spaceType: 'day-coworking',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    timeFrom: '09:00',
    timeUntil: '10:00',
    numberOfPeople: 1,
    location: ''
  })

  const [existingBookings, setExistingBookings] = useState([])
  const [showBookingsModal, setShowBookingsModal] = useState(false)
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

  const [cities, setCities] = useState([])
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)

  useEffect(() => {
    fetchOffices()
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      if (data.success && data.bookings) {
        const formattedBookings = data.bookings.map(booking => ({
          id: booking.id,
          office_name: booking.office_name || booking.offices?.name || 'Office',
          location: booking.office_location || booking.offices?.location || booking.location || 'Location',
          date: booking.booking_date,
          time: booking.start_time && booking.end_time 
            ? `${booking.start_time.substring(0, 5)} - ${booking.end_time.substring(0, 5)}`
            : (booking.start_time ? booking.start_time.substring(0, 5) : 'Time not set'),
          duration: booking.duration_package || 'Custom',
          people: booking.number_of_people || 1,
          price: booking.total_price || 0,
          status: booking.status || 'confirmed',
          email: booking.email,
          phone: booking.phone,
          purpose: booking.purpose
        }))
        formattedBookings.sort((a, b) => new Date(b.date) - new Date(a.date))
        setExistingBookings(formattedBookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings. Please try again.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    let filtered = offices
    if (searchFilters.spaceType) {
      filtered = filtered.filter(office => office.type === searchFilters.spaceType)
    }
    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter(office => office.type === selectedType)
    }
    const q1 = (searchQuery || '').trim().toLowerCase()
    if (q1) {
      filtered = filtered.filter(office => {
        const loc = (office.location || '').toLowerCase()
        const addr = (office.address || '').toLowerCase()
        return loc.includes(q1) || addr.includes(q1)
      })
    }
    const q2 = (searchFilters.location || '').trim().toLowerCase()
    if (q2) {
      filtered = filtered.filter(office => {
        const loc = (office.location || '').toLowerCase()
        const addr = (office.address || '').toLowerCase()
        return loc.includes(q2) || addr.includes(q2)
      })
    }
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
        const derivedCities = Array.from(
          new Set(
            (data.offices || [])
              .map(o => (o.location || ''))
              .map(loc => {
                const parts = loc.split(',')
                return (parts[parts.length - 1] || '').trim()
              })
              .filter(Boolean)
          )
        ).sort((a, b) => a.localeCompare(b))
        setCities(derivedCities)
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

  const handleBooking = async (e) => {
    e.preventDefault()
    setLoading(true)
    const bookingDateValue = searchFilters.date
    const timeFromValue = searchFilters.timeFrom
    const timeUntilValue = searchFilters.timeUntil
    const numberOfPeopleValue = searchFilters.numberOfPeople
    const totalPrice = calculatePriceFromTime(selectedOffice, timeFromValue, timeUntilValue)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          bookingDate: bookingDateValue,
          officeId: selectedOffice.id,
          totalPrice,
          timeFrom: timeFromValue,
          timeUntil: timeUntilValue,
          numberOfPeople: numberOfPeopleValue,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: '✅ Booking Confirmed! 🎉',
          description: `Your booking for ${selectedOffice.name} at ${selectedOffice.location} has been confirmed! Status: Confirmed.`,
          duration: 5000,
        })
        await fetchBookings()
        setShowBookingsModal(true)
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
                    onChange={(e) => {
                      const value = e.target.value
                      setSearchFilters({...searchFilters, location: value})
                      setShowCitySuggestions(true)
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={() => {
                      setTimeout(() => setShowCitySuggestions(false), 120)
                    }}
                  />
                  {showCitySuggestions && (
                    <div className="absolute z-20 mt-1 w-full rounded-md border bg-card shadow">
                      {(() => {
                        const q = (searchFilters.location || '').trim().toLowerCase()
                        const matches = (q ? cities.filter(c => c.toLowerCase().includes(q)) : cities).slice(0, 8)
                        if (matches.length === 0) {
                          return (
                            <div className="px-3 py-2 text-sm text-muted-foreground">No suggestions</div>
                          )
                        }
                        return matches.map(city => (
                          <button
                            key={city}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setSearchFilters({...searchFilters, location: city})
                              setShowCitySuggestions(false)
                            }}
                          >
                            {city}
                          </button>
                        ))
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Found {filteredOffices.length} spaces for {searchFilters.numberOfPeople} {searchFilters.numberOfPeople === 1 ? 'person' : 'people'}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowBookingsModal(true)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                View My Bookings ({existingBookings.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
          {showBookingsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowBookingsModal(false)}>
              <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    My Bookings ({existingBookings.length})
                  </h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={fetchBookings}
                      title="Refresh bookings"
                    >
                      🔄 Refresh
                    </Button>
                    <Button variant="ghost" onClick={() => setShowBookingsModal(false)}>
                      ✕
                    </Button>
                  </div>
                </div>

                {existingBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No bookings yet. Book your first workspace!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {existingBookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-lg">{booking.office_name}</h4>
                              <span className="text-sm px-3 py-1 rounded-full font-medium bg-green-100 text-green-700">
                                ✓ Confirmed
                              </span>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {booking.location || 'Location not available'}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="font-medium text-sm">Date:</span>
                                <br />
                                <span className="text-sm">
                                  {booking.date ? new Date(booking.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  }) : 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-sm">Time:</span>
                                <br />
                                <span className="text-sm">{booking.time}</span>
                              </div>
                              <div>
                                <span className="font-medium text-sm">People:</span>
                                <br />
                                <span className="text-sm">{booking.people} {booking.people === 1 ? 'person' : 'people'}</span>
                              </div>
                              <div>
                                <span className="font-medium text-sm">Total Price:</span>
                                <br />
                                <span className="text-lg font-bold text-primary">₹{booking.price}</span>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-sm">Duration Package:</span> {booking.duration}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="xl:col-span-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
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
                        filteredOffices.map((office) => {
                          const dynamicPrice = calculatePriceFromTime(office, searchFilters.timeFrom, searchFilters.timeUntil)
                          const durationHours = ((new Date(`2000-01-01T${searchFilters.timeUntil}`) - new Date(`2000-01-01T${searchFilters.timeFrom}`)) / 3600000).toFixed(1)

                          return (
                            <Card
                              key={office.id}
                              className={`cursor-pointer transition-all border-2 ${
                                selectedOffice?.id === office.id
                                  ? 'border-primary ring-2 ring-primary bg-primary/5'
                                  : 'hover:border-primary/50 hover:shadow-md'
                              }`}
                              onClick={() => {
                                setSelectedOffice(office)
                                setShowBookingForm(true)
                                setBookingData({
                                  ...bookingData,
                                  bookingDate: searchFilters.date,
                                })
                              }}
                            >
                              <CardContent className="p-6">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-xl mb-2">{office.name}</h3>
                                      <p className="text-muted-foreground flex items-center gap-1 mb-2">
                                        <MapPin className="h-4 w-4" />
                                        {office.location}
                                      </p>
                                      <p className="text-sm text-muted-foreground mb-3">{office.description}</p>
                                    </div>
                                    <div className="text-right ml-4">
                                      <div className="text-3xl font-bold text-primary">₹{dynamicPrice}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {durationHours}h • ₹{office.base_price_per_hour}/hr
                                      </div>
                                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full mt-2">
                                        Available
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                      <span className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        Up to {office.capacity} people
                                      </span>
                                    </div>
                                    <Button 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedOffice(office)
                                        setShowBookingForm(true)
                                        setBookingData({
                                          ...bookingData,
                                          bookingDate: searchFilters.date,
                                        })
                                      }}
                                      className="bg-primary hover:bg-primary/90"
                                    >
                                      Book Now
                                    </Button>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {office.amenities?.slice(0, 4).map((amenity, idx) => (
                                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-md">
                                        {amenity}
                                      </span>
                                    ))}
                                    {office.amenities?.length > 4 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{office.amenities.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>

                {selectedOffice && showBookingForm && (
                  <Card className="mt-6">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Complete Your Booking</CardTitle>
                          <CardDescription>Fill in details for {selectedOffice.name}</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setShowBookingForm(false)
                            setSelectedOffice(null)
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted p-4 rounded-lg mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-semibold">Total Price:</span>
                          <span className="text-3xl font-bold text-primary">
                            ₹{calculatePriceFromTime(selectedOffice, searchFilters.timeFrom, searchFilters.timeUntil)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {((new Date(`2000-01-01T${searchFilters.timeUntil}`) - new Date(`2000-01-01T${searchFilters.timeFrom}`)) / 3600000).toFixed(1)} hours • 
                          {searchFilters.numberOfPeople} {searchFilters.numberOfPeople === 1 ? 'person' : 'people'} • 
                          {searchFilters.date}
                        </div>
                        <div className="mt-3">
                          <Button 
                            className="w-full h-12 text-lg font-semibold"
                            onClick={() => {
                              document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' })
                            }}
                          >
                            📝 Add Booking Details
                          </Button>
                        </div>
                      </div>

                      <div id="booking-form">
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
                              placeholder="e.g., Team meeting, Client presentation, Workshop"
                            />
                          </div>

                          <div>
                            <Label htmlFor="bookingDate">Booking Date *</Label>
                            <Input
                              id="bookingDate"
                              type="date"
                              required
                              min={new Date().toISOString().split('T')[0]}
                              value={searchFilters.date}
                              readOnly
                              className="bg-muted cursor-not-allowed"
                              title="Date is set from search filters"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Date from search: {searchFilters.date}
                            </p>
                          </div>

                          <div>
                            <Label>Time Range</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={searchFilters.timeFrom}
                                readOnly
                                className="bg-muted cursor-not-allowed"
                                title="Time from search filters"
                              />
                              <span className="text-muted-foreground">to</span>
                              <Input
                                type="time"
                                value={searchFilters.timeUntil}
                                readOnly
                                className="bg-muted cursor-not-allowed"
                                title="Time from search filters"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Time range from search filters
                            </p>
                          </div>

                          <div>
                            <Label>Number of People</Label>
                            <Input
                              type="number"
                              value={searchFilters.numberOfPeople}
                              readOnly
                              className="bg-muted cursor-not-allowed"
                              title="Number of people from search filters"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              People from search: {searchFilters.numberOfPeople}
                            </p>
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

                          <div className="pt-4">
                            <Button 
                              type="submit" 
                              className="w-full h-12 text-lg font-semibold" 
                              disabled={loading}
                            >
                              {loading ? 'Submitting...' : '🎉 Submit Booking Request'}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

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


