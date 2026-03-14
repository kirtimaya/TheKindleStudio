import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data: message, error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message,
        status: 'NEW'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error('Contact message error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
