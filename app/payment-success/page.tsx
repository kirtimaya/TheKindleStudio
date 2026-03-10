'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg shadow-xl p-8 text-center border border-orange-500/20">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-6">Your booking has been confirmed</p>

        {/* Order Details */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Order ID:</span>
            <span className="text-white font-mono">{orderId || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-slate-600 pt-3">
            <span className="text-gray-400">Amount Paid:</span>
            <span className="text-orange-500 font-semibold">₹{amount || '0'}</span>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-400 text-sm mb-6">
          A confirmation email has been sent to your registered email address. You can track your booking from "My Bookings".
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-full">
              Back to Home
            </Button>
          </Link>
          <Link href="/book" className="block">
            <Button variant="outline" className="w-full border-orange-500/30 text-gray-300 hover:bg-slate-700 rounded-full">
              View My Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}