import { Users, Star } from 'lucide-react'

export function Stats() {
  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-4xl font-bold text-primary">22</span>
            </div>
            <p className="text-sm text-muted-foreground">Theatre Capacity</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-4xl font-bold text-primary">80</span>
            </div>
            <p className="text-sm text-muted-foreground">Event Space Capacity</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-4xl font-bold text-primary">5</span>
              <Star className="w-6 h-6 fill-primary text-primary mt-2" />
            </div>
            <p className="text-sm text-muted-foreground">Customer Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
