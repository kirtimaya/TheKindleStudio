import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/)) {
      return NextResponse.json({ success: false, message: 'Invalid email address format.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry to 10 minutes from now
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error } = await supabaseAdmin
      .from('users')
      .upsert({
        email: cleanEmail,
        otp_code: otp,
        otp_expiry: expiry,
        is_verified: false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (error) throw error;

    // For demo purposes, just like the Java backend
    console.log(`OTP for ${cleanEmail}: ${otp}`);

    return NextResponse.json({ 
      success: true, 
      message: `OTP sent to ${cleanEmail}. For demo purposes, OTP is: ${otp}` 
    });
  } catch (error: any) {
    console.error('OTP Send error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
