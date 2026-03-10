'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AddOnsTermsDialog } from '@/components/addons-terms-dialog'

type AddOnItem = {
  id: string
  name: string
  price: number
  imageSrc: string
  description?: string
}

type AddOnsDialogProps = {
  trigger: React.ReactNode
  items: AddOnItem[]
  onApply: (payload: { items: AddOnItem[]; total: number }) => void
  title: string
}

export function AddOnsDialog({ trigger, items, onApply, title }: AddOnsDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectedItems = items.filter((item) => selectedIds.includes(item.id))
  const total = selectedItems.reduce((sum, item) => sum + item.price, 0)

  const handleApply = () => {
    onApply({ items: selectedItems, total })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <AddOnsTermsDialog />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Left Side - Add-ons Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Choose add-ons</h3>
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
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
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={item.imageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
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

          {/* Right Side - Selected Items & Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Selected Add-ons</h3>
            
            {selectedItems.length === 0 ? (
              <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-secondary/20">
                <p className="text-sm text-muted-foreground text-center">
                  Select items from the left to add them here
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/40"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-2">
                      <span className="font-semibold text-primary whitespace-nowrap">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => toggle(item.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Card */}
            <div className="rounded-lg border border-border bg-primary/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Selected items:</span>
                <span className="font-medium">{selectedItems.length}</span>
              </div>
              <div className="border-t border-border/50 pt-2 flex items-center justify-between">
                <span className="font-semibold text-foreground">Total:</span>
                <span className="text-lg font-bold text-primary">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Add-ons charges are in addition to your space rental fee. <AddOnsTermsDialog />
              </p>
            </div>

            <Button 
              size="lg" 
              onClick={handleApply} 
              disabled={selectedItems.length === 0}
              className="w-full"
            >
              Add to booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

