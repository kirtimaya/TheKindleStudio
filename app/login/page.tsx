'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Loader2, Phone, Lock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

type LoginStep = 'phone' | 'otp'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<LoginStep>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // Countdown timer for OTP
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!phoneNumber || !phoneNumber.match(/^\d{10}$/)) {
        throw new Error('Please enter a valid 10-digit phone number')
      }

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      setSuccess(true)
      setStep('otp')
      setTimeLeft(600) // 10 minutes
      setError(null)

      // Show test OTP in alert for demo
      if (data.message.includes('OTP is:')) {
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

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed')
      }

      // Store user session
      localStorage.setItem(
        'userSession',
        JSON.stringify({
          phoneNumber: data.phoneNumber,
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
        })
      )

      setSuccess(true)
      setError(null)

      // Redirect to home after success
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setOtp('')
    setTimeLeft(0)
    await handleSendOtp(new Event('submit') as any)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">Login with your mobile number</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && step === 'otp' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">OTP sent to {phoneNumber}</AlertDescription>
              </Alert>
            )}

            {success && step !== 'otp' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">Login successful! Redirecting...</AlertDescription>
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

                <p className="text-xs text-center text-muted-foreground">
                  We'll send a one-time password to your mobile number for verification
                </p>
              </form>
            )}

            {/* OTP Verification Step */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="otp" className="text-base font-semibold">
                      Enter OTP
                    </Label>
                    <button
                      type="button"
                      onClick={() => setStep('phone')}
                      className="text-sm text-primary hover:underline"
                    >
                      Change number
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    OTP sent to <span className="font-semibold">+91 {phoneNumber}</span>
                  </p>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      disabled={loading}
                      maxLength={6}
                      className="pl-10 text-center text-2xl tracking-widest font-bold"
                      required
                    />
                  </div>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2">
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

                {timeLeft <= 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={handleResendOtp}
                    disabled={loading}
                  >
                    Resend OTP
                  </Button>
                ) : (
                  <p className="text-xs text-center text-muted-foreground">
                    Didn't receive? <span className="text-primary font-semibold">Resend in {Math.ceil(timeLeft / 60)} min</span>
                  </p>
                )}
              </form>
            )}

            {/* Demo Credentials */}
            <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-xs text-blue-800">
              <p className="font-semibold">Test Credentials</p>
              <p>Use any 10-digit number to receive demo OTP. Check the alert popup for the OTP code.</p>
            </div>
          </div>
        </Card>

        {/* Bottom Link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            <a href="/" className="text-primary hover:underline font-semibold">
              Back to Home
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
