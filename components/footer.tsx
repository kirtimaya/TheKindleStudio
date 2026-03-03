import Link from 'next/link'
import { Instagram, Phone, MapPin, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.jpg" alt="The Kindle Studio" className="h-10 w-auto rounded-lg" />
            </div>
            <h3 className="text-xl font-bold mb-2">The Kindle Studio</h3>
            <p className="text-background/80 text-sm leading-relaxed">
              Hyderabad&apos;s most Insta-worthy private theatre and event space. Creating memorable celebrations since 2024.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#spaces" className="text-background/80 hover:text-background transition-colors">
                  Our Spaces
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-background/80 hover:text-background transition-colors">
                  Pricing Packages
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-background/80 hover:text-background transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-background/80 hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Our Venues */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Venues</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>The Celebs Town - Private Theatre</li>
              <li>The Nawabi Hall - Community Space</li>
              <li>Birthday & Anniversary Parties</li>
              <li>Corporate Events & Workshops</li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+916304671409" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+91 6304 671 409</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/thekindlestudio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-background/80 hover:text-background transition-colors">
                  <Instagram className="w-4 h-4" />
                  <span>@thekindlestudio</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-background/80">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-pretty">Gun Foundry, Himayatnagar, Hyderabad</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/70">
              © 2024 The Kindle Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-background/70">
              <Link href="#" className="hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-background transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
