'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Info, Users } from 'lucide-react'
import { BookingDialog } from '@/components/booking-dialog'
import { SlotAvailability } from '@/components/slot-availability'
import { TermsDialog } from '@/components/terms-dialog'
import { AddOnsDialog } from '@/components/addons-dialog'
import { InlineAddOns } from '@/components/inline-addons'

export default function BookingPage() {
  const [privateAddOnsSummary, setPrivateAddOnsSummary] = useState<string | undefined>()
  const [privateAddOnsTotal, setPrivateAddOnsTotal] = useState(0)
  const [privateSelectedSlot, setPrivateSelectedSlot] = useState<{ date: string; slot: string } | null>(null)

  const [hallAddOnsSummary, setHallAddOnsSummary] = useState<string | undefined>()
  const [hallAddOnsTotal, setHallAddOnsTotal] = useState(0)
  const [hallSelectedSlot, setHallSelectedSlot] = useState<{ date: string; slot: string } | null>(null)

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-20 pb-16">
        <section className="py-12 bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <Badge className="mb-4 gap-2">
                <Info className="w-4 h-4" />
                Booking & Availability
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Book Your Experience</h1>
              <p className="text-muted-foreground text-pretty">
                Choose your preferred space, explore packages, check slot availability, and add special touches like cakes
                and decor to make your celebration truly memorable.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Private Theatre */}
            <Card className="overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">The Celebs Town - Private Theatre</CardTitle>
                    <CardDescription>
                      Boho-themed private cinema for intimate celebrations, anniversaries, birthdays and date nights.
                    </CardDescription>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Up to 22 guests</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-b-none rounded-t-lg">
                  <img
                    src="/images/private-theatre.jpg"
                    alt="The Celebs Town - Private Theatre"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Packages</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">Love Package</p>
                          <Badge variant="outline">2 - 3 people</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Cozy setup for proposals and anniversaries with boho decor and mood lighting.
                        </p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            3 hour private theatre access
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Basic decor &amp; fairy lights
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            OTT streaming access
                          </li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">Couple / Squad Package</p>
                          <Badge variant="outline">4 - 6 people</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Premium decor and comfortable seating for close friends, families and small celebrations.
                        </p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Upgraded decor &amp; themed backdrop
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Cake arrangement options
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Welcome message on screen
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <InlineAddOns
                      title="Add-ons"
                      items={[
                        {
                          id: 'pt-bouquet',
                          name: 'Flower bouquet',
                          price: 800,
                          imageSrc: 'https://images.unsplash.com/photo-1563241598-6ecd3d3b7305?w=500&q=80',
                          description: 'Fresh bouquet to surprise your special one.',
                        },
                        {
                          id: 'pt-cake',
                          name: '1kg designer cake',
                          price: 1600,
                          imageSrc: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
                          description: 'Custom flavour & message with elegant styling.',
                        },
                        {
                          id: 'pt-candles',
                          name: 'Number & LED candles',
                          price: 500,
                          imageSrc: 'https://images.unsplash.com/photo-1603006905581-2245b08fb8a2?w=500&q=80',
                          description: 'Number candles, LED candles and soft lighting accents.',
                        },
                        {
                          id: 'pt-balloons',
                          name: 'Balloon backdrop',
                          price: 1200,
                          imageSrc: 'https://images.unsplash.com/photo-1530103862676-de8892bf3014?w=500&q=80',
                          description: 'Balloon bunches and backdrop styling for photos.',
                        },
                      ]}
                      onApply={({ items, total }) => {
                        setPrivateAddOnsTotal(total)
                        if (items.length === 0) {
                          setPrivateAddOnsSummary(undefined)
                          return
                        }
                        const summary =
                          items.map((i) => `${i.name} (₹${i.price.toLocaleString('en-IN')})`).join(', ') +
                          `. Total add-ons: ₹${total.toLocaleString('en-IN')}`
                        setPrivateAddOnsSummary(summary)
                      }}
                    />
                  </div>
                </div>

                <SlotAvailability
                  spaceName="The Celebs Town - Private Theatre"
                  selectedSlot={privateSelectedSlot?.slot}
                  onSelectSlot={({ date, slot }) => setPrivateSelectedSlot({ date, slot })}
                />

                <div className="flex justify-end">
                  <BookingDialog
                    defaultSpace="The Celebs Town - Private Theatre"
                    externalAddOns={privateAddOnsSummary}
                    externalEventDate={privateSelectedSlot?.date}
                    externalTimeSlot={privateSelectedSlot?.slot}
                    addonsTotal={privateAddOnsTotal}
                    trigger={
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                        Book This Space
                      </button>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Community Space */}
            <Card className="overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">The Nawabi Hall - Community Space</CardTitle>
                    <CardDescription>
                      Versatile hall for birthdays, corporate events, workshops, stand-up, sangeets and more.
                    </CardDescription>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Up to 80 guests</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-b-none rounded-t-lg">
                  <img
                    src="/images/community-space.jpg"
                    alt="The Nawabi Hall - Community Space"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Packages</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">Event Basics</p>
                          <Badge variant="outline">Up to 40 people</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ideal for workshops, meetups and small functions with simple stage and seating.
                        </p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            3 hour hall access with seating setup
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Basic sound system &amp; mic
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Standard lighting
                          </li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">Celebration Package</p>
                          <Badge variant="outline">Up to 80 people</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          For birthdays, engagements and parties with enhanced decor and photo-friendly setup.
                        </p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Themed backdrop &amp; entry decor
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Stage, lighting &amp; audio support
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            Coordination support for vendors
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <InlineAddOns
                      title="Add-ons"
                      items={[
                        {
                          id: 'hall-theme',
                          name: 'Theme decor & backdrop',
                          price: 4000,
                          imageSrc: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80',
                          description: 'Stage and backdrop styling to match your event theme.',
                        },
                        {
                          id: 'hall-arch',
                          name: 'Entrance arch',
                          price: 2500,
                          imageSrc: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80',
                          description: 'Decorated arch at the entry for grand welcomes.',
                        },
                        {
                          id: 'hall-balloons',
                          name: 'Balloon garlands',
                          price: 2200,
                          imageSrc: 'https://images.unsplash.com/photo-1507504031003-b417242a53b4?w=500&q=80',
                          description: 'Balloon styling for stage and key photo spots.',
                        },
                        {
                          id: 'hall-caketable',
                          name: 'Cake table styling',
                          price: 1500,
                          imageSrc: 'https://images.unsplash.com/photo-1558293998-dfd92c73229b?w=500&q=80',
                          description: 'Decorated cake table with props and lighting.',
                        },
                      ]}
                      onApply={({ items, total }) => {
                        setHallAddOnsTotal(total)
                        if (items.length === 0) {
                          setHallAddOnsSummary(undefined)
                          return
                        }
                        const summary =
                          items.map((i) => `${i.name} (₹${i.price.toLocaleString('en-IN')})`).join(', ') +
                          `. Total add-ons: ₹${total.toLocaleString('en-IN')}`
                        setHallAddOnsSummary(summary)
                      }}
                    />
                    {hallAddOnsTotal > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Selected add-ons total:{' '}
                        <span className="font-semibold">₹{hallAddOnsTotal.toLocaleString('en-IN')}</span>
                      </p>
                    )}
                  </div>
                </div>

                <SlotAvailability
                  spaceName="The Nawabi Hall - Community Space"
                  selectedSlot={hallSelectedSlot?.slot}
                  onSelectSlot={({ date, slot }) => setHallSelectedSlot({ date, slot })}
                />

                <div className="flex justify-end">
                  <BookingDialog
                    defaultSpace="The Nawabi Hall - Community Space"
                    externalAddOns={hallAddOnsSummary}
                    externalEventDate={hallSelectedSlot?.date}
                    externalTimeSlot={hallSelectedSlot?.slot}
                    addonsTotal={hallAddOnsTotal}
                    trigger={
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                        Book This Space
                      </button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

