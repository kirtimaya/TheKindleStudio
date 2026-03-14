import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        customer_name: body.customerName,
        email: body.email,
        phone: body.phone,
        space_name: body.spaceName,
        package_name: body.packageName,
        event_date: body.eventDate,
        time_slot: body.timeSlot,
        notes: body.notes,
        add_ons: body.addOns,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');

  try {
    let query = supabaseAdmin.from('bookings').select('*');

    if (phone) {
      query = query.eq('phone', phone.trim());
    } else if (email) {
      query = query.eq('email', email.toLowerCase().trim());
    } else {
      // Default to all for admin (with proper auth in real world)
      query = query.order('event_date', { ascending: false });
    }

    const { data: bookings, error } = await query;

    if (error) throw error;

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Booking fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
