'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function AddOnsTermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 text-xs text-primary hover:underline">
          Read full terms
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add-ons Terms & Conditions</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
          <div>
            <h3 className="font-semibold text-foreground mb-2">1. Add-on Selection & Availability</h3>
            <p>All add-ons are subject to availability and must be ordered at least 24 hours in advance. We reserve the right to suggest alternatives if requested items are unavailable.</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">2. Customization & Preferences</h3>
            <p>Special requests for color schemes, themes, or custom arrangements can be accommodated upon request. These may incur additional charges and must be confirmed at least 48 hours before your event.</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">3. Cake & Desserts</h3>
            <p>
              • Cake cutting: We can arrange professional cake cutting and serving at no additional charge.{'\n'}
              • Allergen Information: Please inform us of any food allergies. We maintain allergen-free handling practices where requested.{'\n'}
              • Freshness Guarantee: All perishable items are sourced from certified vendors and delivered fresh on the day of your event.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">4. Decorations & Floral Arrangements</h3>
            <p>
              • Installation & Removal: Our team will install all decorative items before your event and remove them after. Setup time is approximately 30 minutes.{'\n'}
              • Weather Conditions: Outdoor decorations will be adjusted based on weather. We are not liable for damage caused by unforeseen weather events.{'\n'}
              • Theme Consultation: Free consultation included for all decoration packages.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">5. Balloons & Centerpieces</h3>
            <p>
              • Balloon Durability: Helium balloons typically last 12-24 hours. We recommend inflating them on the day of the event.{'\n'}
              • Centerpiece Placement: Centerpieces are placed as per your guidance. We suggest placing them away from direct sunlight and heat sources.{'\n'}
              • Reusable Items: Some centerpieces can be arranged for reuse. Please mention your preference while booking.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">6. Photography Props & Themed Items</h3>
            <p>All props are professionally curated and sanitized. Please handle with care. Damage beyond normal wear will be charged separately.</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">7. Cancellation Policy</h3>
            <p>
              • 72+ hours notice: Full refund of add-on charges{'\n'}
              • 24-72 hours notice: 50% refund{'\n'}
              • Less than 24 hours: No refund (charges apply)
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">8. Payment & Pricing</h3>
            <p>Add-on charges are in addition to your space rental fee. Payment is due at the time of booking. GST (as applicable) is included in the quoted prices.</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">9. Liability & Responsibility</h3>
            <p>We are not responsible for theft, loss, or damage to personal items brought to the venue. Our add-ons are provided as-is, and we are not liable for any indirect or consequential damages.</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-2">10. Modifications & Refunds</h3>
            <p>Changes to add-on selections can be made up to 24 hours before the event at no additional charge. Modifications within 24 hours may incur additional fees.</p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              By proceeding with your booking, you acknowledge that you have read and agree to these terms and conditions. For any clarifications, please contact us at +91 6304 671 409 or @thekindlestudio on Instagram.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
