import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-between pb-8 overflow-hidden bg-[#050505]">
      {/* Background Image - Moody & Precise */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[1px] scale-105 opacity-60 transition-opacity duration-1000"
        style={{ backgroundImage: 'url("https://images.pexels.com/photos/6750181/pexels-photo-6750181.jpeg")' }}
      />
      
      {/* Deep Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-transparent" />
      
      {/* Subtle Lamp Light Effect from Top Left */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,122,0,0.1)_0%,transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,200,0,0.05)_0%,transparent_30%)]" />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col items-center justify-center text-center -mt-10">
        <div className="max-w-4xl">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <Sparkles className="w-3 h-3 text-[#ff7a00] fill-[#ff7a00]" />
            <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">
              #1 Insta‑Worthy Private Theatre in Hyderabad
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-[2.5rem] sm:text-[4.2rem] lg:text-[5.2rem] font-bold tracking-tight text-white mb-5 leading-[1.05]">
            Create Memories at
            <br />
            <span className="text-[#facd15] drop-shadow-[0_0_40px_rgba(250,205,21,0.3)]">The Kindle Studio</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
            From intimate movie dates to grand celebrations,
            <br className="hidden md:block" />
            host your most cherished moments in our premium spaces.
          </p>
 
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button
              size="lg"
              className="bg-[#ff7a00] hover:bg-[#e66e00] text-white text-base px-10 py-6 rounded-full font-bold group shadow-[0_15px_40px_-5px_rgba(255,122,0,0.4)] transition-all duration-300"
              asChild
            >
              <Link href="/book" className="flex items-center gap-2">
                Book Your Slot
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-10 py-6 bg-white/[0.08] hover:bg-white/[0.12] backdrop-blur-xl rounded-full border border-white/15 text-white font-bold transition-all duration-300"
              onClick={() => document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Spaces
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Stats - Smaller cards & Tighter spacing */}
      <div className="w-full relative z-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 px-6 py-5 rounded-3xl text-center shadow-2xl transition-all duration-500">
              <span className="text-3xl font-extrabold text-[#facd15] block mb-0.5">22</span>
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Theatre Capacity</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 px-6 py-5 rounded-3xl text-center shadow-2xl transition-all duration-500">
              <span className="text-3xl font-extrabold text-[#facd15] block mb-0.5">80</span>
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Event Space Capacity</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 px-6 py-5 rounded-3xl text-center shadow-2xl transition-all duration-500">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="text-3xl font-extrabold text-[#facd15]">5</span>
                <Star className="w-5 h-5 fill-[#facd15] text-[#facd15]" />
              </div>
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll Indicator - Bold Orange */}
          <div className="flex justify-center animate-bounce">
            <div className="w-6 h-10 border-2 border-[#ff7a00] rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-[#ff7a00] rounded-full shadow-[0_0_10px_rgba(255,122,0,0.5)]"></div>
            </div>
          </div>
    </section>
  )
}
