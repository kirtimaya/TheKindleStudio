import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { phoneNumber: string } }
) {
  const { phoneNumber } = params;

  try {
    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('phone_number', phoneNumber)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(payments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
