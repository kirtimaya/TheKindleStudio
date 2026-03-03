'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Phone, Instagram, MapPin, Sparkles, HeartHandshake } from 'lucide-react'
import { useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      setSubmitting(true)
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to send message. Please try again.')
      }

      setSubmitSuccess('Thank you! Your message has been sent. We will get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (err) {
      console.error('Contact form submission failed', err)
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-secondary/20 via-background to-secondary/10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
            Let&apos;s plan your celebration
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">Get In Touch</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Share your idea and we&apos;ll help you craft a warm, personalised experience at The Kindle Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,1.2fr] gap-8 max-w-6xl mx-auto mb-12">
          {/* Contact Information & Highlights */}
          <div className="space-y-6">
            <Card className="bg-card/90 backdrop-blur shadow-lg shadow-primary/10 border-none">
              <CardHeader className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-[0.2em]">
                  <Sparkles className="w-4 h-4" />
                  Trusted for special moments
                </div>
                <CardTitle>Concierge-style support</CardTitle>
                <CardDescription>
                  Our team will help you pick the right space, time slot, decor and add-ons for your celebration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <a
                    href="tel:+916304671409"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Call or WhatsApp</p>
                      <p className="text-sm text-muted-foreground">+91 6304 671 409</p>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/thekindlestudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">DM us on Instagram</p>
                      <p className="text-sm text-muted-foreground">@thekindlestudio</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 p-3 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Visit our studio</p>
                      <p className="text-sm text-muted-foreground text-pretty">
                        First Floor, Raja Reddy Marg, Above Hot Tracks, Near Cafe Bahar, Gun Foundry, Himayatnagar,
                        Hyderabad - 500029
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <HeartHandshake className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Thoughtful planning</p>
                      <p>We&apos;ll help you with decor, slots, add‑ons and flow of the event.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Warm, detail‑first team</p>
                      <p>Expect quick responses, clear communication and gentle guidance.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-card/95 backdrop-blur shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle>Tell us about your plan</CardTitle>
              <CardDescription>
                Share a few details and we&apos;ll get back with curated slot and package suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">What are you planning? *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about the occasion, preferred date/time and any decor ideas you have in mind..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                {submitError && <p className="text-sm text-destructive">{submitError}</p>}
                {submitSuccess && <p className="text-sm text-emerald-600">{submitSuccess}</p>}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>

                <p className="text-[11px] text-muted-foreground text-center">
                  We usually respond within a few hours during working times.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-none shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Find Us On Map</CardTitle>
              <CardDescription>
                Nestled in the heart of Himayatnagar, easy to reach for you and your guests.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-96 bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.2896494831856!2d78.46189!3d17.401515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9723f9b9b36f%3A0x3e8a1db1e1e1e1e1!2sGun%20Foundry%2C%20Himayatnagar%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-96"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

