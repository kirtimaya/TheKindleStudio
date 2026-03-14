import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  try {
    const { data: updated, error } = await supabaseAdmin
      .from('payments')
      .update({ 
        status: 'CANCELLED',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      orderId: updated.order_id,
      phoneNumber: updated.phone_number,
      amount: updated.amount,
      paymentSource: updated.payment_source,
      status: updated.status,
      createdAt: updated.created_at
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
