import { NextRequest, NextResponse } from 'next/server';
import { findUserByUsername, findUserByEmail } from '@/lib/db';
import { createSessionToken, verifyPassword, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body; // identifier can be username or email

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน' },
        { status: 400 }
      );
    }

    // Find by username or email
    let user = await findUserByUsername(identifier);
    if (!user && identifier.includes('@')) {
      user = await findUserByEmail(identifier);
    }

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSessionToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        message: 'เข้าสู่ระบบสำเร็จ!',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // Set HTTP-Only Cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
