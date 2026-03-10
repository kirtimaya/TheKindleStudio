'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

type ViewBookingSessionData = {
  phoneNumber: string
  verified: boolean
  loginTime: string
}

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [adminSession, setAdminSession] = useState<{ adminId: string; username: string; fullName: string } | null>(null)
  const [bookingSession, setBookingSession] = useState<ViewBookingSessionData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if admin is logged in
    const adminSessionData = localStorage.getItem('adminSession')
    if (adminSessionData) {
      try {
        setAdminSession(JSON.parse(adminSessionData))
      } catch (e) {
        console.error('Failed to parse admin session')
      }
    }

    // Check if user has OTP-verified booking session
    const bookingSessionData = localStorage.getItem('viewBookingSession')
    if (bookingSessionData) {
      try {
        const parsed = JSON.parse(bookingSessionData)
        // Check if session is still valid (within 30 minutes)
        const loginTime = new Date(parsed.loginTime).getTime()
        const now = new Date().getTime()
        const thirtyMinutes = 30 * 60 * 1000
        
        if (now - loginTime < thirtyMinutes && parsed.verified) {
          setBookingSession(parsed)
        } else {
          localStorage.removeItem('viewBookingSession')
        }
      } catch (e) {
        console.error('Failed to parse booking session')
      }
    }
  }, [])

  // Auto-logout admin if they navigate to non-admin pages
  useEffect(() => {
    if (!adminSession) return

    // If not on admin page, logout
    if (!pathname.startsWith('/admin')) {
      localStorage.removeItem('adminSession')
      setAdminSession(null)
    }
  }, [pathname, adminSession])

  const handleSpacesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    if (pathname === '/') {
      // If on landing page, scroll to spaces section
      const spacesSection = document.getElementById('spaces')
      spacesSection?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If on booking page or elsewhere, navigate to landing page then scroll
      router.push('/#spaces')
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <img src="/images/logo.jpg" alt="The Kindle Studio" className="h-10 w-10 rounded" />
          <span className="font-bold text-sm">The Kindle Studio</span>
        </div>

        {/* Right: Navigation Links & Buttons */}
        {mounted && (
          <div className="flex items-center gap-6">
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <a href="/#spaces" onClick={handleSpacesClick}>
                Spaces
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <a href="/#testimonials">Testimonials</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <a href="/#contact">Contact</a>
            </Button>

            {/* My Bookings Button */}
            <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs rounded-full px-6">
              <Link href="/book">My Bookings</Link>
            </Button>

            {/* Admin Button */}
            <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs rounded-full px-6">
              <Link href="/admin/login">Admin</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
