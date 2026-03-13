'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { Loader2, Mail, Lock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

type BookingDialogProps = {
  trigger: React.ReactNode
  defaultSpace: string
  defaultPackage?: string
  externalAddOns?: string
  externalEventDate?: string
  externalTimeSlot?: string
  addonsTotal?: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

export function BookingDialog({
  trigger,
  defaultSpace,
  defaultPackage,
  externalAddOns,
  externalEventDate,
  externalTimeSlot,
  addonsTotal = 0,
}: BookingDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [spaceName, setSpaceName] = useState(defaultSpace)
  const [packageName, setPackageName] = useState(defaultPackage ?? '')
  const [eventDate, setEventDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [addOns, setAddOns] = useState(externalAddOns ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [otp, setOtp] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Resend countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setEmail(session.user.email)
        setIsAuthenticated(true)
      }
    }
    checkSession()
  }, [])

  useEffect(() => {
    if (open) {
      if (externalEventDate) setEventDate(externalEventDate)
      if (externalTimeSlot) setTimeSlot(externalTimeSlot)
      if (externalAddOns !== undefined) setAddOns(externalAddOns)
      
      // If closing we don't reset but on open we ensure we are at the right step
      // unless already logged in
    }
  }, [open, externalEventDate, externalTimeSlot, externalAddOns])

  const handleSendOtp = async () => {
    setError(null)
    setSendingOtp(true)
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
        },
      })

      if (otpError) {
        if (otpError.message.includes('rate limit')) {
          throw new Error('Too many requests. Please wait a minute before trying again.')
        }
        throw otpError
      }

      setStep('otp')
      setResendTimer(60)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (!otp || otp.length !== 6) throw new Error('Please enter a 6-digit code')

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp,
        type: 'email',
      })

      if (verifyError) throw verifyError
      if (!data.session) throw new Error('Verification failed')

      setIsAuthenticated(true)
      setStep('details')
      // Automatically proceed to booking creation
      await createBooking()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!eventDate) {
      setError('Please select a date.')
      return
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    if (!phone || !phone.match(/^\d{10}$/)) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }

    if (!isAuthenticated) {
      await handleSendOtp()
      return
    }

    await createBooking()
  }

  const createBooking = async () => {
    try {
      setSubmitting(true)
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          email: email.trim(),
          phone,
          spaceName,
          packageName: packageName || null,
          eventDate,
          timeSlot,
          notes: notes || null,
          addOns: addOns || null,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to create booking. Please try again.')
      }

      const booking = await response.json()
      const bookingAmount = 5000 // Base amount placeholder

      setOpen(false)
      router.push(`/payment?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&bookingId=${booking.id}&spaceName=${encodeURIComponent(spaceName)}&amount=${bookingAmount}&addonsTotal=${addonsTotal}`)
    } catch (err) {
      console.error('Booking failed', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Your Slot</DialogTitle>
          <DialogDescription>
            Share a few details and we&apos;ll reach out to confirm your booking and finalize the arrangements.
          </DialogDescription>
        </DialogHeader>
        {step === 'details' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="booking-name">Your Name *</Label>
              <Input
                id="booking-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="booking-email">Email Address *</Label>
                <div className="relative">
                  <Input
                    id="booking-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={isAuthenticated}
                    className={isAuthenticated ? 'pr-10' : ''}
                  />
                  {isAuthenticated && (
                    <Mail className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-phone">Phone Number *</Label>
                <Input
                  id="booking-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit number"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-space">Space</Label>
              <Input
                id="booking-space"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                readOnly
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="booking-date">Preferred Date *</Label>
                <Input
                  id="booking-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-time-slot">Preferred Time Slot *</Label>
                <Input
                  id="booking-time-slot"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="e.g. 6 PM - 9 PM"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="booking-notes">Additional Details (optional)</Label>
              <Textarea
                id="booking-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special requests..."
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting || sendingOtp}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || sendingOtp}>
                {sendingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : isAuthenticated ? (
                  'Confirm Booking'
                ) : (
                  'Verify Email & Confirm'
                )}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Verify Your Email</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a 6-digit code to <span className="font-bold">{email}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp-input" className="text-center block">Enter Code</Label>
              <Input
                id="otp-input"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest font-bold"
                required
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Book Now'
                )}
              </Button>
              
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Resend code in <span className="font-bold">{resendTimer}s</span>
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs h-auto p-0"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                  >
                    Didn&apos;t receive code? Resend
                  </Button>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs"
                onClick={() => setStep('details')}
                disabled={submitting}
              >
                Change Email
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

