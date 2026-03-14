import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  try {
    const { data: payment, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({
      orderId: payment.order_id,
      phoneNumber: payment.phone_number,
      amount: payment.amount,
      paymentSource: payment.payment_source,
      status: payment.status,
      createdAt: payment.created_at
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  const { pathname } = new URL(request.url);
  
  // Handlers for /api/payments/{orderId}/complete and /api/payments/{orderId}/cancel
  const isComplete = pathname.endsWith('/complete');
  const isCancel = pathname.endsWith('/cancel');

  try {
    const status = isComplete ? 'COMPLETED' : isCancel ? 'CANCELLED' : null;
    
    if (!status) {
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('payments')
      .update({ 
        status,
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
