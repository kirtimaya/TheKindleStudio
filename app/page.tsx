"use client";

import { Hero } from '@/components/hero'
import { Stats } from '@/components/stats'
import { Occasions } from '@/components/occasions'
import { Spaces } from '@/components/spaces'
import { Gallery } from '@/components/gallery'
import { Testimonials } from '@/components/testimonials'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Stats />
      <Occasions />
      <Spaces />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}

