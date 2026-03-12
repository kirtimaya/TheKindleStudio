import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'
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
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl mb-8 text-sm font-semibold text-amber-400 tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>Hyderabad&apos;s Most Insta‑Worthy Private Theatre</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-balance mb-8 leading-[1.1]">
            Create Memories at
            <br />
            <span className="text-amber-400">The Kindle Studio</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Experience luxury in our boho-themed private theatre or host unforgettable events in our versatile community space
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-500 text-white text-lg px-10 py-7 shadow-2xl shadow-orange-600/20 rounded-full font-bold group"
              asChild
            >
              <Link href="/book" className="flex items-center gap-2">
                Book Your Slot
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border-white/20 text-white font-bold transition-all"
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
