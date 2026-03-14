import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('event_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Fetch all bookings error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
