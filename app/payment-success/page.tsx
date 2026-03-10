'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Download, Home, MessageSquare } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-12 text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle2 className="h-24 w-24 animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-lg opacity-90">Your booking has been confirmed</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Order Details */}
            <div className="bg-green-50 rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg text-green-900">Order Details</h2>

              {orderId && (
                <div className="space-y-2">
                  <p className="text-sm text-green-700 font-semibold">Order ID</p>
                  <p className="font-mono text-lg font-bold text-green-900 break-all">{orderId}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-semibold text-green-600">Confirmed</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-semibold">{new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-sm font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Confirmation Email</h3>
                    <p className="text-sm text-muted-foreground">Check your email for booking confirmation and receipt</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-sm font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Review Booking Details</h3>
                    <p className="text-sm text-muted-foreground">You can view and manage your booking through your account</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white text-sm font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Event Day</h3>
                    <p className="text-sm text-muted-foreground">Arrive 15 minutes early for setup and check-in</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Need Help?
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Our team is here to assist you. Contact us for any questions about your booking.
              </p>
              <a href="mailto:contact@thekindlestudio.com" className="text-primary font-semibold hover:underline">
                contact@thekindlestudio.com
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                size="lg"
                onClick={() => router.push('/')}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const receipt = `
The Kindle Studio - Booking Confirmation

Order ID: ${orderId}
Date: ${new Date().toLocaleDateString('en-IN')}
Status: Confirmed

Thank you for your booking!

For more details, check your email or contact us.
                  `
                  const element = document.createElement('a')
                  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receipt))
                  element.setAttribute('download', `receipt-${orderId}.txt`)
                  element.style.display = 'none'
                  document.body.appendChild(element)
                  element.click()
                  document.body.removeChild(element)
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
