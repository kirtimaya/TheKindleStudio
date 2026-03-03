import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-theatre.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-primary/30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/90 border border-primary/20 shadow-sm mb-6 text-sm font-semibold text-primary tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>Hyderabad&apos;s Most Insta‑Worthy Private Theatre</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance mb-6">
            Create Memories at
            <br />
            <span className="text-primary">The Kindle Studio</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            A warm, boho-inspired private theatre and a versatile community hall designed for birthdays, anniversaries,
            proposals, sangeets and everything worth celebrating.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 shadow-lg"
              asChild
            >
              <Link href="/book">Book Your Slot</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 bg-background/80 backdrop-blur"
              asChild
            >
              <Link href="#spaces">Explore Spaces</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
