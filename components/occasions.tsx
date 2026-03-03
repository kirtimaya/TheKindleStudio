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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Perfect For Every Occasion</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            From intimate screenings to grand celebrations
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {occasions.map((occasion, index) => {
            const Icon = occasion.icon
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow hover:border-primary cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-balance">{occasion.title}</h3>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
