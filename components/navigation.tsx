'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookingLookupDialog } from '@/components/booking-lookup-dialog'

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src="/images/logo.jpg" alt="The Kindle Studio" className="h-10 w-auto rounded-lg" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">The Kindle Studio</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#spaces" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Spaces
            </Link>
            <Link href="/#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
            <Link href="/#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/book">Book Now</Link>
            </Button>
            <BookingLookupDialog
              trigger={
                <Button size="sm" variant="outline">
                  View Booking
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
