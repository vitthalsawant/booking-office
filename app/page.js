'use client'

import { useState } from 'react'
import { Search, MapPin, Clock, Users, Wifi, Building2, TrendingUp, Star, ArrowRight, Calendar, CheckCircle2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const officeTypes = [
  { id: 'meeting-room', name: 'Meeting Room', icon: '🏢', description: 'Professional meeting spaces', price: 'From ₹450/hr' },
  { id: 'day-office', name: 'Day Office', icon: '💼', description: 'Private office for a day', price: 'From ₹350/hr' },
  { id: 'day-coworking', name: 'Day Co-working', icon: '🤝', description: 'Flexible coworking space', price: 'From ₹140/hr' },
  { id: 'private-office', name: 'Private Office', icon: '🏛️', description: 'Dedicated private office', price: 'From ₹650/hr' },
  { id: 'custom-office', name: 'Custom Office', icon: '✨', description: 'Tailored office solutions', price: 'From ₹700/hr' },
]

const stats = [
  { label: 'Office Locations', value: '50+', icon: Building2, color: 'text-blue-600' },
  { label: 'Happy Clients', value: '10,000+', icon: Users, color: 'text-green-600' },
  { label: 'Cities Covered', value: '15+', icon: Globe, color: 'text-purple-600' },
  { label: 'Booking Rate', value: '98%', icon: TrendingUp, color: 'text-orange-600' },
]

const testimonials = [
  {
    name: 'Rajesh Kumar',
    company: 'Tech Startup India',
    text: 'Amazing experience! Found the perfect meeting room in just minutes. The booking process was seamless.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    company: 'Marketing Pro',
    text: 'Great variety of workspaces. The coworking spaces are modern and well-equipped. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Amit Patel',
    company: 'Consulting Firm',
    text: 'Professional offices at reasonable prices. Perfect for our client meetings. Will definitely use again.',
    rating: 5,
  },
]

const features = [
  {
    icon: Clock,
    title: 'Instant Booking',
    description: 'Book your workspace in seconds with real-time availability',
  },
  {
    icon: Wifi,
    title: 'Premium Amenities',
    description: 'High-speed internet, modern furniture, and all essentials included',
  },
  {
    icon: MapPin,
    title: 'Prime Locations',
    description: 'Offices in the heart of major business districts across India',
  },
  {
    icon: CheckCircle2,
    title: 'Flexible Terms',
    description: 'Hourly, daily, or monthly bookings with no long-term commitment',
  },
]

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('location', searchQuery)
    window.location.href = `/booking?${params.toString()}`
  }

  const handleTypeSelect = (typeId) => {
    window.location.href = `/booking?type=${typeId}`
  }

  return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Find Your Perfect Workspace
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional office spaces, meeting rooms, and coworking areas available on-demand
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by city or area..."
                      className="pl-10 h-12 text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="h-12 px-8"
                  onClick={() => setView('booking')}
                >
                  Search Spaces
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Office Types */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Choose Your Workspace Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {officeTypes.map((type) => (
                <Card 
                  key={type.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => {
                    setSelectedType(type.id)
                    setView('booking')
                  }}
                >
                  <CardHeader className="text-center">
                    <div className="text-5xl mb-3">{type.icon}</div>
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <CardDescription className="text-sm">{type.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <MapPin className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Prime Locations</CardTitle>
                  <CardDescription>
                    Access workspaces in the heart of major cities across India
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Flexible Booking</CardTitle>
                  <CardDescription>
                    Book by the hour, day, or month - complete flexibility for your needs
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Wifi className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Premium Amenities</CardTitle>
                  <CardDescription>
                    High-speed internet, meeting rooms, and all modern facilities
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">Book your perfect workspace today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setView('booking')}
              >
                Book Now
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Get a Quote
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Booking View
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 
            className="text-2xl font-bold cursor-pointer"
            onClick={() => setView('home')}
          >
            WorkSpace Pro
          </h1>
          <Button variant="outline" onClick={() => setView('home')}>
            ← Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label>Office Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
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
          <div className="flex-1">
            <Label>Search Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="City or area..."
                className="pl-10"
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
                  {filteredOffices.map((office) => (
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
                  ))}
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

                    {/* Price Display */}
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
