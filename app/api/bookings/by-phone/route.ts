import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  try {
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('phone', phone.trim())
      .order('event_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Booking lookup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
