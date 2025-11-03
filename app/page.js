'use client'

import { useState } from 'react'
import { Search, MapPin, Clock, Users, Wifi, Building2, TrendingUp, Star, ArrowRight, Calendar, CheckCircle2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">WorkSpace Pro</h1>
          </div>
          <Button onClick={() => window.location.href = '/booking'}>
            Book Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-primary font-semibold text-sm">🎉 Premium Workspaces Available Now</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Find Your Perfect<br />
            <span className="text-primary">Workspace</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Professional office spaces, meeting rooms, and coworking areas available on-demand across major cities
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-2xl p-6 border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by city, area, or pin code..."
                    className="pl-12 h-14 text-lg border-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <Button 
                size="lg" 
                className="h-14 px-10 text-lg"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-5 w-5" />
                Search Spaces
              </Button>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {['Delhi', 'Mumbai', 'Bangalore', 'Gurgaon'].map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setSearchQuery(city)
                    setTimeout(handleSearch, 100)
                  }}
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <Icon className={`h-12 w-12 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Office Types Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Workspace Type</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From quick meetings to full-time offices, we have the perfect space for every need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {officeTypes.map((type) => (
              <Card 
                key={type.id}
                className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-2 hover:border-primary group"
                onClick={() => handleTypeSelect(type.id)}
              >
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{type.icon}</div>
                  <CardTitle className="text-xl mb-2">{type.name}</CardTitle>
                  <CardDescription className="text-sm mb-3">{type.description}</CardDescription>
                  <div className="text-primary font-semibold text-lg">{type.price}</div>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    View Options <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose WorkSpace Pro</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make workspace booking simple, flexible, and hassle-free
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-2 hover:border-primary transition-all">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their workspace needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base text-foreground mb-4">
                    "{testimonial.text}"
                  </CardDescription>
                  <div className="mt-4 pt-4 border-t">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Book your perfect workspace today and experience the difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="h-14 px-10 text-lg"
              onClick={() => window.location.href = '/booking'}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-10 text-lg bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">WorkSpace Pro</span>
          </div>
          <p className="mb-4">Professional workspaces on-demand across India</p>
          <p className="text-sm">&copy; 2025 WorkSpace Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
