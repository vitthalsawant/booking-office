'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export default function MapComponent({ offices, selectedOffice, onSelectOffice }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState(null)

  // Initialize Google Maps
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'marker']
    })

    loader
      .load()
      .then((google) => {
        if (!mapRef.current) return

        // Center map on India
        const mapOptions = {
          center: { lat: 20.5937, lng: 78.9629 },
          zoom: 5,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }

        mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions)
        setMapLoaded(true)
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error)
        setError('Failed to load map. Please check your API key.')
      })
  }, [])

  // Update markers when offices change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.google) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    if (!offices || offices.length === 0) return

    // Create bounds to fit all markers
    const bounds = new window.google.maps.LatLngBounds()

    // Add markers for each office
    offices.forEach((office) => {
      const position = {
        lat: office.latitude,
        lng: office.longitude,
      }

      const marker = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: office.name,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: selectedOffice?.id === office.id ? '#3b82f6' : '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      })

      // Info window for marker
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${office.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">${office.location}</p>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${office.address}</p>
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #3b82f6;">₹${office.base_price_per_hour}/hr</p>
          </div>
        `,
      })

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker)
        onSelectOffice(office)
      })

      markersRef.current.push(marker)
      bounds.extend(position)
    })

    // Fit map to show all markers
    if (offices.length > 0) {
      mapInstanceRef.current.fitBounds(bounds)
      
      // Adjust zoom if only one marker
      if (offices.length === 1) {
        const listener = window.google.maps.event.addListenerOnce(mapInstanceRef.current, 'idle', () => {
          mapInstanceRef.current.setZoom(14)
        })
      }
    }
  }, [offices, mapLoaded, selectedOffice, onSelectOffice])

  // Center map on selected office
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !selectedOffice) return

    const position = {
      lat: selectedOffice.latitude,
      lng: selectedOffice.longitude,
    }

    mapInstanceRef.current.panTo(position)
    mapInstanceRef.current.setZoom(14)
  }, [selectedOffice, mapLoaded])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <div className="text-center p-6">
          <p className="text-destructive font-semibold mb-2">Map Error</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-b-lg" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
