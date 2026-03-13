'use client'

import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

const packages = [
  {
    name: 'Love Package',
    members: '2-3 members',
    price: '499',
    duration: '/ 3 hours',
    features: [
      'Cozy private theatre setup',
      'Basic decor & lighting',
      'Streaming access',
      'Complimentary soft drinks'
    ],
    popular: false,
    buttonText: 'Select Package'
  },
  {
    name: 'Couple Package',
    members: '4-5 members',
    price: '999',
    duration: '/ 3 hours',
    features: [
      'Enhanced seating comfort',
      'Premium decor setup',
      'Streaming access',
      'Complimentary cake (500g)',
      'Balloon decor'
    ],
    popular: true,
    buttonText: 'Select Package'
  },
  {
    name: 'Family Hall',
    members: 'Up to 22 members',
    price: '1499',
    duration: '/ 3 hours',
    features: [
      'Full theatre experience',
      'Cinematic decor & vibes',
      'Streaming access',
      'Complimentary cake (1kg)',
      'Customizable backdrop',
      'Party props & decorations'
    ],
    popular: false,
    buttonText: 'Select Package'
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6 group cursor-default">
            <Sparkles className="w-4 h-4 text-[#ff7a00]" />
            <span className="text-sm font-bold text-[#ff7a00] uppercase tracking-wider">Pricing Packages</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Packages That Fit Your Celebration
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Choose the perfect package for your special moments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-[2rem] border transition-all duration-500 group hover:scale-[1.02] ${
                pkg.popular
                  ? 'bg-gradient-to-b from-[#ff7a00]/10 to-transparent border-[#ff7a00]/50 shadow-[0_20px_50px_-20px_rgba(255,122,0,0.3)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff7a00] to-[#ff9500] text-white text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg tracking-widest uppercase">
                  <Sparkles className="w-3 h-3 fill-white" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-gray-400 text-sm font-medium">{pkg.members}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-bold text-[#ff7a00]">₹{pkg.price}</span>
                <span className="text-gray-400 font-medium">{pkg.duration}</span>
              </div>

              <div className="space-y-4 mb-10">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#ff7a00]" strokeWidth={3} />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                className={`w-full py-7 rounded-2xl font-bold transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-[#ff7a00] hover:bg-[#e66e00] text-white shadow-xl shadow-orange-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                <Link href="/book">{pkg.buttonText}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-gray-500 text-xs italic tracking-wide">
          * Prices are customizable based on your requirements. Contact us for special packages.
        </p>
      </div>
    </section>
  )
}
