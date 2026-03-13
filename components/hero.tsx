import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[110vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
      {/* Background Image - Precise Zoom & Crop */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.pexels.com/photos/6750181/pexels-photo-6750181.jpeg")' }}
      />
      
      {/* Dynamic Orangish/Brown Tint Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a2a0a]/60 via-black/40 to-black" />
      <div className="absolute inset-0 bg-[#ff7a00]/10" /> {/* Global orange tint */}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        <div className="max-w-5xl">
          {/* Top Badge - Perfected */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-[#facd15]/30 mb-8 shadow-2xl">
            <Sparkles className="w-3 h-3 text-[#facd15] fill-[#facd15]" />
            <span className="text-[9px] font-bold text-[#facd15] tracking-[0.2em] uppercase">
              Hyderabad&apos;s Most Insta‑Worthy Private Theatre
            </span>
          </div>
          
          {/* Main Headline - Refined Size */}
          <h1 className="text-[2.5rem] sm:text-[4rem] lg:text-[5.5rem] font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Create Memories at
            <br />
            <span className="text-[#facd15]">The Kindle Studio</span>
          </h1>
          
          {/* Subtitle - Refined Size */}
          <p className="text-sm sm:text-lg text-white/95 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Experience luxury in our boho-themed private theatre or host
            <br className="hidden md:block" />
            unforgettable events in our versatile community space
          </p>
 
          {/* CTA Buttons - Bold & Rounded */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Button
              size="lg"
              className="bg-[#ff7a00] hover:bg-[#e66e00] text-white text-base px-10 py-6 rounded-full font-bold group shadow-[0_15px_40px_-10px_rgba(255,122,0,0.5)] transition-all duration-300"
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
              className="text-base px-10 py-6 bg-black/30 hover:bg-black/50 backdrop-blur-xl rounded-full border border-white/20 text-white font-bold transition-all duration-300"
              asChild
            >
              <Link href="#spaces">Explore Spaces</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Stats - More Compact & Elegant */}
      <div className="w-full relative z-10 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/50 backdrop-blur-[30px] border border-white/10 p-8 rounded-[2rem] text-center shadow-2xl hover:bg-black/60 transition-all duration-500">
              <span className="text-4xl font-bold text-[#facd15] block mb-1 tracking-tighter">22</span>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.25em]">Theatre Capacity</p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-[30px] border border-white/10 p-8 rounded-[2rem] text-center shadow-2xl hover:bg-black/60 transition-all duration-500">
              <span className="text-4xl font-bold text-[#facd15] block mb-1 tracking-tighter">80</span>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.25em]">Event Space Capacity</p>
            </div>
            
            <div className="bg-black/50 backdrop-blur-[30px] border border-white/10 p-8 rounded-[2rem] text-center shadow-2xl hover:bg-black/60 transition-all duration-500">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-4xl font-bold text-[#facd15] tracking-tighter">5</span>
                <Star className="w-8 h-8 fill-[#facd15] text-[#facd15]" />
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.25em]">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
