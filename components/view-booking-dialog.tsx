'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Loader2, LogOut, Edit2, Save, X } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

type Step = 'phone' | 'otp' | 'bookings'

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

type ViewBookingSessionData = {
  phoneNumber: string
  verified: boolean
  loginTime: string
}

type EditingBooking = {
  id: number
  customerName: string
  notes: string | null
}

export function ViewBookingDialog({ trigger, isOpen: controlledOpen, onOpenChange }: { trigger?: React.ReactNode; isOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen
  
  const [step, setStep] = useState<Step>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookings, setBookings] = useState<BookingSummary[] | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [session, setSession] = useState<ViewBookingSessionData | null>(null)
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null)
  const [tempEditData, setTempEditData] = useState<EditingBooking | null>(null)

  // Check for existing session on component mount
  useEffect(() => {
    if (open) {
      const sessionData = localStorage.getItem('viewBookingSession')
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData)
          // Check if session is still valid (within 30 minutes)
          const loginTime = new Date(parsed.loginTime).getTime()
          const now = new Date().getTime()
          const thirtyMinutes = 30 * 60 * 1000
          
          if (now - loginTime < thirtyMinutes) {
            setSession(parsed)
            setPhoneNumber(parsed.phoneNumber)
            setStep('bookings')
            fetchBookings(parsed.phoneNumber)
            return
          } else {
            // Session expired
            localStorage.removeItem('viewBookingSession')
          }
        } catch (e) {
          console.error('Failed to parse session', e)
        }
      }
      setStep('phone')
    }
  }, [open])

  // Countdown timer for OTP
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const fetchBookings = async (phone: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/api/bookings/by-phone?phone=${encodeURIComponent(phone)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data: BookingSummary[] = await response.json()
      setBookings(data)
      if (data.length === 0) {
        setError('No bookings found for this phone number.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings. Please try again.')
      console.error('Fetch bookings error', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!phoneNumber || !phoneNumber.match(/^\d{10}$/)) {
        throw new Error('Please enter a valid 10-digit phone number')
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to send OTP')
      }

      const data = await response.json()
      setStep('otp')
      setTimeLeft(600) // 10 minutes
      setError(null)

      // Show test OTP in alert for demo
      if (data.message && data.message.includes('OTP is:')) {
        const otpMatch = data.message.match(/OTP is: (\d{6})/)
        if (otpMatch) {
          alert(`Demo OTP: ${otpMatch[1]}\n\nThis is shown for testing only.`)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a 6-digit OTP')
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'OTP verification failed')
      }

      const data = await response.json()

      // Store session
      const sessionData: ViewBookingSessionData = {
        phoneNumber: data.phoneNumber,
        verified: true,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem('viewBookingSession', JSON.stringify(sessionData))
      setSession(sessionData)

      // Fetch bookings
      setStep('bookings')
      await fetchBookings(phoneNumber)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('viewBookingSession')
    setSession(null)
    setPhoneNumber('')
    setOtp('')
    setBookings(null)
    setStep('phone')
    setError(null)
  }

  const handleEditBooking = (booking: BookingSummary) => {
    if (booking.status !== 'PENDING') {
      setError('You can only edit bookings with PENDING status.')
      return
    }
    setEditingBookingId(booking.id)
    setTempEditData({
      id: booking.id,
      customerName: booking.customerName,
      notes: booking.notes || '',
    })
  }

  const handleSaveBooking = async () => {
    if (!tempEditData) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/bookings/admin/${tempEditData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: tempEditData.customerName,
          notes: tempEditData.notes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update booking')
      }

      // Refresh bookings
      await fetchBookings(phoneNumber)
      setEditingBookingId(null)
      setTempEditData(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save booking.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingBookingId(null)
    setTempEditData(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild data-view-booking-dialog>
        {trigger || (
          <Button size="sm" variant="outline" className="text-xs">
            View Booking
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View & Manage Your Booking</DialogTitle>
          <DialogDescription>
            {step === 'phone' && 'Enter your phone number to get started'}
            {step === 'otp' && 'Enter the OTP sent to your phone'}
            {step === 'bookings' && 'Your bookings'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Phone Number Step */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-base font-semibold">
                Mobile Number
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Enter your 10-digit mobile number</p>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground font-semibold">+91</span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={loading}
                  maxLength={10}
                  className="pl-12 text-lg"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading || !phoneNumber}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <Label htmlFor="otp" className="text-base font-semibold">
                Enter OTP
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                OTP sent to <span className="font-semibold">+91 {phoneNumber}</span>
              </p>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={loading}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-bold"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {timeLeft > 0 ? (
                  <>
                    <p className="text-sm text-muted-foreground">OTP expires in</p>
                    <p className="font-bold text-sm">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-amber-600">OTP expired</p>
                )}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading || otp.length !== 6}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => setStep('phone')}>
              Change number
            </Button>
          </form>
        )}

        {/* Bookings List Step */}
        {step === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="font-semibold">+91 {phoneNumber}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {loading && <Loader2 className="h-4 w-4 animate-spin" />}

            {bookings && bookings.length > 0 && (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="p-4">
                    <div className="space-y-3">
                      {editingBookingId === booking.id ? (
                        <>
                          <div>
                            <Label className="text-xs font-semibold">Name</Label>
                            <Input
                              value={tempEditData?.customerName || ''}
                              onChange={(e) =>
                                setTempEditData((prev) =>
                                  prev ? { ...prev, customerName: e.target.value } : null
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold">Notes</Label>
                            <Input
                              value={tempEditData?.notes || ''}
                              onChange={(e) =>
                                setTempEditData((prev) => (prev ? { ...prev, notes: e.target.value } : null))
                              }
                              className="mt-1"
                              placeholder="Add any special requests or notes"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={loading}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveBooking}
                              disabled={loading}
                              className="bg-primary"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save Changes
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <p className="font-semibold">{booking.customerName}</p>
                              <p className="text-sm text-muted-foreground">{booking.spaceName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  booking.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : booking.status === 'CONFIRMED'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Date</p>
                              <p className="font-medium">{booking.eventDate}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Time</p>
                              <p className="font-medium">{booking.timeSlot}</p>
                            </div>
                            {booking.packageName && (
                              <div>
                                <p className="text-xs text-muted-foreground">Package</p>
                                <p className="font-medium">{booking.packageName}</p>
                              </div>
                            )}
                            {booking.addOns && (
                              <div>
                                <p className="text-xs text-muted-foreground">Add-ons</p>
                                <p className="font-medium text-xs">{booking.addOns}</p>
                              </div>
                            )}
                          </div>

                          {booking.notes && (
                            <div>
                              <p className="text-xs text-muted-foreground">Notes</p>
                              <p className="text-sm">{booking.notes}</p>
                            </div>
                          )}

                          {booking.status === 'PENDING' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditBooking(booking)}
                              className="w-full mt-2"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit Booking
                            </Button>
                          )}

                          {booking.status !== 'PENDING' && (
                            <div className="text-xs text-muted-foreground italic mt-2">
                              ℹ️ This booking cannot be edited as its status is {booking.status.toLowerCase()}.
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
