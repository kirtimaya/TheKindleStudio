import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const orderId = `ORD-${Date.now()}-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;

    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .insert({
        order_id: orderId,
        phone_number: body.phoneNumber,
        amount: body.amount,
        payment_source: body.paymentSource,
        card_last_four: body.cardLastFour,
        card_brand: body.cardBrand,
        upi_id: body.upiId,
        booking_id: body.bookingId,
        addons_total: body.addonsTotal,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      orderId: payment.order_id,
      phoneNumber: payment.phone_number,
      amount: payment.amount,
      paymentSource: payment.payment_source,
      status: payment.status,
      createdAt: payment.created_at
    }, { status: 201 });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
