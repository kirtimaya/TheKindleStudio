'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Clock, XCircle, Edit2, Save, X, LogOut, Info } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api'

const ALL_SLOTS = ['10:00 - 13:00', '13:00 - 16:00', '16:00 - 19:00', '19:00 - 22:00']

interface AdminSession {
  adminId: string
  username: string
  fullName: string
  loginTime: string
}

interface Booking {
  id: number
  customerName: string
  email: string
  phone: string
  spaceName: string
  packageName?: string
  eventDate: string
  timeSlot: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  notes?: string
  addOns?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingData, setEditingData] = useState<Partial<Booking>>({})
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL')
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [bookedSlotsForEditing, setBookedSlotsForEditing] = useState<string[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const sessionStr = localStorage.getItem('adminSession')
    if (!sessionStr) {
      setAuthError('Not authenticated')
      router.push('/admin/login')
      return
    }

    try {
      const session = JSON.parse(sessionStr) as AdminSession
      setAdminSession(session)
      fetchBookings()
    } catch (err) {
      setAuthError('Invalid session')
      router.push('/admin/login')
    }
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/bookings/admin/all`)
      if (!response.ok) throw new Error('Failed to fetch bookings')
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditStart = (booking: Booking) => {
    setEditingId(booking.id)
    setEditingData({ ...booking })
    fetchAvailabilityForEditing(booking.spaceName, booking.eventDate)
  }

  const fetchAvailabilityForEditing = async (spaceName: string, date: string) => {
    if (!date || !spaceName) return
    try {
      setLoadingAvailability(true)
      const res = await fetch(
        `${API_BASE_URL}/api/bookings/availability?spaceName=${encodeURIComponent(spaceName)}&date=${date}`,
      )
      if (res.ok) {
        const data = await res.json()
        setBookedSlotsForEditing(data.bookedSlots ?? [])
      }
    } catch (err) {
      console.error('Failed to fetch availability', err)
    } finally {
      setLoadingAvailability(false)
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditingData({})
  }

  const handleEditSave = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/admin/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData),
      })
      if (!response.ok) throw new Error('Failed to update booking')
      
      setBookings(bookings.map(b => b.id === id ? { ...b, ...editingData } : b))
      setEditingId(null)
      setEditingData({})
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const handleStatusChange = (status: string) => {
    setEditingData({ ...editingData, status: status as Booking['status'] })
  }

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Confirmed</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Pending</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Cancelled</Badge>
    }
  }

  const filteredBookings = bookings.filter(b => 
    statusFilter === 'ALL' || b.status === statusFilter
  )

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  if (authError && !adminSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Please log in to access the admin dashboard.</p>
            <Button asChild className="w-full">
              <Link href="/admin/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!adminSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome, {adminSession.fullName} • Manage all bookings and verify customer requests</p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Back to Site</Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Bookings</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading bookings...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No bookings found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[180px] min-w-[180px]">Customer</TableHead>
                      <TableHead className="w-[200px] min-w-[200px]">Contact Info</TableHead>
                      <TableHead className="w-[200px] min-w-[200px]">Space</TableHead>
                      <TableHead className="w-[280px] min-w-[280px]">Date & Time</TableHead>
                      <TableHead className="w-[340px] min-w-[340px]">Add-ons</TableHead>
                      <TableHead className="w-[340px] min-w-[340px]">Notes</TableHead>
                      <TableHead className="w-[140px] min-w-[140px]">Status</TableHead>
                      <TableHead className="w-[120px] min-w-[120px] text-right sticky right-0 bg-muted/90 backdrop-blur shadow-[-4px_0_10px_rgba(0,0,0,0.05)] z-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map(booking => (
                      <TableRow key={booking.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-medium align-top py-4">
                          {editingId === booking.id ? (
                            <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Name</Label>
                              <Input
                                value={editingData.customerName || ''}
                                onChange={(e) => setEditingData({ ...editingData, customerName: e.target.value })}
                                className="h-8 w-full text-xs"
                              />
                            </div>
                          ) : (
                            <span className="break-words font-semibold">{booking.customerName}</span>
                          )}
                        </TableCell>
                        <TableCell className="align-top py-4">
                          {editingId === booking.id ? (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <Label className="text-[10px] text-muted-foreground uppercase font-bold text-[9px]">Email</Label>
                                <Input
                                  value={editingData.email || ''}
                                  onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                                  className="h-8 w-full text-xs"
                                  placeholder="Email"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px] text-muted-foreground uppercase font-bold text-[9px]">Phone</Label>
                                <Input
                                  value={editingData.phone || ''}
                                  onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
                                  className="h-8 w-full text-xs"
                                  placeholder="Phone"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5 p-1">
                              <div className="flex items-center gap-1.5 text-xs text-foreground group">
                                <span className="p-1 rounded bg-primary/5 text-primary">@</span>
                                <span className="font-medium break-all">{booking.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <span className="p-1 rounded bg-secondary/50 text-muted-foreground">#</span>
                                <span className="font-mono">{booking.phone}</span>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm align-top leading-tight py-4">
                          <span className="line-clamp-2 font-medium">{booking.spaceName}</span>
                        </TableCell>
                        <TableCell className="text-sm align-top py-4">
                          {editingId === booking.id ? (
                            <div className="flex flex-col gap-3 w-full">
                              <div className="space-y-1">
                                <Label className="text-[10px] font-bold text-primary uppercase tracking-tight text-[9px]">Select Event Date</Label>
                                <Input
                                  type="date"
                                  value={editingData.eventDate || ''}
                                  onChange={(e) => {
                                    const newDate = e.target.value
                                    setEditingData({ ...editingData, eventDate: newDate })
                                    fetchAvailabilityForEditing(editingData.spaceName || booking.spaceName, newDate)
                                  }}
                                  className="h-9 text-xs bg-background border-primary/20"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px] font-bold text-primary uppercase tracking-tight text-[9px]">Select 3-Hour Slot</Label>
                                <Select 
                                  value={editingData.timeSlot || ''} 
                                  onValueChange={(val) => setEditingData({ ...editingData, timeSlot: val })}
                                >
                                  <SelectTrigger className="h-9 text-xs bg-background border-primary/20">
                                    <SelectValue placeholder="Choose slot" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ALL_SLOTS.map(slot => (
                                      <SelectItem key={slot} value={slot}>
                                        <div className="flex items-center justify-between w-full gap-4">
                                          <span>{slot}</span>
                                          {bookedSlotsForEditing.includes(slot) && (
                                            <span className="text-[10px] font-bold text-red-500 uppercase ml-2 bg-red-50 px-1 rounded">Booked</span>
                                          )}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {loadingAvailability && <p className="text-[9px] text-muted-foreground animate-pulse">Checking availability...</p>}
                              </div>
                            </div>
                          ) : (
                            <div className="leading-tight bg-secondary/30 p-2.5 rounded-lg border border-border/50 shadow-sm group hover:bg-secondary/40 transition-colors">
                              <p className="font-bold text-xs text-foreground tracking-tight">{booking.eventDate}</p>
                              <p className="text-primary text-[10px] mt-1.5 font-bold bg-primary/10 inline-block px-1.5 py-0.5 rounded shadow-sm">{booking.timeSlot}</p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="align-top py-4">
                          {editingId === booking.id ? (
                            <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Add-ons</Label>
                              <Textarea
                                value={editingData.addOns || ''}
                                onChange={(e) => setEditingData({ ...editingData, addOns: e.target.value })}
                                className="min-h-[90px] text-[11px] leading-tight resize-none bg-background shadow-inner"
                                placeholder="Edit add-ons..."
                              />
                            </div>
                          ) : (
                            <div className="text-[11px] leading-relaxed max-h-[100px] overflow-y-auto pr-2 custom-scrollbar bg-secondary/10 p-2 rounded-md border border-transparent hover:border-border/30 transition-colors">
                              {booking.addOns || <span className="text-muted-foreground italic opacity-50">No add-ons selected</span>}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="align-top py-4">
                          {editingId === booking.id ? (
                            <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Admin/User Notes</Label>
                              <Textarea
                                value={editingData.notes || ''}
                                onChange={(e) => setEditingData({ ...editingData, notes: e.target.value })}
                                className="min-h-[90px] text-[11px] leading-tight resize-none bg-background shadow-inner"
                                placeholder="Internal notes..."
                              />
                            </div>
                          ) : (
                            <div className="text-[11px] leading-relaxed max-h-[100px] overflow-y-auto pr-2 custom-scrollbar bg-secondary/10 p-2 rounded-md border border-transparent hover:border-border/30 transition-colors">
                              {booking.notes || <span className="text-muted-foreground italic opacity-50">No additional notes</span>}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="align-top py-4">
                          {editingId === booking.id ? (
                            <div className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">Status</Label>
                              <Select value={editingData.status || booking.status} onValueChange={handleStatusChange}>
                                <SelectTrigger className="h-8 w-full text-xs bg-background">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING">Pending</SelectItem>
                                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 pt-1">
                              {getStatusBadge(booking.status)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="align-top text-right py-4 sticky right-0 bg-background/95 backdrop-blur shadow-[-4px_0_10px_rgba(0,0,0,0.05)] z-20 border-l border-border/30">
                          {editingId === booking.id ? (
                            <div className="flex flex-col gap-2 items-end">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleEditSave(booking.id)}
                                className="h-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs"
                              >
                                <Save className="w-3.5 h-3.5 mr-1.5" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleEditCancel}
                                className="h-8 w-full border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs"
                              >
                                <X className="w-3.5 h-3.5 mr-1.5" />
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditStart(booking)}
                              className="h-10 px-4 bg-primary/5 border-primary/20 hover:bg-primary hover:text-white text-primary font-bold shadow-sm transition-all flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
