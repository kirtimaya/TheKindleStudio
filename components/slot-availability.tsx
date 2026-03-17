'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api'

const ALL_SLOTS = ['10:00 - 13:00', '13:00 - 16:00', '16:00 - 19:00', '19:00 - 22:00']

type AvailabilityResponse = {
  spaceName: string
  date: string
  bookedSlots: string[]
}

type SlotAvailabilityProps = {
  spaceName: string
  selectedSlot?: string
  onSelectSlot?: (params: { date: string; slot: string }) => void
}

export function SlotAvailability({ spaceName, selectedSlot, onSelectSlot }: SlotAvailabilityProps) {
  const [date, setDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().slice(0, 10)
  })
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvailability = async () => {
      setError(null)
      setLoading(true)
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/bookings/availability?spaceName=${encodeURIComponent(spaceName)}&date=${date}`,
        )
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || 'Failed to load availability.')
        }
        const data: AvailabilityResponse = await res.json()
        setBookedSlots(data.bookedSlots ?? [])
      } catch (err) {
        console.error('Failed to load availability', err)
        setError('Could not load availability. You can still submit a booking and we will confirm over WhatsApp.')
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [spaceName, date])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          Slot Availability
          <span className="text-xs font-normal text-muted-foreground">(3 hour slots • 10 AM to 10 PM)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1 max-w-xs">
          <Label htmlFor={`date-${spaceName}`}>Select Date</Label>
          <input
            id={`date-${spaceName}`}
            type="date"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-xs text-destructive flex items-center gap-2">
            <Info className="w-3 h-3" />
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_SLOTS.map((slot) => {
            const isBooked = bookedSlots.includes(slot)
            const isSelected = !isBooked && selectedSlot === slot
            return (
              <button
                key={slot}
                type="button"
                disabled={isBooked || loading}
                onClick={() => onSelectSlot?.({ date, slot })}
                className={`rounded-md border px-3 py-2 text-xs sm:text-sm text-center transition-colors ${
                  isBooked
                    ? 'bg-destructive/10 border-destructive text-destructive cursor-not-allowed'
                    : isSelected
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-emerald-50/60 border-emerald-500/40 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <div className="font-medium">{slot}</div>
                <div className="text-[11px] mt-1 uppercase tracking-wide">
                  {loading ? 'Checking…' : isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Info className="w-3 h-3" />
          Final confirmation and exact timing will be shared over WhatsApp after you submit your booking request.
        </p>
      </CardContent>
    </Card>
  )
}

