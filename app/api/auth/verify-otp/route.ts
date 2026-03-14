import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();
    const cleanEmail = email?.toLowerCase().trim();

    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ success: false, message: 'Email not found. Please send OTP first.' }, { status: 400 });
    }

    // Check expiry
    if (new Date() > new Date(user.otp_expiry)) {
      return NextResponse.json({ success: false, message: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }

    // Verify OTP
    if (user.otp_code !== otp) {
      return NextResponse.json({ success: false, message: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

    // Mark as verified
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        is_verified: true,
        otp_code: null,
        otp_expiry: null,
        updated_at: new Date().toISOString()
      })
      .eq('email', cleanEmail);

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      message: 'OTP verified successfully!',
      email: cleanEmail
    });
  } catch (error: any) {
    console.error('OTP Verify error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
