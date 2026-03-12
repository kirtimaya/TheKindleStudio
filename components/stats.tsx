import { Users, Star } from 'lucide-react'

export function Stats() {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-center mb-3">
              <span className="text-5xl font-extrabold text-amber-400">22</span>
            </div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Theatre Capacity</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-center mb-3">
              <span className="text-5xl font-extrabold text-amber-400">80</span>
            </div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Hall Capacity</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-5xl font-extrabold text-amber-400">5</span>
              <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Customer Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
