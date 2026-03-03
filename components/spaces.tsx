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
    <section id="spaces" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Our Spaces</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Choose Your Perfect Space
          </p>
          <p className="text-muted-foreground">
            From intimate theatre experiences to grand celebrations
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Private Theatre */}
          <Card 
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 hover:border-primary/50"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative h-72 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden group">
              <img 
                src="/images/private-theatre.jpg" 
                alt="Private Theatre - The Celebs Town" 
                className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === 1 ? 'scale-110' : 'scale-100'}`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 ${hoveredCard === 1 ? 'opacity-100' : 'opacity-90'}`} />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/95 backdrop-blur-sm text-sm font-medium shadow-lg">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Up to 22 People</span>
                </div>
                <Badge className="bg-primary text-primary-foreground">Popular</Badge>
              </div>
              <div className={`absolute top-4 right-4 transition-all duration-500 ${hoveredCard === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Insta-Worthy
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                The Celebs Town - Private Theatre
              </CardTitle>
              <CardDescription className="text-base">
                Boho-themed private cinema for cozy, picture-perfect celebrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Experience luxury in our intimate boho-themed private theatre. Perfect for movie nights, celebrations, and special moments with your loved ones.
              </p>
              
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
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Flexible packages curated for intimate, luxury experiences.
                  </p>
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform shadow-lg"
                    asChild
                  >
                    <Link href="/book">Book Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Community Space */}
          <Card 
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 hover:border-accent/50"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative h-72 bg-gradient-to-br from-accent/20 to-primary/20 overflow-hidden group">
              <img 
                src="/images/community-space.jpg" 
                alt="Community Space - The Nawabi Hall" 
                className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === 2 ? 'scale-110' : 'scale-100'}`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-500 ${hoveredCard === 2 ? 'opacity-100' : 'opacity-90'}`} />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/95 backdrop-blur-sm text-sm font-medium shadow-lg">
                  <Users className="w-4 h-4 text-accent" />
                  <span>Up to 80 People</span>
                </div>
                <Badge className="bg-accent text-accent-foreground">Versatile</Badge>
              </div>
              <div className={`absolute top-4 right-4 transition-all duration-500 ${hoveredCard === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Large Events
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl group-hover:text-accent transition-colors">
                The Nawabi Hall - Community Space
              </CardTitle>
              <CardDescription className="text-base">
                A versatile hall for birthdays, sangeets, corporate events and community gatherings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                A customizable community space perfect for larger gatherings, workshops, stand-up comedy, dance events, and corporate meetups.
              </p>
              
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
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Customisable layouts and decor to match your celebration.
                  </p>
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 transition-transform shadow-lg"
                    asChild
                  >
                    <Link href="/book">Book Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
