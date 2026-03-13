import { Card } from '@/components/ui/card'
import { Film, Cake, Heart, Mic, Music, Briefcase, Guitar, Users } from 'lucide-react'

const occasions = [
  {
    icon: Film,
    title: 'Private Theatre Screening',
  },
  {
    icon: Cake,
    title: 'Birthday Celebrations',
  },
  {
    icon: Heart,
    title: 'Anniversary Parties',
  },
  {
    icon: Mic,
    title: 'Stand-up Comedy Shows',
  },
  {
    icon: Music,
    title: 'Dance Workshops',
  },
  {
    icon: Briefcase,
    title: 'Corporate Meetups',
  },
  {
    icon: Guitar,
    title: 'Jamming Sessions',
  },
  {
    icon: Users,
    title: 'Community Gatherings',
  },
]

export function Occasions() {
  return (
    <section id="events" className="py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">Perfect For Every <span className="text-amber-400">Occasion</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From intimate screenings to grand community celebrations
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {occasions.map((occasion, index) => {
            const Icon = occasion.icon
            return (
              <Card
                key={index}
                className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-orange-600/50 hover:bg-white/10 transition-all duration-300 cursor-default group"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-600/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-600/20 transition-all duration-300">
                    <Icon className="w-7 h-7 text-orange-500" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{occasion.title}</h3>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
