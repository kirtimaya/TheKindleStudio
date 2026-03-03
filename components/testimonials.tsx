import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote:
      "The boho setup was absolutely stunning! Perfect intimate space for our 1st anniversary. The team made it so special.",
    author: 'Priya & Arjun',
    occasion: 'Anniversary Celebration',
    initials: 'P',
  },
  {
    quote:
      'Best private theatre experience in Hyderabad! The recliner seats, decor, and ambiance were top-notch. Highly recommend!',
    author: 'Rahul Sharma',
    occasion: 'Birthday Party',
    initials: 'R',
  },
  {
    quote:
      'Hosted our kitty party here and everyone loved it! The customizable space and great service made it memorable.',
    author: 'Sneha Reddy',
    occasion: 'Kitty Party',
    initials: 'S',
  },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-to-b from-secondary/20 via-background to-secondary/20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
            Loved by celebrations across Hyderabad
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Stories from The Kindle Studio
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Hear how couples, families and teams turned their moments into warm, cinematic memories
            inside our spaces.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Quote className="w-16 h-16 text-primary/10 absolute -top-4 -left-2 hidden sm:block" />
          <Quote className="w-16 h-16 text-primary/10 absolute -bottom-4 -right-2 rotate-180 hidden sm:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-none bg-card/90 backdrop-blur shadow-lg shadow-primary/10 hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <CardContent className="pt-6 pb-6 space-y-5">
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                    <span className="ml-2 text-xs font-medium text-primary/80">5.0 experience</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="bg-primary text-primary-foreground shadow">
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.occasion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

