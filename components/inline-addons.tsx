'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { AddOnsTermsDialog } from '@/components/addons-terms-dialog'
import { Check } from 'lucide-react'

type AddOnItem = {
  id: string
  name: string
  price: number
  imageSrc: string
  description?: string
}

type InlineAddOnsProps = {
  items: AddOnItem[]
  onApply: (payload: { items: AddOnItem[]; total: number }) => void
  title: string
}

export function InlineAddOns({ items, onApply, title }: InlineAddOnsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectedItems = items.filter((item) => selectedIds.includes(item.id))
  const total = selectedItems.reduce((sum, item) => sum + item.price, 0)

  const handleApply = () => {
    onApply({ items: selectedItems, total })
  }

  const addOnsTermsText = `Add-ons Policy

Selection & Availability
All add-ons are subject to availability and must be ordered at least 24 hours in advance.

Customization
Special requests for colors, themes, or custom arrangements can be accommodated. These may incur additional charges and must be confirmed 48 hours before your event.

Cake & Desserts
• Professional cake cutting and serving included
• Please inform us of any food allergies
• All items sourced from certified vendors

Decorations & Floral Arrangements
• Our team installs and removes all items (setup ~30 min)
• Outdoor decorations adjusted based on weather
• Free consultation included

Balloons & Centerpieces
• Helium balloons last 12-24 hours
• Recommended to inflate day of event
• Some centerpieces available for reuse

Cancellation Policy
• 72+ hours notice: Full refund
• 24-72 hours notice: 50% refund
• Less than 24 hours: No refund

Payment
Add-on charges are in addition to space rental. Payment due at booking. GST included in prices.

Liability
We are not responsible for theft, loss, or damage to personal items. Not liable for indirect damages.

Modifications
Changes up to 24 hours before event at no charge. Modifications within 24 hours may incur fees.`

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border rounded-lg p-6 bg-card/50">
        {/* Left Side - Add-ons Selection */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-foreground">Choose add-ons</h4>
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => {
              const checked = selectedIds.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`flex flex-col items-stretch rounded-lg border bg-background/80 overflow-hidden text-left transition-all ${
                    checked ? 'border-primary ring-2 ring-primary/40' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-orange-200 to-orange-100 flex items-center justify-center relative">
                    {item.imageSrc && !item.imageSrc.startsWith('/images/') ? (
                      <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-xs font-semibold text-orange-700">{item.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 space-y-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    {item.description && (
                      <p className="text-[11px] text-muted-foreground text-pretty">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-medium text-primary">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`inline-flex items-center justify-center h-5 w-5 rounded border text-[10px] font-medium ${
                          checked
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-muted-foreground border-input'
                        }`}
                      >
                        {checked ? '✓' : ''}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Side - Terms & Conditions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-foreground">Terms & conditions</h4>
            <AddOnsTermsDialog />
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 h-full max-h-[400px] overflow-y-auto space-y-3 text-xs text-muted-foreground leading-relaxed">
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">Selection & Availability</p>
              <p>All add-ons are subject to availability and must be ordered at least 24 hours in advance.</p>
            </div>

            <div className="border-t border-border/40 pt-3">
              <p className="font-semibold text-foreground text-sm mb-1">Customization</p>
              <p>Special requests for colors or themes can be accommodated. May incur additional charges and require 48 hours notice.</p>
            </div>

            <div className="border-t border-border/40 pt-3">
              <p className="font-semibold text-foreground text-sm mb-1">Cake & Desserts</p>
              <p>Professional cutting & serving included. Allergen information required. All items from certified vendors.</p>
            </div>

            <div className="border-t border-border/40 pt-3">
              <p className="font-semibold text-foreground text-sm mb-1">Decorations</p>
              <p>Team installs/removes all items (~30 min setup). Free consultation included. Weather-based adjustments may apply.</p>
            </div>

            <div className="border-t border-border/40 pt-3">
              <p className="font-semibold text-foreground text-sm mb-1">Cancellation</p>
              <p>72+ hours: Full refund | 24-72 hours: 50% refund | Less than 24 hours: No refund</p>
            </div>

            <div className="border-t border-border/40 pt-3 pb-2">
              <p className="text-xs italic text-muted-foreground/70">
                Additional terms apply. <AddOnsTermsDialog /> for complete details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Items Summary */}
      {selectedItems.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-primary whitespace-nowrap">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-primary/20 pt-3 flex items-center justify-between">
            <span className="font-semibold text-foreground">Total add-ons:</span>
            <span className="text-lg font-bold text-primary">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <Button onClick={handleApply} className="w-full" size="sm">
            Update booking
          </Button>
        </div>
      )}

      {selectedItems.length === 0 && (
        <div className="text-xs text-muted-foreground text-center py-4">
          Select add-ons from the left to add them to your booking
        </div>
      )}
    </div>
  )
}
