'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-2">
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

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Selected add-ons:{' '}
            <span className="font-medium text-foreground">{selectedItems.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <span className="text-muted-foreground mr-1">Add-ons total:</span>
              <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <Button size="sm" onClick={handleApply} disabled={selectedItems.length === 0}>
              Add to booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

