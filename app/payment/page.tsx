'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

interface PaymentFormData {
  email: string
  phoneNumber: string
  paymentSource: 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET'
  cardNumber?: string
  cardExpiry?: string
  cardCvv?: string
  cardHolderName?: string
  upiId?: string
  bookingId?: string
  spaceName?: string
  amount?: number
  addonsTotal?: number
}

function PaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<PaymentFormData>({
    email: '',
    phoneNumber: '',
    paymentSource: 'CARD',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ orderId: string; message: string } | null>(null)

  useEffect(() => {
    // Get payment details from URL params or session
    const email = searchParams.get('email')
    const phone = searchParams.get('phone')
    const bookingId = searchParams.get('bookingId')
    const spaceName = searchParams.get('spaceName')
    const amount = searchParams.get('amount')
    const addonsTotal = searchParams.get('addonsTotal')

    if (phone || email) {
      setFormData((prev) => ({
        ...prev,
        email: email || '',
        phoneNumber: phone || '',
        bookingId: bookingId || undefined,
        spaceName: spaceName || undefined,
        amount: amount ? parseInt(amount) : undefined,
        addonsTotal: addonsTotal ? parseInt(addonsTotal) : undefined,
      }))
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/\s/g, '').length === 16
  }

  const validateCVV = (cvv: string) => {
    return cvv.length === 3
  }

  const validateUPI = (upi: string) => {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(upi)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate form data
      if (!formData.email || !formData.email.includes('@')) {
        throw new Error('Please enter a valid email address')
      }
      if (!formData.phoneNumber || !formData.phoneNumber.match(/\d{10}/)) {
        throw new Error('Please enter a valid 10-digit phone number')
      }

      let cardLastFour = undefined
      let cardBrand = undefined
      let upiId = undefined

      if (formData.paymentSource === 'CARD') {
        if (!formData.cardNumber || !validateCardNumber(formData.cardNumber)) {
          throw new Error('Invalid card number (must be 16 digits)')
        }
        if (!formData.cardCvv || !validateCVV(formData.cardCvv)) {
          throw new Error('Invalid CVV (must be 3 digits)')
        }
        if (!formData.cardExpiry) {
          throw new Error('Please select card expiry date')
        }
        if (!formData.cardHolderName) {
          throw new Error('Please enter card holder name')
        }

        cardLastFour = formData.cardNumber.slice(-4)
        cardBrand = formData.cardNumber.startsWith('4') ? 'VISA' : formData.cardNumber.startsWith('5') ? 'MASTERCARD' : 'OTHER'
      } else if (formData.paymentSource === 'UPI') {
        if (!formData.upiId || !validateUPI(formData.upiId)) {
          throw new Error('Invalid UPI ID format (e.g., user@bank)')
        }
        upiId = formData.upiId
      }

      const paymentAmount = (formData.amount || 0) * 100 // Convert to paise

      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          amount: paymentAmount,
          paymentSource: formData.paymentSource,
          cardLastFour,
          cardBrand,
          upiId,
          bookingId: formData.bookingId ? parseInt(formData.bookingId) : null,
          addonsTotal: formData.addonsTotal ? formData.addonsTotal * 100 : 0,
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Payment processing failed')
      }

      const result = await response.json()

      // Simulate payment gateway processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark payment as completed
      const completeResponse = await fetch(`${API_BASE_URL}/api/payments/${result.orderId}/complete`, {
        method: 'PUT',
      })

      if (completeResponse.ok) {
        setSuccess({
          orderId: result.orderId,
          message: `Payment successful! Order ID: ${result.orderId}`,
        })

        // Redirect after success
        setTimeout(() => {
          router.push(`/payment-success?orderId=${result.orderId}`)
        }, 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <Card className="lg:col-span-1 h-fit sticky top-4">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>

              {formData.spaceName && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Space</p>
                  <p className="font-medium">{formData.spaceName}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                {formData.amount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking Amount</span>
                    <span className="font-medium">₹{(formData.amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}

                {formData.addonsTotal !== undefined && formData.addonsTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Add-ons</span>
                    <span className="font-medium">₹{formData.addonsTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{((formData.amount || 0) + (formData.addonsTotal || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                <p className="font-semibold">Secure Payment</p>
                <p>Your payment information is encrypted and secure. We support multiple payment methods.</p>
              </div>
            </div>
          </Card>

          {/* Payment Form */}
          <Card className="lg:col-span-2">
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-2">Payment</h1>
              <p className="text-muted-foreground mb-8">Complete your booking payment securely</p>

              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success.message}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Address */}
                <div>
                  <Label htmlFor="email" className="text-base font-semibold">
                    Email Address
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">Primary contact for booking identification</p>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="text-lg"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phoneNumber" className="text-base font-semibold">
                    Phone Number
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">Required for WhatsApp confirmation</p>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={loading}
                    maxLength={10}
                    className="text-lg"
                    required
                  />
                </div>

                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Payment Method</Label>
                  <RadioGroup
                    value={formData.paymentSource}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentSource: value as PaymentFormData['paymentSource'],
                      }))
                    }
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="CARD" id="card" />
                        <Label htmlFor="card" className="cursor-pointer flex-1 font-medium">
                          Debit / Credit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                        <RadioGroupItem value="UPI" id="upi" />
                        <Label htmlFor="upi" className="cursor-pointer flex-1 font-medium">
                          UPI
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent opacity-50 pointer-events-none">
                        <RadioGroupItem value="NET_BANKING" id="netbanking" disabled />
                        <Label htmlFor="netbanking" className="cursor-pointer flex-1 font-medium">
                          Net Banking
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent opacity-50 pointer-events-none">
                        <RadioGroupItem value="WALLET" id="wallet" disabled />
                        <Label htmlFor="wallet" className="cursor-pointer flex-1 font-medium">
                          Wallet
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Payment Form */}
                {formData.paymentSource === 'CARD' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Card Details</h3>

                    <div>
                      <Label htmlFor="cardHolderName" className="text-sm font-semibold">
                        Card Holder Name
                      </Label>
                      <Input
                        id="cardHolderName"
                        name="cardHolderName"
                        placeholder="John Doe"
                        value={formData.cardHolderName || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-semibold">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                        maxLength={19}
                        required
                      />
                      <p className="text-xs text-blue-700 mt-1">Test: 4532 1111 1111 1111 (Visa) or 5212 3456 7890 1234 (Mastercard)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry" className="text-sm font-semibold">
                          Expiry (MM/YY)
                        </Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          placeholder="12/25"
                          value={formData.cardExpiry || ''}
                          onChange={handleInputChange}
                          disabled={loading}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvv" className="text-sm font-semibold">
                          CVV
                        </Label>
                        <Input
                          id="cardCvv"
                          name="cardCvv"
                          placeholder="123"
                          type="password"
                          value={formData.cardCvv || ''}
                          onChange={handleInputChange}
                          disabled={loading}
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Payment Form */}
                {formData.paymentSource === 'UPI' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">UPI Details</h3>
                    <div>
                      <Label htmlFor="upiId" className="text-sm font-semibold">
                        UPI ID
                      </Label>
                      <Input
                        id="upiId"
                        name="upiId"
                        placeholder="yourname@bank"
                        value={formData.upiId || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                      />
                      <p className="text-xs text-blue-700 mt-1">Test: demo@okhdfcbank</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-base font-semibold"
                    disabled={loading || !!success}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Payment Successful
                      </>
                    ) : (
                      `Pay ₹${((formData.amount || 0) + (formData.addonsTotal || 0)).toLocaleString('en-IN')}`
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By clicking Pay, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading payment page...</div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  )
}
