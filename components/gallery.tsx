export function Gallery() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Experience The Kindle Studio</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            A glimpse into our beautifully curated spaces
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="relative group overflow-hidden rounded-lg aspect-square">
            <img 
              src="/images/private-theatre.jpg" 
              alt="Private Theatre Interior" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">Private Theatre</h3>
                <p className="text-sm text-white/80">Luxury cinema experience</p>
              </div>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-lg aspect-square">
            <img 
              src="/images/community-space.jpg" 
              alt="Community Event Space" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">Community Space</h3>
                <p className="text-sm text-white/80">Versatile event venue</p>
              </div>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-lg aspect-square">
            <img 
              src="/images/birthday-party.jpg" 
              alt="Birthday Celebration Setup" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">Birthday Parties</h3>
                <p className="text-sm text-white/80">Celebrate in style</p>
              </div>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-lg aspect-square">
            <img 
              src="/images/romantic-date.jpg" 
              alt="Romantic Date Night" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">Romantic Dates</h3>
                <p className="text-sm text-white/80">Intimate moments</p>
              </div>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-lg aspect-square">
            <img 
              src="/images/workshop.jpg" 
              alt="Workshop and Meetup Space" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">Workshops</h3>
                <p className="text-sm text-white/80">Learn and create together</p>
              </div>
            </div>
          </div>
          
          <div className="relative group overflow-hidden rounded-lg aspect-square">
            <img 
              src="/images/hero-theatre.jpg" 
              alt="Luxury Boho Interior" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">Boho Aesthetic</h3>
                <p className="text-sm text-white/80">Instagram-worthy decor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
