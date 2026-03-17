'use client'

import { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api'

type BookingSummary = {
  id: number
  customerName: string
  phone: string
  spaceName: string
  packageName?: string | null
  eventDate: string
  timeSlot: string
  status: string
  notes?: string | null
  addOns?: string | null
}

type BookingLookupDialogProps = {
  trigger: React.ReactNode
}

export function BookingLookupDialog({ trigger }: BookingLookupDialogProps) {
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<BookingSummary[] | null>(null)

  const handleLookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setResults(null)

    const trimmed = phone.trim()
    if (!trimmed) {
      setError('Please enter your phone number.')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(
        `${API_BASE_URL}/api/bookings/by-phone?phone=${encodeURIComponent(trimmed)}`,
      )

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to fetch bookings. Please try again.')
      }

      const data: BookingSummary[] = await response.json()
      setResults(data)
      if (data.length === 0) {
        setError('No bookings found for this phone number.')
      }
    } catch (err) {
      console.error('Booking lookup failed', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>View Your Booking</DialogTitle>
          <DialogDescription>
            Enter the phone number you used while booking to see all your upcoming and past bookings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lookup-phone-header">Phone Number</Label>
            <Input
              id="lookup-phone-header"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
              }}
            >
              Close
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Check Booking'}
            </Button>
          </div>
        </form>

        {results && results.length > 0 && (
          <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
            {results.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 space-y-1">
                <p className="text-sm font-semibold">
                  Booking ID: {booking.id}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {booking.customerName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {booking.phone}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Space:</span> {booking.spaceName}
                </p>
                {booking.packageName && (
                  <p className="text-sm">
                    <span className="font-medium">Package:</span> {booking.packageName}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(booking.eventDate).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Slot:</span> {booking.timeSlot}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <span className="uppercase tracking-wide">{booking.status}</span>
                </p>
                {booking.addOns && (
                  <p className="text-sm">
                    <span className="font-medium">Add-ons:</span> {booking.addOns}
                  </p>
                )}
                {booking.notes && (
                  <p className="text-sm">
                    <span className="font-medium">Notes:</span> {booking.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

