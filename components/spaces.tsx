'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Users } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export function Spaces() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section id="spaces" className="py-24 bg-black relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
            Our Spaces
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">Choose Your <span className="text-amber-400">Perfect Space</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From intimate theatre experiences to grand celebrations
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Private Theatre */}
          <Card 
            className="overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:border-orange-600/50 transition-all duration-500 flex flex-col group"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative h-80 overflow-hidden">
              <img 
                src="/images/private-theatre.jpg" 
                alt="Private Theatre - The Celebs Town" 
                className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === 1 ? 'scale-110' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-600 text-white text-xs font-bold shadow-lg">
                  <Users className="w-3.5 h-3.5" />
                  <span>Up to 22 Guests</span>
                </div>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-white">
                The Celebs Town
              </CardTitle>
              <CardDescription className="text-sm font-bold text-amber-400">BOHO THEMED PRIVATE CINEMA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col flex-1 pt-0">
              <p className="text-gray-400 leading-relaxed text-sm">
                Experience luxury in our intimate boho-themed private theatre. Perfect for movie nights, celebrations, and special moments with your loved ones.
              </p>
              
              <div className="mt-auto space-y-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Plush recliner seating',
                  'Premium projector & sound',
                  'Atmospheric mood lighting',
                  'Decorative backdrops',
                  'Complimentary cake service',
                  'Netflix, Prime & streaming'
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-sm animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-orange-500" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-orange-600 text-white hover:bg-orange-500 rounded-full font-bold py-6 text-base transition-all shadow-lg shadow-orange-600/20"
                  >
                    <Link href="/book">Book Now</Link>
                  </Button>
                </div>
              </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Community Space */}
          <Card 
            className="overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:border-orange-600/50 transition-all duration-500 flex flex-col group"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative h-80 overflow-hidden">
              <img 
                src="/images/community-space.jpg" 
                alt="Community Space - The Nawabi Hall" 
                className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === 2 ? 'scale-110' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-600 text-white text-xs font-bold shadow-lg">
                  <Users className="w-3.5 h-3.5" />
                  <span>Up to 80 Guests</span>
                </div>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-white">
                The Nawabi Hall
              </CardTitle>
              <CardDescription className="text-sm font-bold text-amber-400">VERSATILE EVENT VENUE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col flex-1 pt-0">
              <p className="text-gray-400 leading-relaxed text-sm">
                A customizable community space perfect for larger gatherings, workshops, stand-up comedy, dance events, and corporate meetups.
              </p>
              
              <div className="mt-auto space-y-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Flexible seating arrangements',
                  'Professional audio system',
                  'Customizable decor options',
                  'Stage & performance area',
                  'Event lighting setup',
                  'Catering arrangements'
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-sm animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-orange-500" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-orange-600 text-white hover:bg-orange-500 rounded-full font-bold py-6 text-base transition-all shadow-lg shadow-orange-600/20"
                  >
                    <Link href="/book">Book Now</Link>
                  </Button>
                </div>
              </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
