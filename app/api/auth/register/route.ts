import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, findUserByUsername } from '@/lib/db';
import { createSessionToken, hashPassword, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน (Username, Email, Password)' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: 'Username ต้องมีความยาวระหว่าง 3 - 30 ตัวอักษร' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'รูปแบบ Email ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      );
    }

    // Check existing username
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น' },
        { status: 409 }
      );
    }

    // Check existing email
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email นี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่นหรือเข้าสู่ระบบ' },
        { status: 409 }
      );
    }

    // Hash password & Create user
    const passwordHash = await hashPassword(password);
    const newUser = await createUser({
      username,
      email,
      passwordHash,
    });

    // Create session token
    const token = await createSessionToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    const response = NextResponse.json(
      {
        message: 'สมัครสมาชิกสำเร็จ!',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
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
    console.error('Register API Error:', error);
    return NextResponse.json(
      { error: error?.message ? `เกิดข้อผิดพลาด: ${error.message}` : 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
