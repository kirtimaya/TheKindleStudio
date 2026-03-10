'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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

  useEffect(() => {
    if (open) {
      if (externalEventDate) {
        setEventDate(externalEventDate)
      }
      if (externalTimeSlot) {
        setTimeSlot(externalTimeSlot)
      }
      if (externalAddOns !== undefined) {
        setAddOns(externalAddOns)
      }
    }
  }, [open, externalEventDate, externalTimeSlot, externalAddOns])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!eventDate) {
      setError('Please select a date.')
      return
    }

    if (!phone || !phone.match(/\d{10}/)) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
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

      // Estimate booking amount (you can adjust this based on your pricing)
      const bookingAmount = 5000 // Base amount in rupees, adjust as needed

      // Redirect to payment page with booking details
      const paymentUrl = `/payment?phone=${encodeURIComponent(phone)}&bookingId=${booking.id}&spaceName=${encodeURIComponent(spaceName)}&amount=${bookingAmount}&addonsTotal=${addonsTotal}`
      
      setOpen(false)
      router.push(paymentUrl)
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
          <div className="space-y-2">
            <Label htmlFor="booking-phone">Phone Number *</Label>
            <Input
              id="booking-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-space">Space</Label>
            <Input
              id="booking-space"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-package">Package (optional)</Label>
            <Input
              id="booking-package"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="Love / Couple / Family Hall or custom"
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
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell us about your celebration, decor preferences, or special requests..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-addons">Add-ons (optional)</Label>
            <Textarea
              id="booking-addons"
              rows={2}
              value={addOns}
              onChange={(e) => setAddOns(e.target.value)}
              placeholder="e.g. Flower bouquet, 1kg cake, number candles, balloons, extra decoration..."
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Close
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

