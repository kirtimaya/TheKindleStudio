import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { BookingDialog } from '@/components/booking-dialog'

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Pricing Packages</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Packages That Fit Your Celebration
          </p>
          <p className="text-muted-foreground">
            Choose the perfect package for your special moments
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {/* Love Package */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Love Package</CardTitle>
              <CardDescription>2-3 members</CardDescription>
              <div className="pt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">₹499</span>
                  <span className="text-muted-foreground">/ 3 hours</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Cozy private theatre setup</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Basic decor & lighting</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Streaming access</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Complimentary soft drinks</span>
                </div>
              </div>
              <BookingDialog
                defaultSpace="Private Theatre"
                defaultPackage="Love Package"
                trigger={
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Book Slot
                  </Button>
                }
              />
            </CardContent>
          </Card>
          
          {/* Couple Package */}
          <Card className="hover:shadow-lg transition-shadow border-primary relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
              MOST POPULAR
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl">Couple Package</CardTitle>
              <CardDescription>4-5 members</CardDescription>
              <div className="pt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">₹999</span>
                  <span className="text-muted-foreground">/ 3 hours</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Enhanced seating comfort</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Premium decor setup</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Streaming access</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Complimentary cake (500g)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Balloon decor</span>
                </div>
              </div>
              <BookingDialog
                defaultSpace="Private Theatre"
                defaultPackage="Couple Package"
                trigger={
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Book Slot
                  </Button>
                }
              />
            </CardContent>
          </Card>
          
          {/* Family Hall */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Family Hall</CardTitle>
              <CardDescription>Up to 22 members</CardDescription>
              <div className="pt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">₹1499</span>
                  <span className="text-muted-foreground">/ 3 hours</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Full theatre experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Cinematic decor & vibes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Streaming access</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Complimentary cake (1kg)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Customizable backdrop</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Party props & decorations</span>
                </div>
              </div>
              <BookingDialog
                defaultSpace="Family Hall"
                defaultPackage="Family Hall Package"
                trigger={
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Book Slot
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>
        
        <p className="text-center text-sm text-muted-foreground max-w-3xl mx-auto">
          * Prices are customizable based on your requirements. Contact us for special packages.
        </p>
      </div>
    </section>
  )
}
