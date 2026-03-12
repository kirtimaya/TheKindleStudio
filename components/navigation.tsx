'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { ViewBookingDialog } from '@/components/view-booking-dialog'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    setIsMobileMenuOpen(false)
  }

  const handleMobileNav = () => setIsMobileMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container flex items-center justify-between h-20 px-4 mx-auto">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/images/logo.jpg" alt="The Kindle Studio" className="h-10 w-10 rounded shadow-md border border-white/20" />
          <span className="font-extrabold text-xl text-amber-400 tracking-wide font-sans hidden sm:block">The Kindle Studio</span>
        </Link>

        {/* Right: Desktop Navigation */}
        {mounted && (
          <div className="hidden md:flex items-center gap-6">
            <Button asChild variant="ghost" size="sm" className="text-sm font-medium hover:text-orange-500 hover:bg-transparent transition-colors">
              <a href="/#spaces" onClick={handleSpacesClick}>
                Spaces
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-sm font-medium hover:text-orange-500 hover:bg-transparent transition-colors">
              <a href="/#testimonials">Testimonials</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-sm font-medium hover:text-orange-500 hover:bg-transparent transition-colors">
              <a href="/#contact">Contact</a>
            </Button>

            {/* My Bookings Button */}
            <ViewBookingDialog trigger={
              <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-full px-6 shadow-lg shadow-orange-600/20 transition-all border border-orange-500">
                My Bookings
              </Button>
            } />

            {/* Admin Button */}
            <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-full px-6 shadow-lg shadow-orange-600/20 transition-all border border-orange-500">
              <Link href="/admin/login">Admin</Link>
            </Button>
          </div>
        )}

        {/* Mobile Menu Toggle Button */}
        {mounted && (
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mounted && isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl absolute w-full left-0 top-20 shadow-2xl">
          <div className="flex flex-col p-4 space-y-4">
            <a href="/#spaces" onClick={handleSpacesClick} className="text-lg font-medium p-2 text-white hover:text-orange-500 transition-colors">
              Spaces
            </a>
            <a href="/#testimonials" onClick={handleMobileNav} className="text-lg font-medium p-2 text-white hover:text-orange-500 transition-colors">
              Testimonials
            </a>
            <a href="/#contact" onClick={handleMobileNav} className="text-lg font-medium p-2 text-white hover:text-orange-500 transition-colors">
              Contact
            </a>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
               <ViewBookingDialog trigger={
                <Button size="lg" className="bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-full w-full">
                  My Bookings
                </Button>
              } />
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-full w-full shadow-lg shadow-orange-600/20 border border-orange-500">
                <Link href="/admin/login" onClick={handleMobileNav}>Admin Login</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
