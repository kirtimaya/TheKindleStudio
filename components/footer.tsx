import Link from 'next/link'
import { Instagram, Phone, MapPin, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-white py-20 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/images/logo.jpg" alt="The Kindle Studio" className="h-12 w-12 rounded-xl shadow-lg border border-white/20" />
              <span className="text-2xl font-extrabold text-amber-400 tracking-tight">The Kindle Studio</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Hyderabad&apos;s most Insta‑worthy private theatre and event space. Specialized in luxury celebrations, anniversaries, and corporate workshops since 2024.
            </p>
            <div className="flex items-center gap-4">
               <a href="https://www.instagram.com/thekindlestudio" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all group">
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
               <a href="tel:+916304671409" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all group">
                <Phone className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-orange-600/30 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="#spaces" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-orange-600" />
                  Our Spaces
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-orange-600" />
                  Book Your Slot
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-orange-600" />
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-orange-600" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Our Venues */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-orange-600/30 pb-2 inline-block">Our Venues</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-orange-600" />
                The Celebs Town - Private Theatre
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-orange-600" />
                The Nawabi Hall - Community Space
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-orange-600" />
                Birthday & Anniversary Parties
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-orange-600" />
                Corporate Events & Workshops
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white border-b border-orange-600/30 pb-2 inline-block">Get In Touch</h4>
            <ul className="space-y-5 text-sm">
              <li>
                <a href="tel:+916304671409" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center border border-orange-600/20">
                    <Phone className="w-4 h-4 text-orange-500" />
                  </div>
                  <span>+91 6304 671 409</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@thekindlestudio.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center border border-orange-600/20">
                    <Mail className="w-4 h-4 text-orange-500" />
                  </div>
                  <span>hello@thekindlestudio.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 cursor-default">
                <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center border border-orange-600/20 mt-0.5">
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-pretty">Gun Foundry, Himayatnagar,<br />Hyderabad, Telangana 500029</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-gray-500">
              © 2024 The Kindle Studio. Designed for Excellence.
            </p>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <Link href="#" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
