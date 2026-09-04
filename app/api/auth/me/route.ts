import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { findUserById, getDbInfo } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser(req);
    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    const user = await findUserById(session.id);
    const dbInfo = getDbInfo();

    return NextResponse.json({
      authenticated: true,
      user: user || {
        id: session.id,
        username: session.username,
        email: session.email,
      },
      database: dbInfo,
    });
  } catch (error) {
    console.error('Me API Error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
