'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { ViewBookingDialog } from '@/components/view-booking-dialog'

import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

type ViewBookingSessionData = {
  email: string
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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

    // Subscribe to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        setBookingSession({
          email: session.user.email,
          verified: true,
          loginTime: new Date().toISOString(),
        })
      } else {
        setBookingSession(null)
      }
    })

    return () => {
      subscription.unsubscribe()
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    
    if (pathname === '/') {
      // If on landing page, scroll to target section
      const section = document.getElementById(sectionId)
      section?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If elsewhere, navigate to landing page then scroll
      router.push(`/#${sectionId}`)
    }
    setIsMobileMenuOpen(false)
  }

  const handleMobileNav = () => setIsMobileMenuOpen(false)

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-black/95 shadow-xl border-b border-white/10' : 'bg-transparent'}`}>
      <div className={`container flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-20' : 'h-28'} px-4 mx-auto`}>
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#ff7a00] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-white">
              <path d="M12 2L14.8 8.2L21 11L14.8 13.8L12 20L9.2 13.8L3 11L9.2 8.2L12 2Z" />
            </svg>
          </div>
          <span className="font-bold text-2xl text-white tracking-tighter hidden sm:block">The Kindle Studio</span>
        </Link>

        {/* Right: Desktop Navigation */}
        {mounted && (
          <div className="hidden md:flex items-center gap-10">
            <a href="/#spaces" onClick={(e) => handleNavClick(e, 'spaces')} className="text-sm font-medium text-white/90 hover:text-amber-400 transition-colors">
              Spaces
            </a>
            <a href="/#events" onClick={(e) => handleNavClick(e, 'events')} className="text-sm font-medium text-white/90 hover:text-amber-400 transition-colors">
              Events
            </a>
            <a href="/#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className="text-sm font-medium text-white/90 hover:text-amber-400 transition-colors">
              Testimonials
            </a>
            <a href="/#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-sm font-medium text-white/90 hover:text-amber-400 transition-colors">
              Contact
            </a>

            <ViewBookingDialog trigger={
              <Button size="sm" className="bg-[#ff7a00] hover:bg-orange-500 text-white text-sm font-bold rounded-full px-8 py-5 shadow-lg transition-all">
                My Booking
              </Button>
            } />

            <Button asChild size="sm" className="bg-[#ff7a00] hover:bg-orange-500 text-white text-sm font-bold rounded-full px-8 py-5 shadow-lg transition-all">
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
        <div className="md:hidden bg-black/95 backdrop-blur-xl absolute w-full left-0 top-full shadow-2xl border-t border-white/10">
          <div className="flex flex-col p-4 space-y-4">
            <a href="/#spaces" onClick={(e) => handleNavClick(e, 'spaces')} className="text-lg font-medium p-2 text-white hover:text-orange-500 transition-colors">
              Spaces
            </a>
            <a href="/#events" onClick={(e) => handleNavClick(e, 'events')} className="text-lg font-medium p-2 text-white hover:text-orange-500 transition-colors">
              Events
            </a>
            <a href="/#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className="text-lg font-medium p-2 text-white hover:text-orange-500 transition-colors">
              Testimonials
            </a>
            <a href="/#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-lg font-medium p-2 text-white hover:text-orange-500 transition-colors">
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
