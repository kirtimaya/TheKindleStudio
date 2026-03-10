'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Clock, XCircle, Edit2, Save, X, LogOut } from 'lucide-react'
import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

interface AdminSession {
  adminId: string
  username: string
  fullName: string
  loginTime: string
}

interface Booking {
  id: number
  customerName: string
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
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Space</TableHead>
                      <TableHead>Event Date</TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map(booking => (
                      <TableRow key={booking.id} className="hover:bg-secondary/50">
                        <TableCell className="font-medium">
                          {editingId === booking.id ? (
                            <Input
                              value={editingData.customerName || ''}
                              onChange={(e) => setEditingData({ ...editingData, customerName: e.target.value })}
                              className="h-8"
                            />
                          ) : (
                            booking.customerName
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === booking.id ? (
                            <Input
                              value={editingData.phone || ''}
                              onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
                              className="h-8"
                            />
                          ) : (
                            booking.phone
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{booking.spaceName}</TableCell>
                        <TableCell className="text-sm">{booking.eventDate}</TableCell>
                        <TableCell className="text-sm">{booking.timeSlot}</TableCell>
                        <TableCell>
                          {editingId === booking.id ? (
                            <Select value={editingData.status || booking.status} onValueChange={handleStatusChange}>
                              <SelectTrigger className="h-8 w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center gap-2">
                              {getStatusIcon(booking.status)}
                              {getStatusBadge(booking.status)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === booking.id ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditSave(booking.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleEditCancel}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStart(booking)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-4 h-4" />
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
