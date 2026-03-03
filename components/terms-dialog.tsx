'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'

type TermsDialogProps = {
  spaceName: 'Private Theatre' | 'Community Space'
  triggerLabel?: string
  maxGuests: number
}

export function TermsDialog({ spaceName, triggerLabel = 'View terms & conditions', maxGuests }: TermsDialogProps) {
  const isPrivateTheatre = spaceName === 'Private Theatre'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4 gap-2">
          <Info className="w-4 h-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{spaceName} – Terms & Conditions</DialogTitle>
          <DialogDescription>
            Please review these guidelines before confirming your booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1">Guests &amp; Capacity</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                Maximum recommended capacity: <span className="font-medium">{maxGuests} guests</span>.
              </li>
              <li>
                Additional guests beyond package limits may attract extra charges per person. Please confirm at the time of booking.
              </li>
              <li>
                Children are counted as guests for capacity planning.
              </li>
            </ul>
          </div>

          {isPrivateTheatre ? (
            <div>
              <h3 className="font-semibold mb-1">What&apos;s Allowed Inside the Private Theatre</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Celebrations like birthdays, anniversaries, proposals and small get‑togethers.</li>
                <li>Soft decor such as balloons, flowers and photo frames (handled by our team only).</li>
                <li>Non‑messy snacks and soft drinks arranged through us or our partner vendors.</li>
              </ul>

              <h3 className="font-semibold mt-3 mb-1">Not Allowed</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><span className="font-medium">Smoking, alcohol and drugs are strictly prohibited.</span></li>
                <li>Outside food &amp; drinks without prior approval.</li>
                <li>Confetti poppers, coloured smoke, open flames or anything that may damage the interiors.</li>
                <li>Tampering with projector, speakers or electrical equipment.</li>
              </ul>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold mb-1">Allowed at the Community Space</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Birthday parties, engagements, sangeets, corporate events, workshops and community meetups.</li>
                <li>Decor and catering through us or approved vendors.</li>
                <li>Music and performances within permitted volume limits.</li>
              </ul>

              <h3 className="font-semibold mt-3 mb-1">Not Allowed</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><span className="font-medium">Illegal substances, drugs or unlawful activities.</span></li>
                <li>Open flames (except for supervised cake cutting candles) and pyrotechnics.</li>
                <li>Damage to property, walls or fixtures by sticking tape, nails or glue without protection.</li>
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-1">Timings &amp; Slots</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Operating hours: <span className="font-medium">10:00 AM to 10:00 PM</span>.</li>
              <li>Each booking slot is for <span className="font-medium">3 hours</span>, including setup and wind‑up time.</li>
              <li>Extra time beyond the slot is subject to availability and additional charges.</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

