import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // In a real scenario, you'd check against a hashed password in Supabase
    // For demo/unification purposes, mirroring the current Java/UI demo credentials
    if (username === 'admin' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        adminId: '1',
        username: 'admin',
        fullName: 'Studio Administrator'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid username or password'
    }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
