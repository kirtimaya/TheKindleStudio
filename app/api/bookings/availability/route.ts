import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const ALL_SLOTS = [
  "10:00 - 13:00",
  "13:00 - 16:00",
  "16:00 - 19:00",
  "19:00 - 22:00"
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const spaceName = searchParams.get('spaceName');
  const date = searchParams.get('date');

  if (!spaceName || !date) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('time_slot')
      .eq('space_name', spaceName)
      .eq('event_date', date)
      .neq('status', 'CANCELLED');

    if (error) throw error;

    const bookedSlotsNormalized = bookings.map(b => b.time_slot);
    
    // Filter ALL_SLOTS based on normalized booked slots
    const bookedSlots = ALL_SLOTS.filter(slot => bookedSlotsNormalized.includes(slot));

    return NextResponse.json({
      spaceName,
      date,
      bookedSlots
    });
  } catch (error: any) {
    console.error('Availability check error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
