import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const body = await request.json();
    
    // In a real scenario, check for admin authenticated session here
    
    const { data: updated, error } = await supabaseAdmin
      .from('bookings')
      .update({
        customer_name: body.customerName,
        email: body.email,
        phone: body.phone,
        space_name: body.spaceName,
        package_name: body.packageName,
        event_date: body.eventDate,
        time_slot: body.timeSlot,
        notes: body.notes,
        add_ons: body.addOns,
        status: body.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Admin booking update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
