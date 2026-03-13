'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Loader2, LogOut, Edit2, Save, X, Info } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

type Step = 'email' | 'otp' | 'bookings'

type BookingSummary = {
  id: number
  customerName: string
  email: string
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
  email: string
  verified: boolean
  loginTime: string
}

type EditingBooking = {
  id: number
  customerName: string
  notes: string | null
  addOns: string | null
}

export function ViewBookingDialog({ trigger, isOpen: controlledOpen, onOpenChange }: { trigger?: React.ReactNode; isOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen
  
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [bookings, setBookings] = useState<BookingSummary[] | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [session, setSession] = useState<ViewBookingSessionData | null>(null)
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null)
  const [tempEditData, setTempEditData] = useState<EditingBooking | null>(null)

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      if (open) {
        const { data: { session: supabaseSession } } = await supabase.auth.getSession()
        
        if (supabaseSession?.user?.email) {
          const userEmail = supabaseSession.user.email
          setSession({
            email: userEmail,
            verified: true,
            loginTime: new Date().toISOString(),
          })
          setEmail(userEmail)
          setStep('bookings')
          fetchBookings(userEmail)
        } else {
          setStep('email')
          setSession(null)
          setBookings(null)
        }
      }
    }
    checkSession()
  }, [open])

  // Countdown timer for OTP
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const fetchBookings = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      setInfoMessage(null)
      const trimmedEmail = email.trim()
      const response = await fetch(`${API_BASE_URL}/api/bookings/by-email?email=${encodeURIComponent(trimmedEmail)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data: BookingSummary[] = await response.json()
      setBookings(data)
      if (data.length === 0) {
        setInfoMessage('No bookings found for this email address.')
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
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address')
      }

      const trimmedEmail = email.trim()
      
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          shouldCreateUser: true,
        }
      })

      if (supabaseError) {
        throw supabaseError
      }

      setStep('otp')
      setTimeLeft(600) // 10 minutes
      setError(null)
      
      setInfoMessage('Check your email for the verification code.')

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

      const trimmedEmail = email.trim()
      
      const { data: authData, error: authError } = await supabase.auth.verifyOtp({
        email: trimmedEmail,
        token: otp,
        type: 'email'
      })

      if (authError) {
        throw authError
      }

      if (!authData.session) {
        throw new Error('Failed to create session. Please try again.')
      }

      // Store session
      const sessionData: ViewBookingSessionData = {
        email: authData.user?.email || trimmedEmail,
        verified: true,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem('viewBookingSession', JSON.stringify(sessionData))
      setSession(sessionData)

      // Fetch bookings
      setStep('bookings')
      await fetchBookings(trimmedEmail)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('viewBookingSession')
    setSession(null)
    setEmail('')
    setOtp('')
    setBookings(null)
    setStep('email')
    setError(null)
  }

  const handleCancelEdit = () => {
    setEditingBookingId(null)
    setTempEditData(null)
    setAddOnSelection([])
  }

  const [addOnSelection, setAddOnSelection] = useState<string[]>([])

  const THEATRE_ADDONS = [
    { id: 'Flower bouquet', name: 'Flower bouquet (₹800)' },
    { id: '1kg designer cake', name: '1kg designer cake (₹1,600)' },
    { id: 'Number & LED candles', name: 'Number & LED candles (₹500)' },
    { id: 'Balloon backdrop', name: 'Balloon backdrop (₹1,200)' },
  ]

  const HALL_ADDONS = [
    { id: 'Theme decor & backdrop', name: 'Theme decor & backdrop (₹4,000)' },
    { id: 'Entrance arch', name: 'Entrance arch (₹2,500)' },
    { id: 'Balloon garlands', name: 'Balloon garlands (₹2,200)' },
    { id: 'Cake table styling', name: 'Cake table styling (₹1,500)' },
  ]

  const toggleAddOn = (id: string) => {
    setAddOnSelection(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      if (tempEditData) {
        setTempEditData({ ...tempEditData, addOns: next.join(', ') })
      }
      return next
    })
  }

  const handleEditBookingLocal = (booking: BookingSummary) => {
    if (booking.status !== 'PENDING') {
      setError('You can only edit bookings with PENDING status.')
      return
    }
    setEditingBookingId(booking.id)
    
    // Parse existing add-ons to select them in the list
    const existingAddOns = booking.addOns ? booking.addOns.split(', ') : []
    setAddOnSelection(existingAddOns)

    setTempEditData({
      id: booking.id,
      customerName: booking.customerName,
      notes: booking.notes || '',
      addOns: booking.addOns || '',
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
          addOns: tempEditData.addOns,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update booking')
      }

      await fetchBookings(email)
      setEditingBookingId(null)
      setTempEditData(null)
      setError(null)
      setAddOnSelection([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save booking.')
    } finally {
      setLoading(false)
    }
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
            {step === 'email' && 'Enter your email address to get started'}
            {step === 'otp' && 'Enter the OTP sent to your email'}
            {step === 'bookings' && 'Your bookings'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {infoMessage && (
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800 font-medium">{infoMessage}</p>
          </div>
        )}

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-base font-semibold">
                Email Address
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Enter the email you used for booking</p>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="text-lg"
                required
              />
            </div>
 
            <Button type="submit" size="lg" className="w-full" disabled={loading || !email}>
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
                OTP sent to <span className="font-semibold">{email}</span>
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

            <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => setStep('email')}>
              Change email
            </Button>
          </form>
        )}

        {/* Bookings List Step */}
        {step === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="font-semibold">{email}</p>
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
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</Label>
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

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Choose Add-ons</Label>
                              <div className="grid grid-cols-1 gap-1.5 border border-border/50 rounded-lg p-3 bg-secondary/20">
                                {(booking.spaceName.includes('Theatre') ? THEATRE_ADDONS : HALL_ADDONS).map((addon) => (
                                  <label 
                                    key={addon.id} 
                                    className={`flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer text-sm ${
                                      addOnSelection.includes(addon.id) ? 'bg-primary/10 border border-primary/20' : 'hover:bg-primary/5 border border-transparent'
                                    }`}
                                  >
                                    <input 
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-primary text-primary focus:ring-primary"
                                      checked={addOnSelection.includes(addon.id)}
                                      onChange={() => toggleAddOn(addon.id)}
                                    />
                                    <span className={addOnSelection.includes(addon.id) ? 'font-medium' : ''}>
                                      {addon.name}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Additional Notes
                              </Label>
                              <p className="text-[10px] text-muted-foreground mb-1.5 italic">
                                Any special requests not listed in the add-ons above
                              </p>
                              <Textarea
                                value={tempEditData?.notes || ''}
                                onChange={(e) =>
                                  setTempEditData((prev) => (prev ? { ...prev, notes: e.target.value } : null))
                                }
                                className="mt-1 resize-none"
                                rows={2}
                                placeholder="Example: Want a 'Happy Birthday' banner, veg cake only, etc."
                              />
                            </div>
                          </div>

                          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-amber-800 leading-tight">
                              <strong>Slot Policy:</strong> Date and Time slots are locked. To change your slot, please call us at <a href="tel:+916304671409" className="font-bold underline">+91 6304 671 409</a>.
                            </p>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              disabled={loading}
                              className="text-xs"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveBooking}
                              disabled={loading}
                              className="bg-[#ff7a00] hover:bg-[#e66e00] text-white font-bold text-xs"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Update Booking
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
                              onClick={() => handleEditBookingLocal(booking)}
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
